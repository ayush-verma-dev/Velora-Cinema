import express from "express";
import {
  getAllShows,
  createShow,
  updateShow,
  deleteShow,
  getShowsByMovie,
  getShowById,
  generateShows,
} from "../controllers/showController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllShows);
router.get("/movie/:movieId", getShowsByMovie);
router.get("/:id", getShowById);

// Admin
router.post("/", protect, adminOnly, createShow);
router.post("/generate", protect, adminOnly, generateShows);
router.put("/:id", protect, adminOnly, updateShow);
router.delete("/:id", protect, adminOnly, deleteShow);

export default router;