import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-8xl font-bold text-yellow-400">404</h1>

        <h2 className="mt-4 text-3xl font-bold">
          Lost in Velora
        </h2>

        <p className="mt-4 text-gray-400">
          The page you're looking for doesn't exist.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black hover:bg-yellow-300"
        >
          Return Home
        </button>
      </motion.div>
    </div>
  );
}

export default NotFound;