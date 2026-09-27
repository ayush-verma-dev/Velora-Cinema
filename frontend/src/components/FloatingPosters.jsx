import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaStar, FaClock, FaPlay, FaTicketAlt } from "react-icons/fa";
import API from "../services/api";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

function FloatingPosters() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [movies]);

  async function fetchMovies() {
    try {
      const { data } = await API.get("/movies");

      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error("Failed to load hero movies:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || movies.length === 0) {
    return (
      <div className="flex h-[560px] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  const getIndex = (offset) =>
    (current + offset + movies.length) % movies.length;

  const cards = [
    {
      movie: movies[getIndex(-1)],
      offset: -120,
      rotate: -12,
      scale: 0.85,
      z: 1,
    },
    {
      movie: movies[getIndex(0)],
      offset: 0,
      rotate: 0,
      scale: 1,
      z: 3,
    },
    {
      movie: movies[getIndex(1)],
      offset: 120,
      rotate: 12,
      scale: 0.85,
      z: 1,
    },
  ];

  return (
    <div className="relative flex h-[560px] w-full items-center justify-center overflow-hidden">
      {cards.map((card) => {
        const posterUrl = card.movie.poster.startsWith("http")
          ? card.movie.poster
          : `${BACKEND_URL}/${card.movie.poster.replace(/^\/+/, "")}`;

        return (
          <motion.div
            key={card.movie._id}
            initial={false}
            animate={{
              x: card.offset,
              rotate: card.rotate,
              scale: card.scale,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
            }}
            onClick={() =>
              setCurrent(movies.findIndex((m) => m._id === card.movie._id))
            }
            style={{ zIndex: card.z }}
            className="absolute w-[230px] cursor-pointer overflow-hidden rounded-[30px] border border-yellow-400/20 bg-[#121826] shadow-[0_20px_60px_rgba(0,0,0,.45)]"
          >
            <div className="relative h-[330px]">
              <img
                src={posterUrl}
                alt={card.movie.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/400x600/111827/FACC15?text=No+Poster";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            <div className="space-y-3 p-5">
              <h3 className="line-clamp-2 text-3xl font-bold text-white">
                {card.movie.title}
              </h3>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-yellow-400">
                  <FaStar />
                  {card.movie.rating}
                </span>

                <span className="flex items-center gap-2 text-gray-300">
                  <FaClock />
                  {card.movie.duration}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(card.movie.trailer, "_blank");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-yellow-400 py-3 text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
              >
                <FaPlay />
                Watch Trailer
              </button>

              {card.offset === 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/movie/${card.movie.slug}`);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 py-3 font-semibold text-black transition hover:bg-yellow-300"
                >
                  <FaTicketAlt />
                  Book Now
                </button>
              )}
            </div>
          </motion.div>
        );
      })}

      <div className="absolute bottom-3 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              index === current ? "w-8 bg-yellow-400" : "w-2 bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default FloatingPosters;