import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    showtime: {
      type: String,
      required: true,
    },

    seats: {
      type: [String],
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    bookingId: {
      type: String,
      unique: true,
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },

    paymentOrderId: {
      type: String,
    },

    paymentId: {
      type: String,
    },

    paymentMethod: {
      type: String,
    },

    paymentStatus: {
      type: String,
      default: "paid",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);