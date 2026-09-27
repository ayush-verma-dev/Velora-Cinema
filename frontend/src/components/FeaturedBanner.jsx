import { motion } from "framer-motion";
import { FaPlay, FaTicketAlt, FaStar, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function FeaturedBanner({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#111827] shadow-[0_0_60px_rgba(250,204,21,.08)]">
      {/* Background Poster */}

      <img
        src={movie.poster}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />

      <div className="relative flex min-h-[520px] items-center px-10 py-12 md:px-16">
        <div className="max-w-2xl">

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm tracking-[0.25em] text-yellow-300"
          >
            FEATURED PREMIERE
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-5xl font-bold leading-tight md:text-7xl"
          >
            {movie.title}
          </motion.h1>

          <div className="mt-6 flex flex-wrap gap-6 text-gray-300">

            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              {movie.rating}
            </div>

            <div className="flex items-center gap-2">
              <FaClock />
              {movie.duration}
            </div>

            <div>{movie.genre}</div>

          </div>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-300">
            {movie.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <button
              onClick={() => window.open(movie.trailer)}
              className="flex items-center gap-2 rounded-full border border-yellow-400/30 px-8 py-4 text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
            >
              <FaPlay />
              Watch Trailer
            </button>

            <button
              onClick={() => navigate(`/movie/${movie.slug}`)}
              className="flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black transition hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/30"
            >
              <FaTicketAlt />
              Book Now
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default FeaturedBanner;