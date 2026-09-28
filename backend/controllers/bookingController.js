import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import Show from "../models/Show.js";
import sendEmail from "../utils/sendEmail.js";
import ticketEmail from "../templates/ticketEmail.js";
import QRCode from "qrcode";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

// Generate Booking ID
const generateBookingId = () => {
  return "VEL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// ======================= CREATE BOOKING =======================
export const createBooking = async (req, res) => {
  try {
    console.log("Booking request body:", req.body);
    console.log("Authenticated user:", req.user);

    const {
      movieId,
      theaterId,
      showId,
      showtime,
      seats,
      totalPrice,
      paymentOrderId,
      paymentId,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (
      !movieId ||
      !theaterId ||
      !showId ||
      !showtime ||
      !seats?.length ||
      !totalPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking details are required.",
      });
    }

    // Convert seat objects -> string array
    const seatIds = seats.map((seat) =>
      typeof seat === "string" ? seat : seat.id
    );

    // Verify movie
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found.",
      });
    }

    // Verify theater
    const theater = await Theater.findById(theaterId);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found.",
      });
    }

    // Verify show
    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found.",
      });
    }

    // Prevent double booking
    const alreadyBooked = seatIds.filter((seat) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked.length) {
      return res.status(400).json({
        success: false,
        message: `Seat ${alreadyBooked.join(", ")} is already booked.`,
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      movie: movieId,
      theater: theaterId,
      show: showId,
      showtime,
      seats: seatIds,
      totalPrice,

      bookingId: generateBookingId(),

      paymentOrderId,
      paymentId,
      paymentMethod,

      paymentStatus: "paid",
      status: "confirmed", // ← ADD THIS
    });

    // Reserve seats permanently
    await Show.findByIdAndUpdate(showId, {
      $pull: {
        lockedSeats: {
          seat: { $in: seatIds },
          user: req.user._id,
        },
      },
      $push: {
        bookedSeats: {
          $each: seatIds,
        },
      },
    });

    // Remove locks for the booked seats
    show.lockedSeats = show.lockedSeats.filter(
      (lock) => !seatIds.includes(lock.seat)
    );

    await show.save();

    console.log("Booking created successfully.");

    // ================= SEND EMAIL =================
    try {
      const qrData = JSON.stringify({
        bookingId: booking.bookingId,
        movie: movie.title,
        theater: theater.name,
        showtime: booking.showtime,
        seats: booking.seats,
        totalPrice: booking.totalPrice,
      });

      const qrCode = await QRCode.toDataURL(qrData);

      await sendEmail({
        to: req.user.email,
        subject: `🎬 Velora Cinema - Booking Confirmed (${booking.bookingId})`,
        html: ticketEmail({
          customerName: req.user.name,
          bookingId: booking.bookingId,
          movie: movie.title,
          theater: theater.name,
          showtime: booking.showtime,
          date: new Date(booking.createdAt).toLocaleDateString("en-IN"),
          seats: booking.seats,
          totalPrice: booking.totalPrice,
        }),
        attachments: [
          {
            filename: "ticket-qr.png",
            path: qrCode,
            cid: "ticketQR",
          },
        ],
      });

      console.log("Confirmation email sent.");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail booking if email fails
    }

    return res.status(201).json({
      success: true,
      message: "Booking confirmed!",
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// ======================= MY BOOKINGS =======================
export const getMyTickets = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      status: "confirmed",
    })
    .populate("user", "name email")  
    .populate("movie", "title poster language duration")
      .populate("theater", "name experience city")
      .populate("show", "screen date time price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// ======================= BOOKED & LOCKED SEATS =======================
export const getBookedSeats = async (req, res) => {
  try {
    const { showId } = req.query;

    if (!showId) {
      return res.status(400).json({
        success: false,
        message: "Show ID is required.",
      });
    }

    // Remove expired locks directly from MongoDB
    await Show.updateOne(
      { _id: showId },
      {
        $pull: {
          lockedSeats: {
            lockedUntil: { $lt: new Date() },
          },
        },
      }
    );

    // Fetch updated show
    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found.",
      });
    }

    res.status(200).json({
      success: true,
      bookedSeats: show.bookedSeats,
      lockedSeats: show.lockedSeats.map((lock) => lock.seat),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// Get All Bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("movie", "title")
      .populate("theater", "name city")
      .populate("show", "screen date time")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

//Create Order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

//Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// ======================= LOCK SEATS =======================
export const lockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    // Convert seat objects to seat IDs
    const seatIds = seats.map((seat) =>
      typeof seat === "string" ? seat : seat.id
    );

    if (!showId || !seats?.length) {
      return res.status(400).json({
        success: false,
        message: "Show ID and seats are required.",
      });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found.",
      });
    }

    const now = new Date();

    // Remove expired locks
    show.lockedSeats = show.lockedSeats.filter(
      (lock) => lock.lockedUntil > now
    );

    // Already booked?
    const booked = seatIds.find((seat) =>
      show.bookedSeats.includes(seat)
    );

    if (booked) {
      return res.status(400).json({
        success: false,
        message: `Seat ${booked} is already booked.`,
      });
    }

    // Locked by another user?
    const locked = seatIds.find((seat) =>
      show.lockedSeats.some(
        (lock) =>
          lock.seat === seat &&
          lock.user.toString() !== req.user._id.toString()
      )
    );

    if (locked) {
      return res.status(400).json({
        success: false,
        message: `Seat ${locked} is temporarily locked.`,
      });
    }

    const lockExpiry = new Date(now.getTime() + 5 * 60 * 1000);

    // Remove previous locks of this user for these seats
    show.lockedSeats = show.lockedSeats.filter(
      (lock) =>
        !(
          seatIds.includes(lock.seat) &&
          lock.user.toString() === req.user._id.toString()
        )
    );

    // Add new locks
    seatIds.forEach((seat) => {
      show.lockedSeats.push({
        seat,
        user: req.user._id,
        lockedUntil: lockExpiry,
      });
    });

    await show.save();

    res.json({
      success: true,
      lockedUntil: lockExpiry,
    });
  } catch (error) {
    console.error("Lock Seats Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to lock seats.",
    });
  }
};

// ======================= UNLOCK SEATS =======================
export const unlockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats?.length) {
      return res.status(400).json({
        success: false,
        message: "Show ID and seats are required.",
      });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found.",
      });
    }

    // Convert seat objects -> string array
    const seatIds = seats.map((seat) =>
      typeof seat === "string" ? seat : seat.id
    );

    // Remove only this user's locks
    show.lockedSeats = show.lockedSeats.filter(
      (lock) =>
        !(
          seatIds.includes(lock.seat) &&
          lock.user.toString() === req.user._id.toString()
        )
    );

    await show.save();

    res.status(200).json({
      success: true,
      message: "Seats unlocked successfully.",
    });
  } catch (error) {
    console.error("Unlock seats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to unlock seats.",
    });
  }
};