import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

// Validate required environment variables
const requiredEnvVars = [
  "JWT_SECRET",
  "MONGODB_URL",
  "FRONTEND_URL",
  "IMAGE_KIT_PUBLIC_KEY",
  "IMAGE_KIT_PRIVATE_KEY",
  "IMAGE_KIT_URL_ENDPOINT",
];

const missingEnvVars = requiredEnvVars.filter((env) => !process.env[env]);
if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((env) => console.error(`   - ${env}`));
  console.error("\nPlease check your .env file and add the missing variables.");
  process.exit(1);
}

const app = express();

/* ----------------------------- CORS CONFIG ----------------------------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

/* ----------------------------- MIDDLEWARES ----------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/* ----------------------------- ROUTES ----------------------------- */
app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Placement Drive API Running 🚀",
  });
});

/* ----------------------------- ERROR HANDLER ----------------------------- */
app.use(errorHandler);

export default app;