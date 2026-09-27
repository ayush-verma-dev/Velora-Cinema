import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaTimes, FaYoutube } from "react-icons/fa";

function TrailerModal({ movie, open, onClose }) {
  if (!movie || !open) return null;

  // Works for both backend filenames and imported frontend images
  const posterUrl =
    movie.poster?.startsWith("http") || movie.poster?.startsWith("/")
      ? movie.poster
      : `http://localhost:5000/${movie.poster?.split(/[\\/]/).pop()}`;

  const openTrailer = () => {
    if (movie.trailer) {
      window.open(movie.trailer, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl overflow-hidden rounded-[36px] border border-yellow-400/20 bg-[#111827] shadow-[0_0_60px_rgba(250,204,21,.12)]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-20 rounded-full bg-black/60 p-3 text-white transition hover:bg-red-500/30"
          >
            <FaTimes />
          </button>

          {/* Poster */}
          <div className="relative">
            <img
              src={posterUrl}
              alt={movie.title}
              className="h-72 w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="p-8">
            <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm tracking-[0.25em] text-yellow-300">
              OFFICIAL TRAILER
            </span>

            <h2 className="mt-5 text-4xl font-bold text-white">
              {movie.title}
            </h2>

            <p className="mt-4 text-gray-400">
              Watch the official trailer on YouTube in high quality.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 25px rgba(250,204,21,.3)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={openTrailer}
                className="flex items-center gap-3 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black transition hover:bg-yellow-300"
              >
                <FaYoutube size={20} />
                Watch on YouTube
              </motion.button>

              <button
                onClick={onClose}
                className="rounded-full border border-white/10 px-8 py-4 text-gray-300 transition hover:border-yellow-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-4">
              <div className="flex items-center gap-3">
                <FaPlay className="text-yellow-400" />
                <span className="text-sm text-gray-300">
                  Opens the trailer in a new YouTube tab while keeping Velora
                  Cinema open.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TrailerModal;