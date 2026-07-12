const AppError = require('../utils/AppError');

// 404 handler for unmatched routes.
function notFound(req, res, next) {
  next(new AppError(`ไม่พบเส้นทาง ${req.originalUrl}`, 404));
}

// Centralized error handler — every route funnels errors here via
// catchAsync() or next(err), so the JSON response shape stays consistent.
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'เกิดข้อผิดพลาดภายในระบบ';

  // MySQL duplicate entry (e.g. unique index violated)
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = 'ข้อมูลนี้มีอยู่ในระบบแล้ว';
  }
  // MySQL FK constraint violated (referenced row missing)
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    statusCode = 400;
    message = 'ข้อมูลอ้างอิงไม่ถูกต้อง';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    status: statusCode < 500 ? 'fail' : 'error',
    message,
    data: null
  });
}

module.exports = { notFound, errorHandler };
