import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    poster: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    trailer: {
      type: String,
      required: true,
    },

    format: {
      type: String,
      default: "IMAX",
    },

    description: {
      type: String,
      required: true,
    },

    cast: [String],

    highlights: [String],

    gallery: [String],

    showtimes: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Movie", movieSchema);