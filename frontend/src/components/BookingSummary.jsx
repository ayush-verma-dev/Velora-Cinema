import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

function BookingSummary() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.movie || !state?.seats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="rounded-3xl border border-white/10 bg-[#151A26] p-10 text-center">
          <h2 className="text-3xl font-bold">No Booking Found</h2>
          <button
            onClick={() => navigate("/movies")}
            className="mt-6 rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  const {
    movie,
    poster,
    theater,
    date,
    time,
    seats,
    seatType = "Normal",
  } = state;

  const seatPrices = {
    VIP: 500,
    Premium: 350,
    Normal: 200,
  };

  const pricePerSeat = seatPrices[seatType] || 200;
  const subtotal = pricePerSeat * seats.length;
  const convenienceFee = 49;
  const total = subtotal + convenienceFee;

  const confirmBooking = () => {
    const ticket = {
      movie,
      poster,
      theater,
      date,
      time,
      seats,
      seatType,
      total,
      bookingId:
        "VEL-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      bookedAt: new Date().toLocaleString(),
    };

    const existing = JSON.parse(
      localStorage.getItem("veloraTickets") || "[]"
    );

    existing.unshift(ticket);

    localStorage.setItem("veloraTickets", JSON.stringify(existing));

    navigate("/ticket", {
      state: ticket,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-28 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center text-5xl font-bold"
        >
          Booking Summary
        </motion.h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-[#151A26] lg:col-span-2"
          >
            <img
              src={poster}
              alt={movie}
              className="h-80 w-full object-cover"
            />

            <div className="space-y-6 p-8">
              <div>
                <h2 className="text-4xl font-bold">{movie}</h2>
                <p className="mt-2 text-gray-400">Premium Cinema Experience</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                  <FaMapMarkerAlt className="text-yellow-400" />
                  <div>
                    <p className="text-xs text-gray-500">Theater</p>
                    <p>{theater}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                  <FaCalendarAlt className="text-yellow-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p>{date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                  <FaClock className="text-yellow-400" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p>{time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                  <FaTicketAlt className="text-yellow-400" />
                  <div>
                    <p className="text-xs text-gray-500">Seats</p>
                    <p>{seats.join(", ")}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                <p className="text-yellow-300">
                  Seat Type: <strong>{seatType}</strong>
                </p>
                <p className="mt-2 text-yellow-300">
                  Price per Seat: ₹{pricePerSeat}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-fit rounded-3xl border border-yellow-400/20 bg-[#151A26] p-6"
          >
            <h3 className="text-2xl font-bold">Payment Summary</h3>

            <div className="mt-6 space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Seats ({seats.length})</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Convenience Fee</span>
                <span>₹{convenienceFee}</span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-2xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-yellow-400">₹{total}</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 25px rgba(250,204,21,.25)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={confirmBooking}
              className="mt-8 w-full rounded-full bg-yellow-400 py-4 text-lg font-semibold text-black hover:bg-yellow-300"
            >
              Confirm & Pay
            </motion.button>

            <p className="mt-4 text-center text-xs text-gray-500">
              Secure checkout • Digital ticket generated instantly
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;