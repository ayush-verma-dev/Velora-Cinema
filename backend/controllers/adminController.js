import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("movie", "title")
      .sort({ createdAt: -1 });

    const movies = await Movie.countDocuments();
    const users = await User.countDocuments();

    const revenue = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    // Revenue grouped by date
    const revenueMap = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt).toLocaleDateString("en-IN");

      revenueMap[date] =
        (revenueMap[date] || 0) + booking.totalPrice;
    });

    const chartData = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    const recentBookings = bookings.slice(0, 5).map((booking) => ({
      id: booking.bookingId,
      movie: booking.movie?.title,
      amount: booking.totalPrice,
      seats: booking.seats.join(", "),
    }));

    res.json({
      success: true,
      stats: {
        revenue,
        bookings: bookings.length,
        movies,
        users,
      },
      chartData,
      recentBookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};