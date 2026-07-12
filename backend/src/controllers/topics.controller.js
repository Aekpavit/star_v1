const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/topics
exports.listTopics = catchAsync(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM evaluation_topics ORDER BY created_at DESC');
  sendSuccess(res, rows);
});

// GET /api/topics/:id
exports.getTopic = catchAsync(async (req, res, next) => {
  const [rows] = await pool.query('SELECT * FROM evaluation_topics WHERE id = ?', [req.params.id]);
  if (!rows.length) return next(new AppError('ไม่พบหัวข้อการประเมิน', 404));
  sendSuccess(res, rows[0]);
});

// POST /api/topics  (ข้อ 5.1.1-5.1.2: เพิ่มหัวข้อ + กำหนดช่วงเวลาเปิด/ปิด)
exports.createTopic = catchAsync(async (req, res, next) => {
  const { name, start_date, end_date, status } = req.body;
  if (!name || !start_date || !end_date) {
    return next(new AppError('กรุณากรอกชื่อหัวข้อ วันเริ่ม และวันสิ้นสุด', 400));
  }
  const [result] = await pool.query(
    'INSERT INTO evaluation_topics (name, start_date, end_date, status, created_by) VALUES (?, ?, ?, ?, ?)',
    [name, start_date, end_date, status || 'open', req.user.id]
  );
  sendSuccess(res, { id: result.insertId }, 'เพิ่มหัวข้อการประเมินสำเร็จ', 201);
});

// PUT /api/topics/:id
exports.updateTopic = catchAsync(async (req, res, next) => {
  const { name, start_date, end_date } = req.body;
  const [result] = await pool.query(
    `UPDATE evaluation_topics SET name = COALESCE(?, name), start_date = COALESCE(?, start_date),
     end_date = COALESCE(?, end_date) WHERE id = ?`,
    [name, start_date, end_date, req.params.id]
  );
  if (!result.affectedRows) return next(new AppError('ไม่พบหัวข้อการประเมิน', 404));
  sendSuccess(res, null, 'อัปเดตหัวข้อสำเร็จ');
});

// PATCH /api/topics/:id/status  (สลับเปิด/ปิดการประเมิน)
exports.toggleStatus = catchAsync(async (req, res, next) => {
  const [rows] = await pool.query('SELECT status FROM evaluation_topics WHERE id = ?', [req.params.id]);
  if (!rows.length) return next(new AppError('ไม่พบหัวข้อการประเมิน', 404));
  const next_status = rows[0].status === 'open' ? 'closed' : 'open';
  await pool.query('UPDATE evaluation_topics SET status = ? WHERE id = ?', [next_status, req.params.id]);
  sendSuccess(res, { status: next_status }, 'เปลี่ยนสถานะสำเร็จ');
});

// DELETE /api/topics/:id
exports.deleteTopic = catchAsync(async (req, res, next) => {
  const [result] = await pool.query('DELETE FROM evaluation_topics WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return next(new AppError('ไม่พบหัวข้อการประเมิน', 404));
  sendSuccess(res, null, 'ลบหัวข้อสำเร็จ');
});
