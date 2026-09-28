import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaStar,
  FaClock,
  FaGlobe,
  FaFilm,
  FaPlay,
  FaTicketAlt,
  FaCheckCircle,
} from "react-icons/fa";

import TrailerModal from "../components/TrailerModal";

// Backend URL (works on localhost and Vercel)
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

function MovieDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [slug]);

  const fetchMovie = async () => {
    try {
      const { data } = await API.get(`/movies/${slug}`);
      setMovie(data.movie);
    } catch (error) {
      console.error("Failed to load movie:", error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
          <p className="mt-5 text-lg text-gray-400">Loading Movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Movie Not Found</h1>

          <button
            onClick={() => navigate("/movies")}
            className="mt-8 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  const heroPoster = movie.poster?.startsWith("http")
    ? movie.poster
    : `${BACKEND_URL}/${movie.poster?.split(/[\\/]/).pop()}`;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {/* Hero */}

      <section className="relative min-h-[900px] overflow-hidden pt-24 sm:min-h-[760px] sm:pt-28 lg:min-h-[90vh]">
        <img
          src={heroPoster}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/1200x800/111827/FACC15?text=No+Poster";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#05070F] via-[#05070F]/80 to-[#05070F]/30" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pb-16 pt-10 sm:flex-row sm:items-center sm:justify-between sm:pb-0">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm tracking-[0.25em] text-yellow-300">
              PREMIUM EXPERIENCE
            </span>

            <h1 className="mt-8 text-5xl font-bold md:text-7xl">
              {movie.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-6 text-lg">
              <span className="flex items-center gap-2 text-yellow-400">
                <FaStar />
                {movie.rating}
              </span>

              <span className="flex items-center gap-2">
                <FaClock />
                {movie.duration}
              </span>

              <span className="flex items-center gap-2">
                <FaGlobe />
                {movie.language}
              </span>

              <span className="flex items-center gap-2">
                <FaFilm />
                {movie.format}
              </span>
            </div>

            <p className="mt-8 text-lg leading-8 text-gray-200">
              {movie.description}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-5">
              <button
                onClick={() => setTrailerOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-yellow-400 px-6 py-3 text-base text-yellow-300 transition hover:bg-yellow-400 hover:text-black sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                <FaPlay />
                Watch Trailer
              </button>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "instant" });

                  navigate("/theaters", {
                    state: {
                      movie,
                      movieId: movie._id,
                    },
                  });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-base font-semibold text-black transition hover:bg-yellow-300 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                <FaTicketAlt />
                Book Tickets
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}

      <div className="mx-auto max-w-7xl px-6 py-16">
        <section className="mb-20">
          <h2 className="mb-8 text-4xl font-bold">About the Movie</h2>

          <div className="rounded-3xl border border-white/10 bg-[#151A26] p-8">
            <p className="text-lg leading-9 text-gray-300">
              {movie.description}
            </p>
          </div>
        </section>

        {/* Cast */}

        {movie.cast?.length > 0 && (
          <section className="mb-20">
            <h2 className="mb-8 text-4xl font-bold">Cast</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(movie.cast ?? []).map((actor, index) => (
                <motion.div
                  key={actor}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#151A26]"
                >
                  <div
                    className={`flex h-56 items-center justify-center text-6xl font-bold ${
                      index % 4 === 0
                        ? "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600"
                        : index % 4 === 1
                        ? "bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700"
                        : index % 4 === 2
                        ? "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"
                        : "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700"
                    }`}
                  >
                    {actor
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold">{actor}</h3>
                    <p className="mt-2 text-sm text-gray-400">Lead Cast</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Highlights */}

        {movie.highlights?.length > 0 && (
          <section className="mb-20">
            <h2 className="mb-8 text-4xl font-bold">Highlights</h2>

            <div className="grid gap-6 md:grid-cols-3">
              {(movie.highlights ?? []).map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-yellow-400/20 bg-[#151A26] p-6"
                >
                  <FaCheckCircle className="text-3xl text-yellow-400" />
                  <p className="mt-5 text-lg">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}

        <section className="mb-20">
          <h2 className="mb-8 text-4xl font-bold">Gallery</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {(movie.gallery?.length
              ? movie.gallery
              : [movie.poster, movie.poster, movie.poster]
            ).map((image, index) => {
              const galleryUrl = image?.startsWith("http")
                ? image
                : `${BACKEND_URL}/${image.split(/[\\/]/).pop()}`;

              return (
                <div key={index} className="overflow-hidden rounded-3xl">
                  <img
                    src={galleryUrl}
                    alt={`${movie.title}-${index}`}
                    className="h-72 w-full object-cover transition duration-500 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/111827/FACC15?text=No+Poster";
                    }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Showtimes */}

        {movie.showtimes?.length > 0 && (
          <section>
            <h2 className="mb-8 text-4xl font-bold">Available Showtimes</h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(movie.showtimes ?? []).map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "instant",
                    });

                    navigate("/theaters", {
                      state: {
                        movie,
                        movieId: movie._id,
                        selectedTime: time,
                      },
                    });
                  }}
                  className="rounded-2xl border border-yellow-400/20 bg-[#151A26] px-6 py-5 hover:bg-yellow-400 hover:text-black"
                >
                  {time}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <TrailerModal
        movie={movie}
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
      />
    </div>
  );
}

export default MovieDetails;