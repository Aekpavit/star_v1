const pool = require('../config/db');

function query(sql, params = []) {
  return pool.query(sql, params);
}

async function first(sql, params = []) {
  const [rows] = await query(sql, params);
  return rows[0] || null;
}

module.exports = {
  query,
  first,
  getConnection: pool.getConnection.bind(pool),
};
