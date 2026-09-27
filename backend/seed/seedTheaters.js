import mongoose from "mongoose";
import dotenv from "dotenv";
import Theater from "../models/Theater.js";

dotenv.config();

const theaters = [
  // Shadow Protocol
  {
    name: "Velora IMAX Downtown",
    experience: "IMAX Laser",
    distance: "2.4 km",
    movieSlug: "shadow-protocol",
    showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
  },
  {
    name: "Velora Luxe Mall",
    experience: "Luxury Recliners",
    distance: "5.1 km",
    movieSlug: "shadow-protocol",
    showtimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"],
  },
  {
    name: "Velora Grand Cinema",
    experience: "Dolby Atmos",
    distance: "7.8 km",
    movieSlug: "shadow-protocol",
    showtimes: ["9:30 AM", "12:30 PM", "4:00 PM", "8:00 PM"],
  },

  // Neon Horizon
  {
    name: "Velora IMAX Downtown",
    experience: "IMAX Laser",
    distance: "2.4 km",
    movieSlug: "neon-horizon",
    showtimes: ["9:30 AM", "12:30 PM", "4:00 PM", "9:00 PM"],
  },
  {
    name: "Velora Luxe Mall",
    experience: "Luxury Recliners",
    distance: "5.1 km",
    movieSlug: "neon-horizon",
    showtimes: ["10:30 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
  },
  {
    name: "Velora Grand Cinema",
    experience: "Dolby Atmos",
    distance: "7.8 km",
    movieSlug: "neon-horizon",
    showtimes: ["11:00 AM", "2:00 PM", "6:00 PM", "10:00 PM"],
  },

  // Silent Echo
  {
    name: "Velora IMAX Downtown",
    experience: "IMAX Laser",
    distance: "2.4 km",
    movieSlug: "silent-echo",
    showtimes: ["11:00 AM", "2:00 PM", "6:00 PM", "10:00 PM"],
  },
  {
    name: "Velora Luxe Mall",
    experience: "Luxury Recliners",
    distance: "5.1 km",
    movieSlug: "silent-echo",
    showtimes: ["10:30 AM", "1:30 PM", "5:30 PM", "9:00 PM"],
  },
  {
    name: "Velora Grand Cinema",
    experience: "Dolby Atmos",
    distance: "7.8 km",
    movieSlug: "silent-echo",
    showtimes: ["9:00 AM", "12:00 PM", "4:30 PM", "8:30 PM"],
  },
];

const seedTheaters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Theater.deleteMany({});
    console.log("Old theaters removed");

    await Theater.insertMany(theaters);
    console.log("9 theaters seeded successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedTheaters();