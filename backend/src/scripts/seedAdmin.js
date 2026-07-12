// Creates (or resets the password of) a default admin account.
// Usage: node src/scripts/seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@school.ac.th';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';
const ADMIN_NAME = 'System Admin';

(async () => {
  try {
    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);

    if (existing.length) {
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, existing[0].id]);
      console.log(`อัปเดตรหัสผ่านของแอดมิน (${ADMIN_EMAIL}) เรียบร้อยแล้ว`);
    } else {
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')`,
        [ADMIN_NAME, ADMIN_EMAIL, password_hash]
      );
      console.log(`สร้างบัญชีแอดมินสำเร็จ: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('สร้างบัญชีแอดมินไม่สำเร็จ:', err.message);
    process.exit(1);
  }
})();
