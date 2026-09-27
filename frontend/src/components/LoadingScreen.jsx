import { motion } from "framer-motion";
import { FaFilm } from "react-icons/fa";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            },
            scale: {
              repeat: Infinity,
              duration: 1,
            },
          }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400 text-4xl text-black"
        >
          <FaFilm />
        </motion.div>

        <h2 className="mt-6 text-2xl font-bold">
          Loading Velora...
        </h2>
      </div>
    </div>
  );
}

export default LoadingScreen;