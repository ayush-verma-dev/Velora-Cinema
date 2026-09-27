import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTv,
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import API from "../services/api";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      // Correct backend endpoint
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
        <h1 className="mb-10 text-5xl font-bold">My Tickets</h1>

        {tickets.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151A26] p-12 text-center">
            <h2 className="text-2xl font-semibold">No Tickets Yet</h2>
            <p className="mt-4 text-gray-400">
              Book your first premium cinema experience.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="overflow-hidden rounded-3xl border border-yellow-400/20 bg-[#151A26]"
              >
                {/* Poster */}
                <img
                  src={
                    ticket.movie?.poster
                      ? `http://localhost:5000/${ticket.movie.poster
                          .split("/")
                          .pop()}`
                      : "https://placehold.co/600x900/111827/FACC15?text=Velora"
                  }
                  alt={ticket.movie?.title}
                  className="h-60 w-full object-cover"
                />

                <div className="space-y-5 p-6">
                  <h2 className="text-3xl font-bold">
                    {ticket.movie?.title}
                  </h2>

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
                      <span>Status</span>
                      <span className="font-semibold text-green-400">
                        Confirmed
                      </span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-yellow-400 p-5">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTickets;