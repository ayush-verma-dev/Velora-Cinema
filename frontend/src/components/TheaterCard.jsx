import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaFilm, FaClock } from "react-icons/fa";

function TheaterCard({
  theater,
  selected,
  selectedTime,
  onSelect,
  onTimeSelect,
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-3xl border p-7 transition-all duration-300 ${
        selected
          ? "border-yellow-400 bg-yellow-400/5 shadow-[0_0_40px_rgba(250,204,21,.15)]"
          : "border-white/10 bg-[#151A26] hover:border-yellow-400/30"
      }`}
    >
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-3xl font-bold">{theater.name}</h2>

          <div className="mt-3 flex flex-wrap gap-5 text-gray-400">
            <span className="flex items-center gap-2">
              <FaFilm className="text-yellow-400" />
              {theater.experience}
            </span>

            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400" />
              {theater.distance}
            </span>

            <span className="flex items-center gap-2">
              <FaClock className="text-yellow-400" />
              {theater.available}
            </span>
          </div>
        </div>

        <button
          onClick={onSelect}
          className={`rounded-full px-6 py-3 font-semibold transition ${
            selected
              ? "bg-yellow-400 text-black"
              : "border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black"
          }`}
        >
          {selected ? "Selected" : "Choose Theater"}
        </button>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Showtimes</h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {theater.times.map((time) => (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              className={`rounded-xl px-4 py-4 font-semibold transition ${
                selected && selectedTime === time
                  ? "bg-yellow-400 text-black"
                  : "border border-white/10 bg-white/5 hover:border-yellow-400 hover:text-yellow-300"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default TheaterCard;