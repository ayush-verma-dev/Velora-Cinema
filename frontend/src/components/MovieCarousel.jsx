import { motion } from "framer-motion";
import { FaStar, FaClock, FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { movies } from "../data/movies";

function MovieCarousel() {

  const navigate = useNavigate();

  return (
    <section id="movies" className="bg-[#0B0F19] py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-5 md:flex-row">

          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
              Velora Originals
            </p>

            <h2 className="mt-2 text-4xl font-bold text-white md:text-5xl">
              Now Showing
            </h2>

            <p className="mt-3 max-w-xl text-gray-400">
              Explore our exclusive blockbuster collection with premium IMAX
              experiences.
            </p>
          </div>

          <button className="rounded-full border border-yellow-400 px-6 py-3 text-yellow-400 transition hover:bg-yellow-400 hover:text-black">
            View All
          </button>

        </div>

        {/* Carousel */}
        <div className="no-scrollbar flex gap-8 overflow-x-auto pb-6">

          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ y: -12, scale: 1.03 }}
              transition={{ duration: 0.25 }}
              onClick={() => navigate(`/movie/${movie.slug}`)}
              className="group relative min-w-[270px] cursor-pointer overflow-hidden rounded-[30px] border border-white/10 bg-[#151A26] shadow-xl shadow-black/30"
            >
              {/* Poster */}
              <div className="overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Movie Info */}
              <div className="absolute bottom-0 w-full p-6">

                <span className="rounded-full bg-yellow-400/20 px-3 py-1 text-xs uppercase tracking-widest text-yellow-300">
                  {movie.genre}
                </span>

                <h3 className="mt-3 text-2xl font-bold text-white">
                  {movie.title}
                </h3>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-300">

                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span>{movie.rating}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaClock />
                    <span>{movie.duration}</span>
                  </div>

                </div>

                {/* Book Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/movie/${movie.slug}`);
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 font-semibold text-black opacity-0 transition duration-300 group-hover:opacity-100 hover:bg-yellow-300"
                >
                  <FaTicketAlt />
                  Book Now
                </button>

              </div>

              {/* Premium Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-yellow-400/0 transition duration-300 group-hover:ring-yellow-400/30" />

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default MovieCarousel;