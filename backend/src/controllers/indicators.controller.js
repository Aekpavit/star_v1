const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

async function attachDetails(indicator) {
  const [levels] = await pool.query(
    'SELECT level_no, description FROM indicator_levels WHERE indicator_id = ? ORDER BY level_no',
    [indicator.id]
  );
  const [evidence] = await pool.query(
    'SELECT evidence_type FROM indicator_evidence_types WHERE indicator_id = ?',
    [indicator.id]
  );
  return { ...indicator, levels, evidence_types: evidence.map((e) => e.evidence_type) };
}

// GET /api/indicators?topic_id=1
exports.listIndicators = catchAsync(async (req, res) => {
  const { topic_id } = req.query;
  let sql = 'SELECT * FROM indicators';
  const params = [];
  if (topic_id) { sql += ' WHERE topic_id = ?'; params.push(topic_id); }
  sql += ' ORDER BY created_at ASC';
  const [rows] = await pool.query(sql, params);
  const detailed = await Promise.all(rows.map(attachDetails));
  sendSuccess(res, detailed);
});

// GET /api/indicators/:id
exports.getIndicator = catchAsync(async (req, res, next) => {
  const [rows] = await pool.query('SELECT * FROM indicators WHERE id = ?', [req.params.id]);
  if (!rows.length) return next(new AppError('ไม่พบตัวชี้วัด', 404));
  sendSuccess(res, await attachDetails(rows[0]));
});

// POST /api/indicators
// ข้อ 5.1.3: เพิ่มตัวชี้วัด (ชื่อ/รายละเอียด/น้ำหนัก/หลักฐาน)
// ข้อ 5.1.4: กำหนดรูปแบบ scale(พร้อมคำอธิบายระดับ 1-4) หรือ yesno
// ข้อ 5.1.5: กำหนดประเภทหลักฐานที่อนุญาตให้แนบ
exports.createIndicator = catchAsync(async (req, res, next) => {
  const { topic_id, name, description, weight, format, levels, evidence_types } = req.body;
  if (!topic_id || !name || weight == null || !format) {
    return next(new AppError('กรุณากรอกหัวข้อ ชื่อ น้ำหนักคะแนน และรูปแบบการประเมิน', 400));
  }
  if (!['scale', 'yesno'].includes(format)) {
    return next(new AppError('รูปแบบการประเมินต้องเป็น scale หรือ yesno', 400));
  }
  if (format === 'scale' && (!Array.isArray(levels) || levels.length !== 4)) {
    return next(new AppError('รูปแบบ scale ต้องระบุคำอธิบายระดับให้ครบ 4 ระดับ', 400));
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO indicators (topic_id, name, description, weight, format) VALUES (?, ?, ?, ?, ?)',
      [topic_id, name, description || null, weight, format]
    );
    const indicatorId = result.insertId;

    if (format === 'scale') {
      const values = levels.map((desc, idx) => [indicatorId, idx + 1, desc]);
      await conn.query('INSERT INTO indicator_levels (indicator_id, level_no, description) VALUES ?', [values]);
    }
    if (Array.isArray(evidence_types) && evidence_types.length) {
      const values = evidence_types.map((t) => [indicatorId, t]);
      await conn.query('INSERT INTO indicator_evidence_types (indicator_id, evidence_type) VALUES ?', [values]);
    }

    await conn.commit();
    sendSuccess(res, { id: indicatorId }, 'เพิ่มตัวชี้วัดสำเร็จ', 201);
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

// PUT /api/indicators/:id
exports.updateIndicator = catchAsync(async (req, res, next) => {
  const { name, description, weight } = req.body;
  const [result] = await pool.query(
    'UPDATE indicators SET name = COALESCE(?, name), description = COALESCE(?, description), weight = COALESCE(?, weight) WHERE id = ?',
    [name, description, weight, req.params.id]
  );
  if (!result.affectedRows) return next(new AppError('ไม่พบตัวชี้วัด', 404));
  sendSuccess(res, null, 'อัปเดตตัวชี้วัดสำเร็จ');
});

// DELETE /api/indicators/:id
exports.deleteIndicator = catchAsync(async (req, res, next) => {
  const [result] = await pool.query('DELETE FROM indicators WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return next(new AppError('ไม่พบตัวชี้วัด', 404));
  sendSuccess(res, null, 'ลบตัวชี้วัดสำเร็จ');
});
