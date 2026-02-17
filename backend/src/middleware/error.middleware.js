export const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    message = `Duplicate field value entered`;
    statusCode = 400;
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = "Invalid resource ID format";
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    message = `Validation Error: ${messages}`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid or malformed token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token has expired";
    statusCode = 401;
  }

  // File upload errors
  if (err.message.includes("File too large")) {
    message = "File size exceeds 5MB limit";
    statusCode = 400;
  }

  if (err.message.includes("Only PDF files")) {
    message = "Only PDF files are allowed";
    statusCode = 400;
  }

  // MongoDB connection error
  if (err.name === "MongooseError" || err.name === "MongoServerError") {
    message = "Database connection error. Please try again later.";
    statusCode = 503;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};