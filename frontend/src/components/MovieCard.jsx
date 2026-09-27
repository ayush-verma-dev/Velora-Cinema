import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaStar, FaClock, FaPlay, FaTicketAlt } from "react-icons/fa";

function MovieCard({ movie, onTrailer }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#151A26] transition duration-300 hover:border-yellow-400/50 hover:shadow-[0_20px_60px_rgba(250,204,21,.18)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        <div className="absolute bottom-4 left-4 right-4">
          <span className="rounded-full bg-yellow-400/20 px-3 py-1 text-xs tracking-[0.2em] text-yellow-300">
            {movie.genre}
          </span>

          <h3 className="mt-3 text-2xl font-bold text-white">
            {movie.title}
          </h3>

          <div className="mt-3 flex items-center justify-between text-gray-200">
            <span className="flex items-center gap-2 text-yellow-400">
              <FaStar />
              {movie.rating}
            </span>

            <span className="flex items-center gap-2">
              <FaClock />
              {movie.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <button
          onClick={() =>
            onTrailer
              ? onTrailer(movie)
              : window.open(movie.trailer, "_blank")
          }
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-yellow-400 px-4 py-3 text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
        >
          <FaPlay />
          Watch Trailer
        </button>

        <button
          onClick={() => navigate(`/movie/${movie.slug}`)}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black transition hover:bg-yellow-300"
        >
          <FaTicketAlt />
          Book Tickets
        </button>
      </div>
    </motion.div>
  );
}

export default MovieCard;