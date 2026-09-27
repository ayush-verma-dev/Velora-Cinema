import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);

router.get("/test", protect, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin!",
    user: req.user,
  });
});

export default router;