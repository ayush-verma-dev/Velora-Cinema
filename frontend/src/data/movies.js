import spiderman from "../assets/posters/spiderman.png";
import dhurandhar from "../assets/posters/dhurandhar.png";
import obsession from "../assets/posters/obsession.png";

export const movies = [
  {
    id: 1,
    title: "Spider-Man: Brand New Day",
    slug: "spider-man-brand-new-day",
    poster: spiderman,
    rating: 8.0,
    duration: "2h 30m",
    genre: "Action • Adventure",
    language: "English",
    format: "IMAX",
    trailer: "https://youtu.be/62bIsvRcPv0?si=Ur3wOwf5cj7wy8-_",
    description:
      "Peter Parker devotes his life to protecting New York City as a full-time Spider-Man. But as the demands on him intensify, the pressure sparks a surprising physical evolution that threatens his existence, even as a strange new pattern of crimes gives rise to one of the most powerful threats he's ever faced.",

    cast: [
      "Tom Holland",
      "Sadie Sink",
      "Zendaya",
    ],

    highlights: [
      "Grounded Action",
      "Great power - Great loneliness",
      "BRAND NEW DAY",
    ],

    showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],

    gallery: [spiderman, spiderman, spiderman],
  },

  {
    id: 2,
    title: "Dhurandhar: The Revenge",
    slug: "dhurandhar-the-revenge",
    poster: dhurandhar,
    rating: 8.2,
    duration: "3h 50m",
    genre: "Spy",
    language: "Hindi",
    format: "IMAX",
    trailer: "https://youtu.be/NHk7scrb_9I?si=cArTq8KryPuAIUXQ",
    description:
      "Hamza Ali Mazari pursues Major Iqbal to dismantle Pakistan's crime system. As his mission unfolds, his past reveals a transformative history that shaped his relentless drive for justice.",

    cast: [
      "Ranveer Singh",
      "Sara Arjun",
      "Akshaye Khanna",
      "Arjun Rampal",
    ],

    highlights: [
      "Spy Thriller",
      "Global Cinemattic Scale",
      "Massive Narrative Journey",
    ],

    showtimes: ["9:30 AM", "12:30 PM", "4:00 PM", "9:00 PM"],

    gallery: [dhurandhar, dhurandhar, dhurandhar],
  },

  {
    id: 3,
    title: "Obsession",
    slug: "obsession",
    poster: obsession,
    rating: 7.8,
    duration: "1h 49m",
    genre: "Horror",
    language: "English",
    format: "Dolby Atmos",
    trailer: "https://youtu.be/gMC8kkwbIQQ?si=eFxIpCzKCPwnFNAk",
    description:
      `After breaking the mysterious "One Wish Willow" to win his crush's heart, a hopeless romantic gets exactly what he asked for. However, he soon discovers that some desires come at a dark and sinister price.`,

    cast: [
      "Inde Navarrette",
      "Michael Johnston",
      "Curry Barker",
    ],

    highlights: [
      "Dark Fairytale",
      "Twisted Ending",
      "Haunting soundtrack",
    ],

    showtimes: ["11:00 AM", "2:00 PM", "6:00 PM", "10:00 PM"],

    gallery: [obsession, obsession, obsession],
  },
];