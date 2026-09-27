import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Movie from "../models/Movie.js";

dotenv.config();

const movies = [
  {
    title: "Shadow Protocol",
    slug: "shadow-protocol",
    poster: "/posters/shadow-protocol.png",
    rating: 8.9,
    duration: "2h 18m",
    genre: "Action • Thriller",
    language: "English",
    format: "IMAX",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description:
      "An undercover agent uncovers a conspiracy that threatens the world's intelligence network.",
    cast: [
      "Alex Carter",
      "Emma Stone",
      "Daniel Reed",
      "Sophia Blake",
    ],
    highlights: [
      "IMAX Laser Experience",
      "Dolby Atmos",
      "High-speed action sequences",
    ],
    showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
    gallery: [
      "/posters/shadow-protocol.png",
      "/posters/shadow-protocol.png",
      "/posters/shadow-protocol.png",
    ],
  },

  {
    title: "Neon Horizon",
    slug: "neon-horizon",
    poster: "/posters/neon-horizon.png",
    rating: 9.2,
    duration: "2h 05m",
    genre: "Sci-Fi",
    language: "English",
    format: "IMAX",
    trailer: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    description:
      "Humanity's first interstellar colony faces a mysterious signal from beyond known space.",
    cast: [
      "Ryan Cole",
      "Olivia Hart",
      "Lucas Frost",
      "Mia Nova",
    ],
    highlights: [
      "IMAX Exclusive",
      "Sci-Fi Adventure",
      "Visual Spectacle",
    ],
    showtimes: ["9:30 AM", "12:30 PM", "4:00 PM", "9:00 PM"],
    gallery: [
      "/posters/neon-horizon.png",
      "/posters/neon-horizon.png",
      "/posters/neon-horizon.png",
    ],
  },

  {
    title: "Silent Echo",
    slug: "silent-echo",
    poster: "/posters/silent-echo.png",
    rating: 8.7,
    duration: "1h 54m",
    genre: "Psychological Thriller",
    language: "English",
    format: "Dolby Atmos",
    trailer: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    description:
      "A mysterious woman uncovers terrifying secrets hidden inside an abandoned estate.",
    cast: [
      "Lena Moore",
      "Chris Hale",
      "Eva Knight",
      "James Cross",
    ],
    highlights: [
      "Dolby Atmos",
      "Mind-bending thriller",
      "Haunting soundtrack",
    ],
    showtimes: ["11:00 AM", "2:00 PM", "6:00 PM", "10:00 PM"],
    gallery: [
      "/posters/silent-echo.png",
      "/posters/silent-echo.png",
      "/posters/silent-echo.png",
    ],
  },
];

const seedMovies = async () => {
  try {
    await connectDB();

    await Movie.deleteMany();

    await Movie.insertMany(movies);

    console.log("Movies seeded successfully!");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedMovies();