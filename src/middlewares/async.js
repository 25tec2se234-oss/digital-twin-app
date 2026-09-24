/**
 * Wraps an async Express route handler to automatically catch errors
 * and forward them to next() instead of crashing the server.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
