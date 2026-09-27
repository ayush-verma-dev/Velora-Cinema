import { useState, useMemo } from "react";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaGooglePay,
  FaCreditCard,
  FaWallet,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read booking from router state or localStorage
  const booking = useMemo(() => {
    return (
      location.state ||
      JSON.parse(localStorage.getItem("veloraBooking")) ||
      null
    );
  }, [location.state]);

  const [method, setMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-6 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400">
            Booking Not Found
          </h1>

          <p className="mt-3 text-gray-400">
            Please select your seats again.
          </p>

          <button
            onClick={() => navigate("/movies")}
            className="mt-8 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black hover:bg-yellow-300"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  const { bookingInfo, seats, totalPrice, showId } = booking;

  const methods = [
    { name: "UPI", icon: <FaGooglePay size={22} /> },
    { name: "Card", icon: <FaCreditCard size={22} /> },
    { name: "Wallet", icon: <FaWallet size={22} /> },
  ];

  console.log("BookingInfo:", bookingInfo); // 

  async function handlePayment() {
    try {
      setProcessing(true);

      // Create Razorpay Order
      const { data } = await API.post("/payment/create-order", {
        amount: totalPrice,
      });

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Velora Cinema",
        description: bookingInfo.movie,
        order_id: order.id,

        prefill: {
          name: JSON.parse(localStorage.getItem("user"))?.name || "",
          email: JSON.parse(localStorage.getItem("user"))?.email || "",
        },

        theme: {
          color: "#FACC15",
        },

        handler: async function (response) {
          try {
            console.log("Payment Success:", response);

            // Verify payment
            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.data.success) {
              alert("Payment verification failed.");
              return;
            }

            console.log("Booking payload:", {
              movieId: bookingInfo.movieId,
              theaterId: bookingInfo.theaterId,
              showId: bookingInfo.showId,
              showtime: bookingInfo.showtime,
              seats: seats.map((s) => ({ id: s.id })),
              totalPrice,
            });

            // Create booking
            const bookingRes = await API.post("/bookings/create", {
              movieId: bookingInfo.movieId,
              theaterId: bookingInfo.theaterId,
              showId: bookingInfo.showId,
              showtime: bookingInfo.showtime,
              seats: seats.map((s) => ({ id: s.id })),
              totalPrice,
            });

            const ticket = {
              ...booking,
              bookingId: bookingRes.data.booking.bookingId,
              paymentMethod: method,
              bookedAt: new Date().toLocaleString(),
              paymentId: verifyRes.data.paymentId,
              orderId: verifyRes.data.orderId,
              paymentStatus: "paid",
            };

            const previous =
              JSON.parse(localStorage.getItem("veloraTickets")) || [];

            previous.push(ticket);

            localStorage.setItem(
              "veloraTickets",
              JSON.stringify(previous)
            );

            localStorage.removeItem("veloraBooking");

            navigate(`/ticket/${bookingRes.data.booking.bookingId}`, {
              state: ticket,
            });
          } catch (error) {
            console.error(error);
            alert(
              error.response?.data?.message ||
                "Booking failed after payment."
            );
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        alert("Payment Failed!");
        console.log(response.error);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Unable to start payment.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px]">

        {/* Left */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex w-fit items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
          >
            <FaArrowLeft />
            Back
          </button>

          <h1 className="text-4xl font-bold">Secure Payment</h1>

          <p className="mt-3 text-gray-400">
            Your seats are reserved for 5 minutes.
          </p>

          <div className="mt-10 space-y-4">
            {methods.map((m) => (
              <button
                key={m.name}
                onClick={() => setMethod(m.name)}
                className={`flex w-full items-center justify-between rounded-2xl border p-5 transition ${
                  method === m.name
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-white/10 bg-[#151A26]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {m.icon}
                  <span>{m.name}</span>
                </div>

                {method === m.name && (
                  <FaLock className="text-yellow-400" />
                )}
              </button>
            ))}
          </div>

          {method === "UPI" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#151A26] p-6">
              <label className="text-sm text-gray-400">UPI ID</label>

              <input
                placeholder="example@upi"
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#0B0F19] p-4 outline-none focus:border-yellow-400"
              />
            </div>
          )}

          {method === "Card" && (
            <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-[#151A26] p-6">
              <input
                placeholder="Card Number"
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] p-4 outline-none focus:border-yellow-400"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="MM/YY"
                  className="rounded-xl border border-white/10 bg-[#0B0F19] p-4 outline-none focus:border-yellow-400"
                />

                <input
                  placeholder="CVV"
                  className="rounded-xl border border-white/10 bg-[#0B0F19] p-4 outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          )}

          {method === "Wallet" && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#151A26] p-6">
              <p className="text-gray-300">
                Wallet payment selected.
              </p>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="sticky top-8 h-fit rounded-[36px] border border-white/10 bg-[#151A26] p-8">
          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            <Row label="Movie" value={bookingInfo.movie} />
            <Row label="Theater" value={bookingInfo.theater} />
            <Row
              label="Showtime"
              value={`${bookingInfo.date} • ${bookingInfo.showtime}`}
            />
            <Row label="Screen" value={bookingInfo.screen} />
            <Row
              label="Seats"
              value={seats.map((s) => s.id).join(", ")}
            />
          </div>

          <div className="my-6 border-t border-white/10" />

          <Row
            label="Total"
            value={`₹${totalPrice}`}
            bold
          />

          <button
            onClick={handlePayment}
            disabled={processing}
            className="mt-8 w-full rounded-full bg-yellow-400 py-4 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {processing
              ? "Processing Payment..."
              : `Pay ₹${totalPrice}`}
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            🔒 Your payment is secured with encryption.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-400">{label}</span>

      <span
        className={`text-right ${
          bold ? "font-bold text-yellow-300" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default Payment;