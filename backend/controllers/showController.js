import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import mongoose from "mongoose";

// =======================
// Get all shows
// =======================
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movie", "title poster slug")
      .populate("theater", "name city location experience")
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      shows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load shows.",
    });
  }
};

// =======================
// Get shows by movie
// =======================
export const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID.",
      });
    }

    const shows = await Show.find({
      movie: movieId,
    })
      .populate({
        path: "theater",
        select: "name city location experience screens",
      })
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: shows.length,
      shows,
    });
  } catch (error) {
    console.error("getShowsByMovie Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load movie shows.",
    });
  }
};

// =======================
// Get single show
// =======================
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie")
      .populate("theater");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found.",
      });
    }

    res.json({
      success: true,
      show,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load show.",
    });
  }
};

// =======================
// Create show
// =======================
export const createShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);

    const populatedShow = await Show.findById(show._id)
      .populate("movie", "title poster slug")
      .populate("theater", "name city location experience");

    res.status(201).json({
      success: true,
      show: populatedShow,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create show.",
    });
  }
};

// =======================
// Update show
// =======================
export const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("movie", "title poster slug")
      .populate("theater", "name city location experience");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found.",
      });
    }

    res.json({
      success: true,
      show,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update show.",
    });
  }
};

// =======================
// Delete show
// =======================
export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found.",
      });
    }

    await Show.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Show deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete show.",
    });
  }
};

// =======================
// Generate shows automatically
// =======================

export const generateShows = async (req, res) => {
  try {
    const movies = await Movie.find();
    const theaters = await Theater.find();

    if (!movies.length) {
      return res.status(400).json({
        success: false,
        message: "No movies found.",
      });
    }

    if (!theaters.length) {
      return res.status(400).json({
        success: false,
        message: "No theaters found.",
      });
    }

    // Remove old shows
    await Show.deleteMany({});

    const today = new Date();
    const showDocs = [];

    for (const movie of movies) {
      for (const theater of theaters) {
        const times =
          movie.showtimes?.length
            ? movie.showtimes
            : ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"];

        for (let i = 0; i < 3; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);

          times.forEach((time, index) => {
            showDocs.push({
              movie: movie._id,
              theater: theater._id,
              date,
              time,
              price: 250 + index * 50,
              totalSeats: 120,
              bookedSeats: [],
            });
          });
        }
      }
    }

    await Show.insertMany(showDocs);

    res.json({
      success: true,
      message: `${showDocs.length} shows generated successfully.`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate shows.",
    });
  }
};