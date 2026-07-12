const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

app.get('/api/test', (req, res) => {
  res.json({ status: 'success', message: 'API is running', data: null });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
