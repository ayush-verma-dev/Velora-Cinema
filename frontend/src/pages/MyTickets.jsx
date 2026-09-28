import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTv,
  FaArrowRight,
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// Backend URL (works on localhost and Vercel)
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const { data } = await API.get("/bookings/my");
      setTickets(data.bookings || []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
          <p className="mt-5 text-lg text-gray-400">Loading Tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-32 pb-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold">My Tickets</h1>
            <p className="mt-2 text-gray-400">
              Your confirmed Velora Cinema bookings.
            </p>
          </div>

          {tickets.length > 0 && (
            <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-300">
              {tickets.length} Ticket{tickets.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151A26] p-12 text-center">
            <h2 className="text-2xl font-semibold">No Tickets Yet</h2>
            <p className="mt-4 text-gray-400">
              Book your first premium cinema experience.
            </p>

            <button
              onClick={() => navigate("/movies")}
              className="mt-8 rounded-full bg-yellow-400 px-8 py-3 font-semibold text-black hover:bg-yellow-300"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {tickets.map((ticket) => {
              const posterFile = ticket.movie?.poster || "";
              const posterUrl = posterFile
                ? `${BACKEND_URL}/${posterFile.split(/[\\/]/).pop()}`
                : "https://placehold.co/600x900/111827/FACC15?text=Velora";

              return (
                <div
                  key={ticket._id || ticket.bookingId}
                  onClick={() =>
                    navigate(`/ticket/${ticket.bookingId}`, {
                      state: ticket,
                    })
                  }
                  className="group cursor-pointer overflow-hidden rounded-3xl border border-yellow-400/20 bg-[#151A26] transition duration-300 hover:border-yellow-400/50 hover:shadow-[0_0_35px_rgba(250,204,21,.12)]"
                >
                  {/* Poster */}
                  <div className="relative overflow-hidden">
                    <img
                      src={posterUrl}
                      alt={ticket.movie?.title}
                      className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x900/111827/FACC15?text=No+Poster";
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                        Confirmed
                      </span>

                      <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white">
                        {ticket.bookingId}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-3xl font-bold leading-tight">
                        {ticket.movie?.title}
                      </h2>

                      <FaArrowRight className="mt-2 text-yellow-400 transition group-hover:translate-x-1" />
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaCalendarAlt className="text-yellow-400" />
                      {ticket.show?.date
                        ? new Date(ticket.show.date).toLocaleDateString("en-IN")
                        : new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaClock className="text-yellow-400" />
                      {ticket.show?.time || ticket.showtime}
                    </div>

                    {/* Theater */}
                    <div className="flex items-center gap-3 text-gray-300">
                      <FaMapMarkerAlt className="text-yellow-400" />
                      {ticket.theater?.name}
                    </div>

                    {/* Screen */}
                    {ticket.show?.screen && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaTv className="text-yellow-400" />
                        {ticket.show.screen}
                      </div>
                    )}

                    {/* Seats */}
                    <div className="rounded-xl bg-yellow-400/10 p-4 text-yellow-300">
                      Seats:{" "}
                      <span className="font-semibold">
                        {ticket.seats.join(", ")}
                      </span>
                    </div>

                    {/* Booking Info */}
                    <div className="rounded-xl border border-white/10 bg-[#1A2233] p-4">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Booking ID</span>
                        <span className="font-semibold text-yellow-300">
                          {ticket.bookingId}
                        </span>
                      </div>

                      <div className="mt-2 flex justify-between text-sm text-gray-400">
                        <span>Total Paid</span>
                        <span className="font-semibold text-white">
                          ₹{ticket.totalPrice}
                        </span>
                      </div>

                      <div className="mt-2 flex justify-between text-sm text-gray-400">
                        <span>Booked On</span>
                        <span className="font-semibold text-white">
                          {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-yellow-400/40 p-5">
                      <div className="rounded-lg bg-white p-3">
                        <QRCodeCanvas
                          value={JSON.stringify({
                            bookingId: ticket.bookingId,
                            movie: ticket.movie?.title,
                            theater: ticket.theater?.name,
                            screen: ticket.show?.screen,
                            showtime: ticket.show?.time || ticket.showtime,
                            seats: ticket.seats,
                            total: ticket.totalPrice,
                          })}
                          size={120}
                        />
                      </div>

                      <p className="text-center text-xs text-gray-400">
                        Scan this QR code at the theater entrance
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTickets;