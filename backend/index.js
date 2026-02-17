import dotenv from "dotenv";

// Load environment variables BEFORE any other imports
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

/* ----------------------------- DB CONNECTION ----------------------------- */
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
    });

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      console.log("💤 SIGTERM received, shutting down gracefully...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    });

    // Handle unhandled rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  });

// Handle port already in use
process.on("EADDRINUSE", () => {
  console.error(`❌ Port ${PORT} is already in use`);
  process.exit(1);
});

