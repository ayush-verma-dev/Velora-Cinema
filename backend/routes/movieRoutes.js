import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  getAllMovies,
  getMovieBySlug,
  createMovie,
  deleteMovie,
  updateMovie,
} from "../controllers/movieController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all movies
router.get("/", getAllMovies);

// ✅ Posters route MUST come before "/:slug"
router.get("/posters", (req, res) => {
  try {
    const postersDir = path.join(__dirname, "../public");

    const posters = fs
      .readdirSync(postersDir)
      .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file));

    res.json(posters);
  } catch (err) {
    console.error("Error loading posters:", err);
    res.status(500).json({ message: "Failed to load posters." });
  }
});

// Get movie by slug
router.get("/:slug", getMovieBySlug);

// Admin
router.post("/", protect, adminOnly, createMovie);

// Update
router.put("/:id", protect, adminOnly, updateMovie);

// Delete
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;