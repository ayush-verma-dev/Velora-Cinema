import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowDown } from "react-icons/fa";
import FloatingPosters from "./FloatingPosters";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#0B0F19] pt-32">
      {/* Background Glow */}

      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-yellow-400/5 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Floating Dots */}

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute left-[6%] top-48 h-3 w-3 rounded-full bg-yellow-400"
      />

      <motion.div
        animate={{ y: [0, 18, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute right-[15%] top-72 h-2 w-2 rounded-full bg-yellow-400/70"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid min-h-[calc(100vh-120px)] items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 text-sm tracking-[0.3em] text-yellow-300">
              PREMIUM MOVIE EXPERIENCE
            </span>

            <h1 className="mt-8 text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
              Reserve Your
              <br />
              Perfect
              <br />
              <span className="text-yellow-400">
                Cinema Night
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-9 text-gray-400">
              Discover blockbuster movies, choose premium seats, and experience
              cinema like never before.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/movies")}
                className="rounded-full bg-yellow-400 px-9 py-4 font-semibold text-black shadow-[0_0_30px_rgba(250,204,21,.25)] hover:bg-yellow-300"
              >
                Book Tickets
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/movies")}
                className="rounded-full border border-yellow-400 px-9 py-4 font-semibold text-yellow-300 hover:bg-yellow-400 hover:text-black"
              >
                Explore Movies
              </motion.button>
            </div>

            {/* Stats */}

            <div className="mt-16 grid grid-cols-3 gap-8">
              <Stat number="50+" label="Theaters" />
              <Stat number="120+" label="Movies" />
              <Stat number="1M+" label="Tickets" />
            </div>
          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="flex w-full justify-center lg:justify-end">
                <div className="w-full max-w-[500px]">
                    <FloatingPosters />
                </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="pb-8 text-center"
        >
          <FaArrowDown className="mx-auto text-3xl text-yellow-400" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ number, label }) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <h3 className="text-4xl font-bold text-yellow-400">
        {number}
      </h3>

      <p className="mt-2 text-lg text-gray-400">{label}</p>
    </motion.div>
  );
}

export default Hero;