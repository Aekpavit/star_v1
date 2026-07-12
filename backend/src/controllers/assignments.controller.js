const { catchAsync, AppError, sendSuccess } = require('../utils');
const { query } = require('../utils/db');

// POST /api/assignments  { committee_id, evaluatee_id }
// ข้อ 5.1.8: มอบหมายกรรมการให้ประเมินผู้รับการประเมินแต่ละคน
exports.createAssignment = catchAsync(async (req, res, next) => {
  const { committee_id, evaluatee_id } = req.body;
  if (!committee_id || !evaluatee_id) {
    return next(new AppError('กรุณาระบุกรรมการและผู้รับการประเมิน', 400));
  }
  const [users] = await query('SELECT id, role FROM users WHERE id IN (?, ?)', [committee_id, evaluatee_id]);
  const committee = users.find((u) => u.id === Number(committee_id));
  const evaluatee = users.find((u) => u.id === Number(evaluatee_id));
  if (!committee || committee.role !== 'committee') return next(new AppError('ไม่พบกรรมการที่ระบุ', 400));
  if (!evaluatee || evaluatee.role !== 'evaluatee') return next(new AppError('ไม่พบผู้รับการประเมินที่ระบุ', 400));

  const [result] = await query(
    'INSERT INTO committee_assignments (committee_id, evaluatee_id, assigned_by) VALUES (?, ?, ?)',
    [committee_id, evaluatee_id, req.user.id]
  );
  sendSuccess(res, { id: result.insertId }, 'มอบหมายงานสำเร็จ', 201);
});

// GET /api/assignments  (admin: รายการมอบหมายทั้งหมด พร้อมสถานะ)
exports.listAssignments = catchAsync(async (req, res) => {
  const [rows] = await query(
    `SELECT ca.id, ca.assigned_at,
            c.id AS committee_id, c.name AS committee_name, c.committee_role,
            e.id AS evaluatee_id, e.name AS evaluatee_name, e.department,
            s.is_active AS is_signed
     FROM committee_assignments ca
     JOIN users c ON c.id = ca.committee_id
     JOIN users e ON e.id = ca.evaluatee_id
     LEFT JOIN signatures s ON s.assignment_id = ca.id AND s.is_active = 1
     ORDER BY ca.assigned_at DESC`
  );
  sendSuccess(res, rows.map((r) => ({ ...r, is_signed: !!r.is_signed })));
});

// DELETE /api/assignments/:id
exports.deleteAssignment = catchAsync(async (req, res, next) => {
  const [result] = await query('DELETE FROM committee_assignments WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return next(new AppError('ไม่พบรายการมอบหมาย', 404));
  sendSuccess(res, null, 'ยกเลิกการมอบหมายสำเร็จ');
});

