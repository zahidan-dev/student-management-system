/**
 * Async Handler Utility
 *
 * Wraps async controller functions and forwards
 * rejected promises to Express error middleware.
 *
 * This keeps controllers clean and avoids repetitive
 * try/catch blocks.
 */

const asyncHandler = (controllerFunction) => {
  return (req, res, next) => {
    Promise.resolve(controllerFunction(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;