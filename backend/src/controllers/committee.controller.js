const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// Loads an assignment and verifies it belongs to the logged-in committee
// member (unless the caller is an admin, who may view any assignment).
async function loadOwnedAssignment(req, next) {
  const [rows] = await pool.query(
    `SELECT ca.*, e.name AS evaluatee_name, e.position, e.department, e.school_name
     FROM committee_assignments ca
     JOIN users e ON e.id = ca.evaluatee_id
     WHERE ca.id = ?`,
    [req.params.id]
  );
  if (!rows.length) { next(new AppError('ไม่พบรายการมอบหมาย', 404)); return null; }
  const assignment = rows[0];
  if (req.user.role === 'committee' && assignment.committee_id !== req.user.id) {
    next(new AppError('คุณไม่มีสิทธิ์เข้าถึงรายการนี้', 403));
    return null;
  }
  return assignment;
}

// GET /api/committee/my-assignments
// ข้อ 5.3.1: แสดงข้อมูลของผู้ที่กรรมการต้องประเมิน
exports.myAssignments = catchAsync(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ca.id AS assignment_id, e.id AS evaluatee_id, e.name, e.position, e.department,
            s.is_active AS is_signed
     FROM committee_assignments ca
     JOIN users e ON e.id = ca.evaluatee_id
     LEFT JOIN signatures s ON s.assignment_id = ca.id AND s.is_active = 1
     WHERE ca.committee_id = ?
     ORDER BY ca.assigned_at DESC`,
    [req.user.id]
  );
  sendSuccess(res, rows.map((r) => ({ ...r, is_signed: !!r.is_signed })));
});

// GET /api/committee/assignments/:id
// ข้อ 5.3.2-5.3.3: รายละเอียดตัวชี้วัด + คะแนนที่ผู้รับการประเมินให้ตนเอง + คะแนน/ความเห็นกรรมการที่มีอยู่แล้ว
exports.assignmentDetail = catchAsync(async (req, res, next) => {
  const assignment = await loadOwnedAssignment(req, next);
  if (!assignment) return;

  const [indicators] = await pool.query(
    `SELECT i.id, i.name, i.description, i.weight, i.format,
            sa.self_score, sa.status AS self_status,
            cs.score AS committee_score, cs.comment
     FROM indicators i
     JOIN evaluation_topics t ON t.id = i.topic_id AND t.status = 'open'
     LEFT JOIN self_assessments sa ON sa.indicator_id = i.id AND sa.evaluatee_id = ?
     LEFT JOIN committee_scores cs ON cs.indicator_id = i.id AND cs.assignment_id = ?
     ORDER BY i.id`,
    [assignment.evaluatee_id, assignment.id]
  );

  const [sig] = await pool.query(
    `SELECT s.*, u.name AS signed_by_name FROM signatures s
     JOIN users u ON u.id = s.signed_by
     WHERE s.assignment_id = ? AND s.is_active = 1`,
    [assignment.id]
  );

  sendSuccess(res, { assignment, indicators, signature: sig[0] || null });
});

// POST /api/committee/assignments/:id/scores  { indicator_id, score, comment }
// ข้อ 5.3.4-5.3.5: ให้คะแนนและความเห็น
exports.saveScore = catchAsync(async (req, res, next) => {
  const assignment = await loadOwnedAssignment(req, next);
  if (!assignment) return;

  const [sig] = await pool.query('SELECT id FROM signatures WHERE assignment_id = ? AND is_active = 1', [assignment.id]);
  if (sig.length) return next(new AppError('ลงนามแล้ว กรุณายกเลิกการลงนามก่อนแก้ไขคะแนน', 400));

  const { indicator_id, score, comment } = req.body;
  if (!indicator_id || score == null) return next(new AppError('กรุณาระบุตัวชี้วัดและคะแนน', 400));

  const [existing] = await pool.query(
    'SELECT id FROM committee_scores WHERE assignment_id = ? AND indicator_id = ?',
    [assignment.id, indicator_id]
  );
  if (existing.length) {
    await pool.query(
      'UPDATE committee_scores SET score = ?, comment = ?, scored_at = NOW() WHERE id = ?',
      [score, comment || null, existing[0].id]
    );
  } else {
    await pool.query(
      'INSERT INTO committee_scores (assignment_id, indicator_id, score, comment, scored_at) VALUES (?, ?, ?, ?, NOW())',
      [assignment.id, indicator_id, score, comment || null]
    );
  }
  sendSuccess(res, null, 'บันทึกคะแนนสำเร็จ');
});

// GET /api/committee/assignments/:id/result
// ข้อ 5.3.6: แสดงผลลัพธ์การประเมิน (คะแนนเฉลี่ยถ่วงน้ำหนัก)
exports.result = catchAsync(async (req, res, next) => {
  const assignment = await loadOwnedAssignment(req, next);
  if (!assignment) return;

  const [rows] = await pool.query(
    `SELECT i.weight, cs.score
     FROM indicators i
     LEFT JOIN committee_scores cs ON cs.indicator_id = i.id AND cs.assignment_id = ?`,
    [assignment.id]
  );
  const scored = rows.filter((r) => r.score != null);
  const totalWeight = scored.reduce((sum, r) => sum + Number(r.weight), 0);
  const weightedSum = scored.reduce((sum, r) => sum + Number(r.weight) * Number(r.score), 0);
  const average = totalWeight ? Number((weightedSum / totalWeight).toFixed(2)) : null;

  sendSuccess(res, { average, scored_count: scored.length, total_indicators: rows.length });
});

// POST /api/committee/assignments/:id/sign
// ข้อ 5.3.7: ลงนามการประเมิน (signed_by อ้างอิงถึง users.id ของกรรมการที่ลงนาม)
exports.sign = catchAsync(async (req, res, next) => {
  const assignment = await loadOwnedAssignment(req, next);
  if (!assignment) return;

  const [active] = await pool.query('SELECT id FROM signatures WHERE assignment_id = ? AND is_active = 1', [assignment.id]);
  if (active.length) return next(new AppError('ลงนามไปแล้ว', 400));

  const [scored] = await pool.query(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN cs.score IS NOT NULL THEN 1 ELSE 0 END) AS done
     FROM indicators i
     LEFT JOIN committee_scores cs ON cs.indicator_id = i.id AND cs.assignment_id = ?`,
    [assignment.id]
  );
  if (scored[0].done < scored[0].total) {
    return next(new AppError('กรุณาให้คะแนนครบทุกตัวชี้วัดก่อนลงนาม', 400));
  }

  await pool.query(
    'INSERT INTO signatures (assignment_id, signed_by, signed_at, is_active) VALUES (?, ?, NOW(), 1)',
    [assignment.id, req.user.id]
  );
  sendSuccess(res, null, 'ลงนามการประเมินสำเร็จ', 201);
});

// DELETE /api/committee/assignments/:id/sign
// ข้อ 5.3.8: ยกเลิกการลงนาม
exports.cancelSign = catchAsync(async (req, res, next) => {
  const assignment = await loadOwnedAssignment(req, next);
  if (!assignment) return;

  const [result] = await pool.query(
    'UPDATE signatures SET is_active = 0, cancelled_at = NOW() WHERE assignment_id = ? AND is_active = 1',
    [assignment.id]
  );
  if (!result.affectedRows) return next(new AppError('ยังไม่มีการลงนามที่ใช้งานอยู่', 400));
  sendSuccess(res, null, 'ยกเลิกการลงนามสำเร็จ');
});
