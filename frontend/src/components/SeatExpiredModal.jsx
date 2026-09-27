import { AnimatePresence, motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

function SeatExpiredModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="fixed left-1/2 top-1/2 z-[9999] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-red-500/20 bg-[#111827] p-8 text-center shadow-[0_0_50px_rgba(239,68,68,.2)]"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
              <FaExclamationTriangle className="text-4xl text-red-400" />
            </div>

            <h2 className="text-3xl font-bold text-white">
              Seat Hold Expired
            </h2>

            <p className="mt-4 text-gray-400">
              Your selected seats have been released. Please choose your seats again.
            </p>

            <button
              onClick={onClose}
              className="mt-8 w-full rounded-xl bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-300"
            >
              Select Seats Again
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SeatExpiredModal;