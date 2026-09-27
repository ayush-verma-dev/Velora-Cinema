import { motion } from "framer-motion";

function Seat({ seat, onSelect }) {
  const isBooked = seat.status === "booked";
  const isHolding = seat.status === "holding";

  let seatStyle =
    "bg-slate-700 border-slate-500 hover:bg-slate-600 text-white";

  if (seat.type === "Premium") {
    seatStyle =
      "bg-blue-700 border-blue-400 hover:bg-blue-600 text-white";
  }

  if (seat.type === "VIP") {
    seatStyle =
      "bg-purple-700 border-purple-400 hover:bg-purple-600 text-white";
  }

  if (isHolding) {
    seatStyle =
      "bg-yellow-400 border-yellow-300 text-black shadow-[0_0_20px_rgba(250,204,21,.8)]";
  }

  if (isBooked) {
    seatStyle =
      "bg-red-800 border-red-500 text-white opacity-80 cursor-not-allowed";
  }

  return (
    <motion.button
      whileHover={!isBooked ? { scale: 1.08, y: -3 } : {}}
      whileTap={!isBooked ? { scale: 0.95 } : {}}
      disabled={isBooked}
      onClick={() => onSelect(seat.id)}
      className={`
        relative border-2 transition-all duration-300
        ${
          seat.type === "VIP"
            ? "h-16 w-14 rounded-[16px]"
            : "h-12 w-10 rounded-t-xl rounded-b-md"
        }
        ${seatStyle}
      `}
    >
      {/* Headrest */}
      <div
        className={`absolute left-1/2 top-1 h-2 -translate-x-1/2 rounded-full bg-white/20 ${
          seat.type === "VIP" ? "w-10" : "w-6"
        }`}
      />

      {/* Armrests */}
      <div className="absolute left-0 top-4 h-6 w-[2px] bg-white/20" />
      <div className="absolute right-0 top-4 h-6 w-[2px] bg-white/20" />

      {/* Seat cushion */}
      <div className="absolute bottom-2 left-1/2 h-3 w-7 -translate-x-1/2 rounded-full bg-black/10" />

      {/* Seat Number */}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold">
        {seat.label}
      </span>
    </motion.button>
  );
}

export default Seat;