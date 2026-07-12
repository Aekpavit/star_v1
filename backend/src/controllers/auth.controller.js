const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

// POST /api/auth/register  (ข้อ 5.2.1: ลงทะเบียนเพื่อใช้งานระบบ)
// Public endpoint used by evaluatees to self-register. Admin/committee
// accounts are created via POST /api/users by an admin (see users.controller).
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, position, department, school_name, phone } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('กรุณากรอกชื่อ อีเมล และรหัสผ่าน', 400));
  }
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) return next(new AppError('อีเมลนี้ถูกใช้งานแล้ว', 400));

  const password_hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, position, department, school_name, phone)
     VALUES (?, ?, ?, 'evaluatee', ?, ?, ?, ?)`,
    [name, email, password_hash, position || null, department || null, school_name || null, phone || null]
  );

  const [rows] = await pool.query(
    'SELECT id, name, email, role, position, department, school_name, phone FROM users WHERE id = ?',
    [result.insertId]
  );
  const token = signToken(rows[0]);
  sendSuccess(res, { user: rows[0], token }, 'ลงทะเบียนสำเร็จ', 201);
});

// POST /api/auth/login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('กรุณากรอกอีเมลและรหัสผ่าน', 400));

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length) return next(new AppError('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 401));

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return next(new AppError('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 401));

  const token = signToken(user);
  delete user.password_hash;
  sendSuccess(res, { user, token }, 'เข้าสู่ระบบสำเร็จ');
});

// GET /api/auth/me
exports.me = catchAsync(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, committee_role, position, department, school_name, phone FROM users WHERE id = ?',
    [req.user.id]
  );
  sendSuccess(res, rows[0]);
});
