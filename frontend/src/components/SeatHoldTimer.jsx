import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

function SeatHoldTimer({
  active,
  duration = 300,
  onExpire,
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!active) {
      setTimeLeft(duration);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [active, duration, onExpire]);

  if (!active) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const danger = timeLeft <= 60;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed inset-x-0 top-24 z-50 mx-auto flex w-[92%] max-w-[320px] items-center justify-between rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
        danger
          ? "border-red-500/30 bg-[#3A1515]/95"
          : "border-yellow-400/30 bg-[#2A2415]/95"
      }`}
    >
      {/* Left Content */}
      <div className="flex items-center gap-3">
        <FaClock
          className={danger ? "text-red-400" : "text-yellow-400"}
        />

        <div>
          <p className="text-sm font-semibold">
            Seats Reserved
          </p>

          <p className="text-xs text-gray-400">
            Complete payment before time ends.
          </p>
        </div>
      </div>

      {/* Timer */}
      <motion.div
        animate={{
          scale: danger ? [1, 1.08, 1] : 1,
        }}
        transition={{
          repeat: danger ? Infinity : 0,
          duration: 1,
        }}
        className={`rounded-xl px-4 py-2 text-xl sm:text-2xl font-bold ${
          danger
            ? "bg-red-500/20 text-red-300"
            : "bg-yellow-400/10 text-yellow-300"
        }`}
      >
        {minutes}:{seconds}
      </motion.div>
    </motion.div>
  );
}

export default SeatHoldTimer;