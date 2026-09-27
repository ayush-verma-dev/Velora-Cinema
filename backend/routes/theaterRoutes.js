import express from "express";
import {
  getAllTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
} from "../controllers/theaterController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllTheaters);

// Admin
router.post("/", protect, adminOnly, createTheater);
router.put("/:id", protect, adminOnly, updateTheater);
router.delete("/:id", protect, adminOnly, deleteTheater);

export default router;