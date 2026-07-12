require('dotenv').config();
const os = require('os');
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    // Fail fast with a clear message if MySQL isn't reachable on localhost.
    await pool.query('SELECT 1');
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
    app.listen(PORT, HOST, () => {
      const addresses = Object.values(os.networkInterfaces())
        .flat()
        .filter((detail) => detail && detail.family === 'IPv4' && !detail.internal)
        .map((detail) => detail.address);

      const displayHosts = Array.from(new Set([`http://localhost:${PORT}`, ...addresses.map((address) => `http://${address}:${PORT}`)]));
      console.log(`Server กำลังทำงานที่ ${displayHosts.join(', ')}`);
    });
  } catch (err) {
    console.error('เชื่อมต่อฐานข้อมูลไม่สำเร็จ:', err.message);
    process.exit(1);
  }
}

start();
