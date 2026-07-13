const bcrypt = require('bcryptjs');
const { catchAsync, AppError, sendSuccess } = require('../utils');
const { query } = require('../utils/db');

// POST /api/users  (admin only)
exports.createUser = catchAsync(async (req, res, next) => {
  const { 
    name, 
    email, 
    password, 
    role, 
    committee_role, 
    position, 
    department, 
    school_name, 
    phone 
  } = req.body;

  if (!name || !email || !password || !role) {
    return next(new AppError('กรุณากรอกชื่อ อีเมล รหัสผ่าน และบทบาท', 400));
  }

  if (!['admin', 'evaluatee', 'committee'].includes(role)) {
    return next(new AppError('บทบาทไม่ถูกต้อง', 400));
  }

  const existing = await query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existing.length) {
    return next(new AppError('อีเมลนี้ถูกใช้งานแล้ว', 400));
  }

  const password_hash = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users 
    (
      name,
      email,
      password_hash,
      role,
      committee_role,
      position,
      department,
      school_name,
      phone
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      password_hash,
      role,
      committee_role || null,
      position || null,
      department || null,
      school_name || null,
      phone || null
    ]
  );

  sendSuccess(
    res,
    { id: result.insertId },
    'สร้างบัญชีผู้ใช้สำเร็จ',
    201
  );
});


// GET /api/users?role=evaluatee|committee|admin
exports.listUsers = catchAsync(async (req, res) => {

  const { role } = req.query;

  let sql = `
    SELECT 
      id,
      name,
      email,
      role,
      committee_role,
      position,
      department,
      school_name,
      phone,
      created_at
    FROM users
  `;

  const params = [];

  if (role) {
    sql += ' WHERE role = ?';
    params.push(role);
  }

  sql += ' ORDER BY created_at DESC';


  const rows = await query(sql, params);

  sendSuccess(res, rows);
});


// GET /api/users/:id
exports.getUser = catchAsync(async (req, res, next) => {

  const rows = await query(
    `
    SELECT 
      id,
      name,
      email,
      role,
      committee_role,
      position,
      department,
      school_name,
      phone,
      created_at
    FROM users
    WHERE id = ?
    `,
    [req.params.id]
  );


  if (!rows.length) {
    return next(new AppError('ไม่พบผู้ใช้', 404));
  }


  sendSuccess(res, rows[0]);
});


// PUT /api/users/:id
exports.updateUser = catchAsync(async (req, res, next) => {

  const { 
    name, 
    position, 
    department, 
    school_name, 
    phone, 
    committee_role 
  } = req.body;


  const result = await query(
    `
    UPDATE users SET
      name = COALESCE(?, name),
      position = COALESCE(?, position),
      department = COALESCE(?, department),
      school_name = COALESCE(?, school_name),
      phone = COALESCE(?, phone),
      committee_role = COALESCE(?, committee_role)
    WHERE id = ?
    `,
    [
      name,
      position,
      department,
      school_name,
      phone,
      committee_role,
      req.params.id
    ]
  );


  if (!result.affectedRows) {
    return next(new AppError('ไม่พบผู้ใช้', 404));
  }


  sendSuccess(
    res,
    null,
    'อัปเดตข้อมูลสำเร็จ'
  );

});