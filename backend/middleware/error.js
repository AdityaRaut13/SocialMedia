/** @format */

const errorJson = (err, req, res, next) => {
  let status = res.statusCode ? res.statusCode : 500;
  res.status(status);
  res.json({
    message: err.message,
    stack: process.env.env === "Production" ? null : err.stack,
  });
};

module.exports = errorJson;
