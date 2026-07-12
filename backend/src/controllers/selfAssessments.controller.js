const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// Ensures a self_assessments row exists for (evaluatee, indicator) and
// returns its id. Used by both the score-save and evidence-upload flows.
async function ensureSelfAssessment(conn, evaluateeId, indicatorId) {
  const [rows] = await conn.query(
    'SELECT id FROM self_assessments WHERE evaluatee_id = ? AND indicator_id = ?',
    [evaluateeId, indicatorId]
  );
  if (rows.length) return rows[0].id;
  const [result] = await conn.query(
    'INSERT INTO self_assessments (evaluatee_id, indicator_id, status) VALUES (?, ?, "pending")',
    [evaluateeId, indicatorId]
  );
  return result.insertId;
}

// GET /api/self-assessments/me
// ข้อ 5.2.2: แสดงตัวชี้วัดทั้งหมดของผู้รับการประเมิน พร้อมข้อมูล/คะแนน/หลักฐานปัจจุบัน
exports.myAssessments = catchAsync(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT i.id AS indicator_id, i.name, i.description, i.weight, i.format,
            t.id AS topic_id, t.name AS topic_name,
            sa.id AS self_assessment_id, sa.self_score, sa.status, sa.submitted_at
     FROM indicators i
     JOIN evaluation_topics t ON t.id = i.topic_id
     LEFT JOIN self_assessments sa ON sa.indicator_id = i.id AND sa.evaluatee_id = ?
     WHERE t.status = 'open'
     ORDER BY t.id, i.id`,
    [req.user.id]
  );

  const indicatorIds = rows.map((r) => r.indicator_id);
  let evidenceRows = [];
  if (indicatorIds.length) {
    [evidenceRows] = await pool.query(
      `SELECT ef.self_assessment_id, ef.evidence_type, ef.file_path, ef.uploaded_at
       FROM evidence_files ef
       JOIN self_assessments sa ON sa.id = ef.self_assessment_id
       WHERE sa.evaluatee_id = ?`,
      [req.user.id]
    );
  }
  const data = rows.map((r) => ({
    ...r,
    status: r.status || 'pending',
    evidence: evidenceRows.filter((e) => e.self_assessment_id === r.self_assessment_id)
  }));
  sendSuccess(res, data);
});

// POST /api/self-assessments  { indicator_id, self_score }
// ข้อ 5.2.4: กรอกคะแนนการประเมินตนเอง
exports.saveScore = catchAsync(async (req, res, next) => {
  const { indicator_id, self_score } = req.body;
  if (!indicator_id || self_score == null) {
    return next(new AppError('กรุณาระบุตัวชี้วัดและคะแนน', 400));
  }
  const [indRows] = await pool.query('SELECT format FROM indicators WHERE id = ?', [indicator_id]);
  if (!indRows.length) return next(new AppError('ไม่พบตัวชี้วัด', 404));
  const { format } = indRows[0];
  if (format === 'scale' && ![1, 2, 3, 4].includes(Number(self_score))) {
    return next(new AppError('คะแนนแบบสเกลต้องอยู่ระหว่างระดับ 1-4', 400));
  }
  if (format === 'yesno' && ![0, 1].includes(Number(self_score))) {
    return next(new AppError('คะแนนแบบ มี/ไม่มี ต้องเป็น 0 หรือ 1', 400));
  }

  const conn = await pool.getConnection();
  try {
    const id = await ensureSelfAssessment(conn, req.user.id, indicator_id);
    await conn.query(
      `UPDATE self_assessments SET self_score = ?, status = 'done', submitted_at = NOW() WHERE id = ?`,
      [self_score, id]
    );
    sendSuccess(res, { self_assessment_id: id }, 'บันทึกคะแนนสำเร็จ');
  } finally {
    conn.release();
  }
});

// POST /api/self-assessments/:indicatorId/evidence  (multipart/form-data, field "file")
// ข้อ 5.2.3: เพิ่มหลักฐาน (ไฟล์ PDF/รูปภาพ) หรือ URL ผ่าน body { url }
exports.uploadEvidence = catchAsync(async (req, res, next) => {
  const { indicatorId } = req.params;
  const conn = await pool.getConnection();
  try {
    const selfAssessmentId = await ensureSelfAssessment(conn, req.user.id, indicatorId);

    if (req.file) {
      const ext = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
      await conn.query(
        'INSERT INTO evidence_files (self_assessment_id, evidence_type, file_path) VALUES (?, ?, ?)',
        [selfAssessmentId, ext, `/uploads/${req.file.filename}`]
      );
    } else if (req.body.url) {
      await conn.query(
        'INSERT INTO evidence_files (self_assessment_id, evidence_type, file_path) VALUES (?, "url", ?)',
        [selfAssessmentId, req.body.url]
      );
    } else {
      return next(new AppError('กรุณาแนบไฟล์หรือระบุ URL', 400));
    }
    sendSuccess(res, { self_assessment_id: selfAssessmentId }, 'แนบหลักฐานสำเร็จ', 201);
  } finally {
    conn.release();
  }
});

// GET /api/self-assessments/progress
// ข้อ 5.2.5: ดูความคืบหน้าในการดำเนินงานของแต่ละหัวข้อ
exports.progress = catchAsync(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT t.id AS topic_id, t.name AS topic_name,
            COUNT(i.id) AS total,
            SUM(CASE WHEN sa.status = 'done' THEN 1 ELSE 0 END) AS done
     FROM evaluation_topics t
     JOIN indicators i ON i.topic_id = t.id
     LEFT JOIN self_assessments sa ON sa.indicator_id = i.id AND sa.evaluatee_id = ?
     GROUP BY t.id, t.name`,
    [req.user.id]
  );
  sendSuccess(res, rows);
});

