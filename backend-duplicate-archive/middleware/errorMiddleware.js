// Catches routes that don't match anything
function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

// Centralized error handler — never leaks stack traces / internals to the client
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Something went wrong. Please try again.';

  if (err.code === 'LIMIT_FILE_SIZE') { statusCode = 400; message = 'Image is too large. Maximum size is 5MB per image.'; }
  if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') { statusCode = 400; message = 'Too many images uploaded. Use up to 6 main photos and 24 colour photos.'; }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // Duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field ? field : 'Field'} already exists`;
  }

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { notFound, errorHandler };
