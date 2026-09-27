import { motion } from "framer-motion";
import { FaStar, FaClock, FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { movies as allMovies } from "../data/movies";

function MovieGrid({ movies }) {
  const navigate = useNavigate();

  // Use passed movies, otherwise use all movies from data
  const movieList = movies ?? allMovies ?? [];

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {movieList.map((movie) => (
        <motion.div
          key={movie.id}
          whileHover={{ y: -10 }}
          transition={{ duration: 0.25 }}
          className="group overflow-hidden rounded-3xl border border-white/10 bg-[#151A26] shadow-lg hover:border-yellow-400/30"
        >
          {/* Poster */}
          <div className="overflow-hidden">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs text-yellow-300">
              {movie.genre}
            </span>

            <h3 className="mt-4 text-2xl font-bold text-white">
              {movie.title}
            </h3>

            <div className="mt-4 flex items-center justify-between text-gray-300">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span>{movie.rating}</span>
              </div>

              <div className="flex items-center gap-2">
                <FaClock />
                <span>{movie.duration}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/movie/${movie.slug}`)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 font-semibold text-black transition hover:bg-yellow-300"
            >
              <FaTicketAlt />
              Book Now
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default MovieGrid;