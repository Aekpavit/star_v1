const pool = require('../config/db');

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function first(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

module.exports = {
  query,
  first,
  getConnection: pool.getConnection.bind(pool),
};