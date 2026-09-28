import { useEffect, useState } from "react";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTicketAlt,
  FaMapMarkerAlt,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";

import SeatHoldTimer from "../components/SeatHoldTimer";
import SeatExpiredModal from "../components/SeatExpiredModal";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

function SeatBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { movie, theater, showId, date, time, price, screen } = state || {};

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  const seatRows = [
    { row: "A", type: "VIP", seats: 8 },
    { row: "B", type: "Premium", seats: 10 },
    { row: "C", type: "Premium", seats: 10 },
    { row: "D", type: "Premium", seats: 10 },
    { row: "E", type: "Normal", seats: 10 },
    { row: "F", type: "Normal", seats: 10 },
    { row: "G", type: "Normal", seats: 10 },
    { row: "H", type: "Normal", seats: 10 },
  ];

  const prices = {
    VIP: 500,
    Premium: 350,
    Normal: 200,
  };

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [expired, setExpired] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(true);

  useEffect(() => {
    if (showId) {
      fetchShow();
    } else {
      setLoadingSeats(false);
    }
  }, [showId]);

  async function fetchShow() {
    try {
      const { data } = await API.get(`/shows/${showId}`);
      setBookedSeats(data.show.bookedSeats || []);
      setLockedSeats(
        (data.show.lockedSeats || []).map((lock) => lock.seat)
      );
    } catch (error) {
      console.error("Failed to load seats:", error);
    } finally {
      setLoadingSeats(false);
    }
  }

  if (!movie || !showId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="rounded-3xl border border-white/10 bg-[#151A26] p-10 text-center">
          <h2 className="text-3xl font-bold">No Show Selected</h2>

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

  async function releaseSeats() {
    try {
      const token = localStorage.getItem("token");

      if (!token || selectedSeats.length === 0) return;

      await API.post(
        "/bookings/unlock-seats",
        {
          showId,
          seats: selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchShow();
    } catch (error) {
      console.error("Failed to release seats:", error);
    }
  }

  const getSeatType = (seatId) => {
    return seatRows.find((r) => r.row === seatId[0]).type;
  };

  const toggleSeat = (seatId) => {
    if (
      bookedSeats.includes(seatId) ||
      lockedSeats.includes(seatId)
    )
      return;

    if (selectedSeats.some((seat) => seat.id === seatId)) {
      const updated = selectedSeats.filter((seat) => seat.id !== seatId);

      setSelectedSeats(updated);

      if (updated.length === 0) setTimerActive(false);

      return;
    }

    const type = getSeatType(seatId);

    setSelectedSeats([
      ...selectedSeats,
      {
        id: seatId,
        type,
        price: prices[type],
      },
    ]);

    if (!timerActive) setTimerActive(true);
  };

  const handleExpire = async () => {
    await releaseSeats();

    setSelectedSeats([]);
    setTimerActive(false);
    setExpired(true);

    fetchShow();
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + seat.price,
    0
  );

  /*const continueBooking = () => {
    if (!selectedSeats.length) return;

    const bookingData = {
      bookingInfo: {
        movie: movie.title,
        movieId: movie._id,
        poster: movie.poster,

        theater: theater.name,
        theaterId: theater._id,

        showId, // Required for backend booking

        showtime: `${date} • ${time}`,
        date,
        time,
        screen,
        experience: screen || theater.experience,
      },

      seats: selectedSeats,
      price,
      totalPrice,
    };

    // Save for refresh support
    localStorage.setItem("veloraBooking", JSON.stringify(bookingData));

    // Scroll to top before navigation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    // Go to payment page
    navigate("/payment", {
      state: bookingData,
    });
  };*/

  const seatColor = (seatId) => {
    if (bookedSeats.includes(seatId))
      return "bg-red-500 text-white cursor-not-allowed";

    if (lockedSeats.includes(seatId))
      return "bg-orange-500 text-white cursor-not-allowed";

    if (selectedSeats.some((seat) => seat.id === seatId))
      return "bg-yellow-400 text-black";

    const type = getSeatType(seatId);

    if (type === "VIP")
      return "bg-purple-500/20 border border-purple-400 text-purple-300 hover:bg-purple-500/30";

    if (type === "Premium")
      return "bg-blue-500/20 border border-blue-400 text-blue-300 hover:bg-blue-500/30";

    return "bg-white/5 border border-white/10 text-gray-300 hover:border-yellow-400 hover:text-yellow-300";
  };

  // ==========================
// Razorpay Payment
// ==========================

const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    const totalAmount = totalPrice;

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    // Step 1: Lock selected seats for 5 minutes
    const lockResponse = await API.post(
      "/bookings/lock-seats",
      {
        showId,
        seats: selectedSeats,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!lockResponse.data.success) {
      alert(lockResponse.data.message || "Unable to lock seats.");
      return;
    }

    // Step 2: Create Razorpay order
    const payload = {
      movieId: movie?._id,
      theaterId: theater?._id,
      showId,
      showtime: selectedShow?.time,
      seats: selectedSeats,
      totalPrice,
      paymentId: paymentData.razorpay_payment_id,
    };

    console.log("Booking payload:", payload);

    const { data } = await API.post(
      "/bookings/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const order = data.order;
    amount: data.order.amount;
    order_id: data.order.id;

console.log("Create booking response:", bookingRes.data);

    // Step 3: Get Razorpay order
    const order = data.order;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Velora Cinema",
      description: `${movie.title} Movie Tickets`,
      order_id: data.order.id,

      handler: async function (response) {
        await verifyPayment(response);
      },

      prefill: {
        name: JSON.parse(localStorage.getItem("user"))?.name || "",
        email: JSON.parse(localStorage.getItem("user"))?.email || "",
      },

      theme: {
        color: "#FACC15",
      },

      modal: {
        ondismiss: async () => {
          console.log("Payment cancelled.");

          await releaseSeats();

          setSelectedSeats([]);
          setTimerActive(false);
          setExpired(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", async function (response) {
      console.error("Payment Failed:", response.error);

      await releaseSeats();

      setSelectedSeats([]);
      setTimerActive(false);

      alert(
        `Payment Failed\n\nReason: ${response.error.description}`
      );
    });

    razorpay.open();
  } catch (error) {
    console.error("Payment Error:", error);
    console.log("Response:", error.response);

    alert(error.response?.data?.message || "Unable to start payment.");
  }
};

// ==========================
// Payment Success
// ==========================

const verifyPayment = async (paymentData) => {
  try {
    console.log("verifyPayment started");

    const token = localStorage.getItem("token");

    // Step 1: Verify payment signature with backend
    const verifyRes = await API.post(
      "/bookings/verify-payment",
      {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Verification response:", verifyRes.data);

    if (!verifyRes.data.success) {
      alert("Payment verification failed.");
      return;
    }

    // Step 2: Create booking only after verification

    let bookingData;

    try {
    console.log("About to create booking");

    const response = await API.post(
      "/bookings/create",
      {
        movieId: movie._id,
        theaterId: theater._id,
        showId: showId,
        seats: selectedSeats,
        totalPrice,
        paymentId: paymentData.razorpay_payment_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Booking payload:", {
      movieId: movie?._id,
      theaterId: theater?._id,
      showId,
      seats: selectedSeats,
      totalPrice,
      paymentId: paymentData.razorpay_payment_id,
    });

    console.log("Create booking response:", response.data);

    if (response.data.success) {
      navigate(`/ticket/${response.data.booking.bookingId}`, {
        state: response.data.booking,
      });
      return;
    }

    alert("Payment succeeded but booking creation failed.");
  } catch (err) {
    console.error(
      "Booking creation failed:",
      err.response?.data || err.message
    );
    alert("Payment succeeded but booking creation failed.");
  }

    if (!bookingData.success || !bookingData.booking?.bookingId) {
      alert("Booking created but booking ID was not returned.");
      return;
    }

    setTimerActive(false);
    setSelectedSeats([]);
    await fetchShow();

    //await fetchShow();

    // Backend must return booking
    if (!bookingData.success || !bookingData.booking || !bookingData.booking.bookingId) {
      console.error("Invalid booking response:", data);
      alert("Ticket created but booking ID was not returned.");
      return;
    }

    // Stop timer
    setTimerActive(false);
    setSelectedSeats([]);
    await fetchShow();

    // Give Razorpay modal a moment to close
    setTimeout(() => {
      console.log("Redirecting to ticket:", `/ticket/${data.booking.bookingId}`);

      if (bookingRes.data.success) {
        navigate(`/ticket/${bookingRes.data.booking.bookingId}`, {
          state: bookingRes.data.booking,
        });
      } else {
        alert("Booking creation failed.");
      }
    }, 300);

  } catch (error) {
    console.error("Verification/Booking Error:", error);

    alert("Payment succeeded but booking creation failed.");
  }
};

  return (
    <div className="min-h-screen bg-[#0B0F19] py-10 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex w-fit items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center">
          <img
            src={
              movie?.poster
                ? `${BACKEND_URL}/${movie.poster.split(/[\\/]/).pop()}`
                : "https://placehold.co/300x450/111827/FACC15?text=Movie"
            }
            alt={movie.title}
            className="h-56 w-40 rounded-2xl object-cover shadow-xl"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/300x450/111827/FACC15?text=Movie";
            }}
          />

          <div className="flex-1">
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">
              <span>{movie.genre}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span>{movie.language}</span>
              <span>•</span>
              <span>{movie.format}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-gray-400">
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-400" />
                {theater.name}
              </span>

              <span className="flex items-center gap-2">
                <FaClock className="text-yellow-400" />
                {formattedDate} • {time}
              </span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <SeatHoldTimer
          active={timerActive}
          duration={300}
          onExpire={handleExpire}
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Seat Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-[#151A26] p-3 sm:p-6"
          >
            {/* Legend */}
            <div className="mb-8 flex flex-wrap justify-center gap-6 text-sm">
              <Legend color="bg-purple-500/30 border border-purple-400" label="VIP" />
              <Legend color="bg-blue-500/30 border border-blue-400" label="Premium" />
              <Legend color="bg-white/10 border border-white/20" label="Normal" />
              <Legend color="bg-yellow-400" label="Selected" />
              <Legend color="bg-red-500" label="Booked" />
            </div>

            <div className="space-y-6">
              {seatRows.map((row) => (
                <div key={row.row}>
                  {(row.row === "A" || row.row === "B" || row.row === "E") && (
                    <div className="mb-5 mt-7 text-center text-sm sm:text-base font-semibold tracking-[0.3em] text-gray-300">
                      {row.row === "A"
                        ? "VIP SECTION"
                        : row.row === "B"
                        ? "PREMIUM SECTION"
                        : "NORMAL SECTION"}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                    <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-bold text-yellow-300">
                      {row.row}
                    </span>

                    {Array.from({ length: row.seats }).map((_, index) => {
                      const seatId = `${row.row}${index + 1}`;

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={
                            bookedSeats.includes(seatId) ||
                            lockedSeats.includes(seatId) ||
                            loadingSeats
                          }
                          className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-[11px] sm:text-xs font-semibold transition ${seatColor(
                            seatId
                          )}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Screen */}
            <div className="mt-14 flex justify-center">
              <div className="w-full max-w-3xl">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_25px_rgba(250,204,21,.5)]" />

                <p className="mt-3 text-center text-sm tracking-[0.4em] text-yellow-300">
                  SCREEN
                </p>
              </div>
            </div>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-28 h-fit rounded-3xl border border-yellow-400/20 bg-[#151A26] p-4 sm:p-6"
          >
            <h2 className="text-2xl font-bold">Booking Summary</h2>

            <img
              src={
                movie?.poster
                  ? `${BACKEND_URL}/${movie.poster.split(/[\\/]/).pop()}`
                  : "https://placehold.co/300x450/111827/FACC15?text=Movie"
              }
              alt={movie.title}
              className="mt-6 h-40 w-full rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/300x450/111827/FACC15?text=Movie";
              }}
            />

            <div className="mt-6 space-y-4">
              <SummaryRow label="Movie" value={movie.title} />
              <SummaryRow label="Theater" value={theater.name} />
              <SummaryRow
                label="Showtime"
                value={
                  <>
                    {date}
                    <br />
                    {time}
                  </>
                }
                stacked
              />
              <SummaryRow
                label="Seats"
                value={
                  selectedSeats.length
                    ? selectedSeats.map((seat) => seat.id).join(", ")
                    : "None"
                }
              />
            </div>

            <div className="my-6 border-t border-white/10" />

            <SummaryRow
              label="Total"
              value={`₹${totalPrice}`}
              bold
            />

            <motion.button
              whileHover={{
                scale: selectedSeats.length && !loadingSeats ? 1.02 : 1,
              }}
              whileTap={{
                scale: selectedSeats.length && !loadingSeats ? 0.98 : 1,
              }}
              onClick={handlePayment}
              disabled={!selectedSeats.length || loadingSeats}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-semibold transition ${
                selectedSeats.length && !loadingSeats
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "cursor-not-allowed bg-gray-700 text-gray-400"
              }`}
            >
              <FaTicketAlt />
              Continue to Payment
            </motion.button>
          </motion.div>
        </div>

        <SeatExpiredModal
          open={expired}
          onClose={() => setExpired(false)}
        />
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-5 w-5 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function SummaryRow({ label, value, bold, stacked = false }) {
  if (stacked) {
    return (
      <div>
        <p className="text-sm text-gray-400">{label}</p>

        <p
          className={`mt-1 break-words leading-relaxed text-right ${
            bold ? "font-bold text-yellow-300" : "text-white"
          }`}
        >
          {value}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-400">{label}</span>

      <span
        className={`text-right break-words ${
          bold ? "font-bold text-yellow-300" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default SeatBooking;