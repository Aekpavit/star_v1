require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Server available on LAN at http://${HOST === '0.0.0.0' ? 'your-ip-address' : HOST}:${PORT}`);
});
