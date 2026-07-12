function sendSuccess(res, data = null, message = 'สำเร็จ', statusCode = 200) {
  return res.status(statusCode).json({ status: 'success', message, data });
}

module.exports = { sendSuccess };
