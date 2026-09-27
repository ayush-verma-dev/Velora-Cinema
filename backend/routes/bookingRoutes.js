import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyTickets,
  getBookedSeats,
  getAllBookings,
  createOrder,
  verifyPayment,
  lockSeats,
  unlockSeats,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create Booking (Protected)
router.get("/seats", getBookedSeats);
router.post("/create", protect, createBooking);
router.get("/my-tickets", protect, getMyTickets);
router.get("/my", protect, getMyTickets);
router.get("/admin", protect, getAllBookings);
router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.post("/lock-seats", protect, lockSeats);
router.post("/unlock-seats", protect, unlockSeats);

export default router;