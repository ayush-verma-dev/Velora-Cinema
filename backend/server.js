import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import theaterRoutes from "./routes/theaterRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import showRoutes from "./routes/showRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect Database
connectDB();

const app = express();

/* -------------------- Middleware -------------------- */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://velora-cinema.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* -------------------- Static Files -------------------- */

// Public assets
app.use(express.static(path.join(__dirname, "public")));

// Uploaded movie posters
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* -------------------- API Routes -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shows", showRoutes);

/* -------------------- Health Routes -------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Velora Cinema Backend Running 🚀",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend API Working Successfully",
  });
});

/* -------------------- Start Server -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});