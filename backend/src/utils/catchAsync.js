// Wraps an async controller so rejected promises are forwarded to the
// centralized error handler instead of crashing the process.
module.exports = function catchAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
