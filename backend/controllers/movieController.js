import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import Show from "../models/Show.js";

// ===============================
// Default Show Generator
// ===============================

const DEFAULT_TIMES = [
  "10:00 AM",
  "1:30 PM",
  "5:00 PM",
  "8:30 PM",
];

async function createDefaultShows(movie) {
  const theaters = await Theater.find();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const shows = [];

  for (const theater of theaters) {
    DEFAULT_TIMES.forEach((time, index) => {
      shows.push({
        movie: movie._id,
        theater: theater._id,
        screen: `${theater.experience || "Screen"} ${index + 1}`,
        date: today,
        time,
        price: 250 + index * 50,
      });
    });
  }

  if (shows.length) {
    await Show.insertMany(shows);
  }
}

// ===============================
// Get All Movies
// ===============================

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// ===============================
// Get Movie by Slug
// ===============================

export const getMovieBySlug = async (req, res) => {
  try {
    const movie = await Movie.findOne({
      slug: req.params.slug,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found.",
      });
    }

    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// ===============================
// Create Movie (Admin)
// ===============================

export const createMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      language,
      duration,
      rating,
      trailer,
      description,
      poster,
      cast,
      highlights,
      gallery,
      showtimes,
    } = req.body;

    if (!title || !poster) {
      return res.status(400).json({
        success: false,
        message: "Title and poster are required.",
      });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const movie = await Movie.create({
      title,
      genre,
      language,
      duration,
      rating,
      trailer,
      description,
      poster,
      slug,

      cast: cast
        ? cast.split(",").map((x) => x.trim()).filter(Boolean)
        : [],

      highlights: highlights
        ? highlights.split(",").map((x) => x.trim()).filter(Boolean)
        : [],

      gallery: gallery
        ? gallery.split(",").map((x) => x.trim()).filter(Boolean)
        : [poster],

      showtimes: showtimes
        ? showtimes.split(",").map((x) => x.trim()).filter(Boolean)
        : [],
    });

    // Automatically create shows for every theater
    await createDefaultShows(movie);

    res.status(201).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create movie.",
    });
  }
};

// ===============================
// Delete Movie (Admin)
// ===============================

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found.",
      });
    }

    // Delete related shows
    await Show.deleteMany({ movie: movie._id });

    await Movie.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Movie deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete movie.",
    });
  }
};

// ===============================
// Update Movie (Admin)
// ===============================

export const updateMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      language,
      duration,
      rating,
      trailer,
      description,
      poster,
      cast,
      highlights,
      gallery,
      showtimes,
    } = req.body;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        genre,
        language,
        duration,
        rating,
        trailer,
        description,
        poster,
        slug,

        cast: cast
          ? cast.split(",").map((x) => x.trim()).filter(Boolean)
          : [],

        highlights: highlights
          ? highlights.split(",").map((x) => x.trim()).filter(Boolean)
          : [],

        gallery: gallery
          ? gallery.split(",").map((x) => x.trim()).filter(Boolean)
          : [poster],

        showtimes: showtimes
          ? showtimes.split(",").map((x) => x.trim()).filter(Boolean)
          : [],
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found.",
      });
    }

    res.json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update movie.",
    });
  }
};