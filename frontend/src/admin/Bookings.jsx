import { useEffect, useState } from "react";
import {
  FaTicketAlt,
  FaUser,
  FaFilm,
  FaMapMarkerAlt,
  FaTv,
  FaChair,
  FaRupeeSign,
} from "react-icons/fa";
import API from "../services/api";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const { data } = await API.get("/bookings/admin");
      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#151A26] p-12 text-center text-white">
        Loading Bookings...
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Bookings</h1>
        <p className="mt-2 text-gray-400">
          View all customer bookings across Velora Cinema.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#151A26]">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-[#111827]">
            <tr className="text-left text-gray-400">
              <th className="p-5">Booking</th>
              <th className="p-5">Customer</th>
              <th className="p-5">Movie</th>
              <th className="p-5">Theater</th>
              <th className="p-5">Screen</th>
              <th className="p-5">Seats</th>
              <th className="p-5">Amount</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <FaTicketAlt className="text-yellow-400" />
                    <div>
                      <p className="font-semibold">{booking.bookingId}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-blue-400" />
                    <div>
                      <p>{booking.user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {booking.user?.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <FaFilm className="text-yellow-400" />
                    {booking.movie?.title}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-400" />
                    <div>
                      <p>{booking.theater?.name}</p>
                      <p className="text-xs text-gray-500">
                        {booking.theater?.city}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <FaTv className="text-cyan-400" />
                    {booking.show?.screen}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <FaChair className="text-green-400" />
                    {booking.seats.join(", ")}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-1 font-semibold text-yellow-300">
                    <FaRupeeSign />
                    {booking.totalPrice}
                  </div>
                </td>

                <td className="p-4">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                    Confirmed
                  </span>
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-10 text-center text-gray-500"
                >
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bookings;