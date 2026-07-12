const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Verifies the JWT sent as "Authorization: Bearer <token>" and attaches
// the decoded payload ({ id, role, name, email }) to req.user.
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบ', 401));
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('โทเคนไม่ถูกต้องหรือหมดอายุ', 401));
  }
}

// Restricts a route to one or more roles, e.g. authorize('admin').
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้', 403));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
