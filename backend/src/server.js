require('dotenv').config();
const os = require('os');
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

function getLocalIpv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIpv4();
const displayHost = HOST === '0.0.0.0' ? localIp : HOST;

async function startServer() {
  try {
    await db.query('SELECT 1');
    console.log('Database connection: OK');

    app.listen(PORT, HOST, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Server runLAN at http://172.16.193.206:${PORT}/api/test`);
    });
  } catch (error) {
    console.error('Database connection: FAILED');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
