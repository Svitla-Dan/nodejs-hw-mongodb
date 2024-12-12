export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: { message: `The requested resource ${req.url} was not found` },
  });
};
