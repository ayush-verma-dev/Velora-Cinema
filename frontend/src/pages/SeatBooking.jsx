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
).replace(/\/api\/?$/, "");

function SeatBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    movie,
    theater,
    showId,
    date,
    time,
    price,
    screen,
  } = state || {};

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

      setBookedSeats(data.show?.bookedSeats || []);

      setLockedSeats(
        (data.show?.lockedSeats || []).map((lock) => lock.seat)
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

      if (!token || selectedSeats.length === 0) {
        return;
      }

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
    const row = seatRows.find((r) => r.row === seatId[0]);

    return row ? row.type : "Normal";
  };

  const toggleSeat = (seatId) => {
    if (
      bookedSeats.includes(seatId) ||
      lockedSeats.includes(seatId)
    ) {
      return;
    }

    if (selectedSeats.some((seat) => seat.id === seatId)) {
      const updatedSeats = selectedSeats.filter(
        (seat) => seat.id !== seatId
      );

      setSelectedSeats(updatedSeats);

      if (updatedSeats.length === 0) {
        setTimerActive(false);
      }

      return;
    }

    const type = getSeatType(seatId);

    const newSeat = {
      id: seatId,
      type,
      price: prices[type],
    };

    setSelectedSeats((prevSeats) => [
      ...prevSeats,
      newSeat,
    ]);

    if (!timerActive) {
      setTimerActive(true);
    }
  };

  const handleExpire = async () => {
    await releaseSeats();

    setSelectedSeats([]);
    setTimerActive(false);
    setExpired(true);

    await fetchShow();
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + seat.price,
    0
  );

  const seatColor = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      return "bg-red-500 text-white cursor-not-allowed";
    }

    if (lockedSeats.includes(seatId)) {
      return "bg-orange-500 text-white cursor-not-allowed";
    }

    if (selectedSeats.some((seat) => seat.id === seatId)) {
      return "bg-yellow-400 text-black";
    }

    const type = getSeatType(seatId);

    if (type === "VIP") {
      return "bg-purple-500/20 border border-purple-400 text-purple-300 hover:bg-purple-500/30";
    }

    if (type === "Premium") {
      return "bg-blue-500/20 border border-blue-400 text-blue-300 hover:bg-blue-500/30";
    }

    return "bg-white/5 border border-white/10 text-gray-300 hover:border-yellow-400 hover:text-yellow-300";
  };

// ==========================
// Razorpay Payment
// ==========================