// GET /api/self-assessments/feedback
// ข้อ 5.2.7: ดูความเห็นของกรรมการรายตัวชี้วัด
exports.feedback = catchAsync(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT i.id AS indicator_id, i.name AS indicator_name,
            cs.score, cs.comment, cs.scored_at,
            u.name AS committee_name
     FROM committee_assignments ca
     JOIN committee_scores cs ON cs.assignment_id = ca.id
     JOIN indicators i ON i.id = cs.indicator_id
     JOIN users u ON u.id = ca.committee_id
     WHERE ca.evaluatee_id = ?
     ORDER BY i.id`,
    [req.user.id]
  );
  sendSuccess(res, rows);
});

// POST /api/self-assessments/:indicatorId/reevaluate  { reason }
// ข้อ 5.2.8: ระบบเปิดโอกาสให้ขอรับการประเมินใหม่
exports.requestReevaluation = catchAsync(async (req, res, next) => {
  const { indicatorId } = req.params;
  const { reason } = req.body;
  const [rows] = await pool.query(
    'SELECT id, status FROM self_assessments WHERE evaluatee_id = ? AND indicator_id = ?',
    [req.user.id, indicatorId]
  );
  if (!rows.length) return next(new AppError('ยังไม่มีการประเมินตัวชี้วัดนี้', 404));
  if (rows[0].status !== 'done') return next(new AppError('ขอรับการประเมินใหม่ได้เฉพาะรายการที่ทำเสร็จแล้ว', 400));

  await pool.query('INSERT INTO reevaluation_requests (self_assessment_id, reason) VALUES (?, ?)', [rows[0].id, reason || null]);
  await pool.query('UPDATE self_assessments SET status = "reeval" WHERE id = ?', [rows[0].id]);
  sendSuccess(res, null, 'ส่งคำขอรับการประเมินใหม่สำเร็จ', 201);
});

// GET /api/self-assessments/export  (ข้อ 5.2.6: Export เป็นไฟล์ CSV)
exports.exportCsv = catchAsync(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT t.name AS topic, i.name AS indicator, i.weight, sa.self_score, sa.status
     FROM indicators i
     JOIN evaluation_topics t ON t.id = i.topic_id
     LEFT JOIN self_assessments sa ON sa.indicator_id = i.id AND sa.evaluatee_id = ?
     ORDER BY t.id, i.id`,
    [req.user.id]
  );
  const header = 'หัวข้อ,ตัวชี้วัด,น้ำหนัก,คะแนนตนเอง,สถานะ\n';
  const body = rows
    .map((r) => [r.topic, r.indicator, r.weight, r.self_score ?? '-', r.status || 'pending'].join(','))
    .join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="self_evaluation_export.csv"');
  res.send('\uFEFF' + header + body);
});
