// backend/src/middlewares/error.js
function errorHandler(err, req, res, next) {
  console.error('[Error]', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Erro interno do servidor.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;