const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to continue.");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    if (!movie?._id || !theater?._id || !showId || !time) {
      console.error("Missing booking details:", {
        movieId: movie?._id,
        theaterId: theater?._id,
        showId,
        time,
      });

      alert("Booking details are incomplete. Please select the show again.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay failed to load. Please refresh the page and try again.");
      return;
    }

    // ==========================================
    // STEP 1: Lock selected seats
    // ==========================================

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

    console.log("Lock seats response:", lockResponse.data);

    if (!lockResponse.data?.success) {
      alert(
        lockResponse.data?.message ||
          "Unable to lock selected seats."
      );
      return;
    }

    // ==========================================
    // STEP 2: Create Razorpay order
    // ==========================================

    const orderResponse = await API.post(
      "/bookings/create-order",
      {
        amount: totalPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Create Razorpay order response:", orderResponse.data);

    if (!orderResponse.data?.success || !orderResponse.data?.order) {
      await releaseSeats();

      alert(
        orderResponse.data?.message ||
          "Unable to create payment order."
      );

      return;
    }

    const order = orderResponse.data.order;

    // ==========================================
    // STEP 3: Open Razorpay checkout
    // ==========================================

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency: order.currency || "INR",

      name: "Velora Cinema",

      description: `${movie.title} Movie Tickets`,

      order_id: order.id,

      handler: async function (response) {
        console.log("Razorpay payment successful:", response);

        await verifyPayment(response);
      },

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },

      theme: {
        color: "#FACC15",
      },

      modal: {
        ondismiss: async () => {
          console.log("Payment cancelled by user.");

          await releaseSeats();

          setSelectedSeats([]);
          setTimerActive(false);
          setExpired(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    // ==========================================
    // STEP 4: Handle payment failure
    // ==========================================

    razorpay.on("payment.failed", async (response) => {
      console.error("Razorpay Payment Failed:", response.error);

      await releaseSeats();

      setSelectedSeats([]);
      setTimerActive(false);
      setExpired(false);

      alert(
        `Payment Failed\n\nReason: ${
          response.error?.description || "Unknown error"
        }`
      );
    });

    // ==========================================
    // STEP 5: Open Razorpay
    // ==========================================

    razorpay.open();
  } catch (error) {
    console.error("Payment Error:", error);
    console.error(
      "Payment Error Response:",
      error.response?.data
    );

    // Try to release seats if something failed
    try {
      await releaseSeats();
    } catch (releaseError) {
      console.error(
        "Failed to release seats after payment error:",
        releaseError
      );
    }

    alert(
      error.response?.data?.message ||
        "Unable to start payment. Please try again."
    );
  }
};

// ==========================
// Payment Success
// ==========================

const verifyPayment = async (paymentData) => {
  try {
    console.log("=================================");
    console.log("verifyPayment started");
    console.log("Payment Data:", paymentData);
    console.log("=================================");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (
      !paymentData?.razorpay_order_id ||
      !paymentData?.razorpay_payment_id ||
      !paymentData?.razorpay_signature
    ) {
      console.error(
        "Invalid Razorpay payment data:",
        paymentData
      );

      alert("Invalid payment information received.");
      return;
    }

    if (
      !movie?._id ||
      !theater?._id ||
      !showId ||
      !time ||
      selectedSeats.length === 0
    ) {
      console.error("Missing booking information:", {
        movieId: movie?._id,
        theaterId: theater?._id,
        showId,
        time,
        selectedSeats,
      });

      alert(
        "Payment succeeded, but booking information is incomplete."
      );

      return;
    }

    // ==========================================
    // STEP 1: Verify Razorpay payment
    // ==========================================

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

    console.log(
      "Payment verification response:",
      verifyRes.data
    );

    if (!verifyRes.data?.success) {
      console.error(
        "Payment verification failed:",
        verifyRes.data
      );

      alert(
        verifyRes.data?.message ||
          "Payment verification failed."
      );

      return;
    }

    console.log("Payment verified successfully.");

    // ==========================================
    // STEP 2: Create confirmed booking
    // ==========================================

    const bookingPayload = {
      movieId: movie._id,
      theaterId: theater._id,
      showId: showId,
      showtime: time,
      seats: selectedSeats,
      totalPrice: totalPrice,
      paymentOrderId: paymentData.razorpay_order_id,
      paymentId: paymentData.razorpay_payment_id,
      paymentMethod: "Razorpay",
    };

    console.log(
      "Creating booking with payload:",
      bookingPayload
    );

    const bookingResponse = await API.post(
      "/bookings/create",
      bookingPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "Create booking response:",
      bookingResponse.data
    );

    // ==========================================
    // STEP 3: Validate booking response
    // ==========================================

    if (
      !bookingResponse.data?.success ||
      !bookingResponse.data?.booking
    ) {
      console.error(
        "Booking creation failed:",
        bookingResponse.data
      );

      alert(
        bookingResponse.data?.message ||
          "Payment succeeded but booking creation failed."
      );

      return;
    }

    const booking = bookingResponse.data.booking;

    if (!booking.bookingId) {
      console.error(
        "Booking created but bookingId is missing:",
        booking
      );

      alert(
        "Booking was created but ticket information is missing."
      );

      return;
    }

    console.log("Booking created successfully:", booking);

    // ==========================================
    // STEP 4: Stop seat timer and refresh seats
    // ==========================================

    setTimerActive(false);
    setSelectedSeats([]);
    setExpired(false);

    await fetchShow();

    // ==========================================
    // STEP 5: Navigate to ticket page
    // ==========================================

    console.log(
      "Redirecting to ticket:",
      `/ticket/${booking.bookingId}`
    );

    navigate(`/ticket/${booking.bookingId}`, {
      state: booking,
    });
  } catch (error) {
    console.error(
      "Verification/Booking Error:",
      error
    );

    console.error(
      "Backend Error Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
        "Payment succeeded but booking creation failed. Please check My Tickets."
    );
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
                ? `${BACKEND_URL}/${movie.poster
                    .split(/[\\/]/)
                    .pop()}`
                : "https://placehold.co/300x450/111827/FACC15?text=Movie"
            }
            alt={movie?.title || "Movie"}
            className="h-56 w-40 rounded-2xl object-cover shadow-xl"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/300x450/111827/FACC15?text=Movie";
            }}
          />

          <div className="flex-1">
            <h1 className="text-4xl font-bold">
              {movie?.title || "Movie"}
            </h1>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">
              <span>{movie?.genre || "N/A"}</span>
              <span>•</span>
              <span>{movie?.duration || "N/A"}</span>
              <span>•</span>
              <span>{movie?.language || "N/A"}</span>
              <span>•</span>
              <span>{movie?.format || "N/A"}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-gray-400">
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-400" />
                {theater?.name || "Theater"}
              </span>

              <span className="flex items-center gap-2">
                <FaClock className="text-yellow-400" />
                {formattedDate} • {time || "N/A"}
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
              <Legend
                color="bg-purple-500/30 border border-purple-400"
                label="VIP"
              />

              <Legend
                color="bg-blue-500/30 border border-blue-400"
                label="Premium"
              />

              <Legend
                color="bg-white/10 border border-white/20"
                label="Normal"
              />

              <Legend
                color="bg-yellow-400"
                label="Selected"
              />

              <Legend
                color="bg-red-500"
                label="Booked"
              />

              <Legend
                color="bg-orange-500"
                label="Locked"
              />
            </div>

            {/* Seats */}
            <div className="space-y-6">
              {seatRows.map((row) => (
                <div key={row.row}>

                  {(row.row === "A" ||
                    row.row === "B" ||
                    row.row === "E") && (
                    <div className="mb-5 mt-7 text-center text-sm font-semibold tracking-[0.3em] text-gray-300 sm:text-base">
                      {row.row === "A"
                        ? "VIP SECTION"
                        : row.row === "B"
                        ? "PREMIUM SECTION"
                        : "NORMAL SECTION"}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1.5 sm:gap-3">

                    <span className="w-6 text-center text-sm font-bold text-yellow-300 sm:w-8 sm:text-base">
                      {row.row}
                    </span>

                    {Array.from({
                      length: row.seats,
                    }).map((_, index) => {
                      const seatId = `${row.row}${index + 1}`;

                      const isBooked =
                        bookedSeats.includes(seatId);

                      const isLocked =
                        lockedSeats.includes(seatId);

                      const isSelected =
                        selectedSeats.some(
                          (seat) => seat.id === seatId
                        );

                      return (
                        <button
                          key={seatId}
                          type="button"
                          onClick={() =>
                            toggleSeat(seatId)
                          }
                          disabled={
                            isBooked ||
                            isLocked ||
                            loadingSeats
                          }
                          aria-label={`Seat ${seatId}`}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-semibold transition sm:h-10 sm:w-10 sm:text-xs ${seatColor(
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
            className="h-fit rounded-3xl border border-yellow-400/20 bg-[#151A26] p-4 sm:p-6 lg:sticky lg:top-28"
          >
            <h2 className="text-2xl font-bold">
              Booking Summary
            </h2>

            <img
              src={
                movie?.poster
                  ? `${BACKEND_URL}/${movie.poster
                      .split(/[\\/]/)
                      .pop()}`
                  : "https://placehold.co/300x450/111827/FACC15?text=Movie"
              }
              alt={movie?.title || "Movie"}
              className="mt-6 h-40 w-full rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/300x450/111827/FACC15?text=Movie";
              }}
            />

            <div className="mt-6 space-y-4">

              <SummaryRow
                label="Movie"
                value={movie?.title || "N/A"}
              />

              <SummaryRow
                label="Theater"
                value={theater?.name || "N/A"}
              />

              <SummaryRow
                label="Showtime"
                value={
                  <>
                    {date || "N/A"}
                    <br />
                    {time || "N/A"}
                  </>
                }
                stacked
              />

              <SummaryRow
                label="Seats"
                value={
                  selectedSeats.length
                    ? selectedSeats
                        .map((seat) => seat.id)
                        .join(", ")
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

            {/* Payment Button */}
            <motion.button
              type="button"
              whileHover={{
                scale:
                  selectedSeats.length && !loadingSeats
                    ? 1.02
                    : 1,
              }}
              whileTap={{
                scale:
                  selectedSeats.length && !loadingSeats
                    ? 0.98
                    : 1,
              }}
              onClick={handlePayment}
              disabled={
                !selectedSeats.length ||
                loadingSeats
              }
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-semibold transition ${
                selectedSeats.length && !loadingSeats
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "cursor-not-allowed bg-gray-700 text-gray-400"
              }`}
            >
              <FaTicketAlt />

              {loadingSeats
                ? "Loading Seats..."
                : "Continue to Payment"}
            </motion.button>
          </motion.div>
        </div>

        {/* Expired Seat Modal */}
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