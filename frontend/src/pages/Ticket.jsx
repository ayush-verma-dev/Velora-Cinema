import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import API from "../services/api";
import {
  FaCheckCircle,
  FaDownload,
  FaHome,
} from "react-icons/fa";

function Ticket() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const ticketRef = useRef();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const { data } = await API.get("/bookings/my");

        if (data.success) {
          const found = data.bookings.find(
            (b) => b.bookingId === bookingId
          );

          if (found) {
            setTicket(found);
          }
        }
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
          <p className="mt-5 text-lg text-gray-400">
            Loading Ticket...
          </p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-400">
            No Ticket Found
          </h2>

          <p className="mt-3 text-gray-400">
            This ticket doesn't exist.
          </p>

          <button
            onClick={() => navigate("/my-tickets")}
            className="mt-6 rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black hover:bg-yellow-300"
          >
            My Tickets
          </button>
        </div>
      </div>
    );
  }

  const moviePoster = ticket.movie?.poster
    ? `http://localhost:5000/${ticket.movie.poster.split("/").pop()}`
    : null;

  const formattedShowDate = ticket.show?.date
    ? new Date(ticket.show.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const qrData = JSON.stringify({
    bookingId: ticket.bookingId,
    movie: ticket.movie?.title,
    theater: ticket.theater?.name,
    seats: ticket.seats,
    showtime:
      ticket.showtime ||
      `${new Date(ticket.show?.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })} • ${ticket.show?.time}`,
    amount: ticket.totalPrice,
  });

  async function downloadPDF() {
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
    });

    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("portrait", "mm", "a4");

    const width = 190;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 10, 10, width, height);

    pdf.save(`${ticket.movie?.title}-ticket.pdf`);
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Success */}

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mb-10 text-center"
        >
          <FaCheckCircle
            className="mx-auto text-green-400"
            size={70}
          />

          <h1 className="mt-5 text-4xl font-bold">
            Booking Confirmed
          </h1>

          <p className="mt-3 text-gray-400">
            Your premium cinema experience is ready.
          </p>
        </motion.div>

        {/* Ticket */}

        <motion.div
          ref={ticketRef}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-[40px] border border-yellow-400/20 bg-gradient-to-br from-[#111827] to-[#0B0F19] shadow-[0_0_50px_rgba(250,204,21,.08)]"
        >
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl"></div>

          <div className="p-8">

            {/* Header */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-yellow-400">
                  Velora Cinema
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  IMAX PASS
                </h2>
              </div>

              {moviePoster && (
                <img
                  src={moviePoster}
                  alt={ticket.movie?.title}
                  className="h-28 rounded-2xl object-cover"
                />
              )}
            </div>

            <div className="my-8 border-t border-dashed border-yellow-400/20"></div>

            {/* Details */}

            <div className="grid gap-6 md:grid-cols-2">
              <TicketInfo
                label="Movie"
                value={ticket.movie?.title}
              />

              <TicketInfo
                label="Language"
                value={ticket.movie?.language}
              />

              <TicketInfo
                label="Theater"
                value={ticket.theater?.name}
              />

              <TicketInfo
                label="Experience"
                value={ticket.theater?.experience}
              />

              <TicketInfo
                label="Screen"
                value={ticket.show?.screen || "-"}
              />

              <TicketInfo
                label="Showtime"
                value={
                  ticket.showtime ||
                  `${new Date(ticket.show?.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })} • ${ticket.show?.time}`
                }
              />

              <TicketInfo
                label="Seats"
                value={ticket.seats.join(", ")}
              />

              <TicketInfo
                label="Amount Paid"
                value={`₹${ticket.totalPrice}`}
              />

              <TicketInfo
                label="Payment"
                value={
                  ticket.paymentMethod ||
                  ticket.paymentStatus ||
                  "Paid"
                }
              />

              <TicketInfo
                label="Ticket ID"
                value={ticket.bookingId}
              />

              <TicketInfo
                label="Booked On"
                value={new Date(
                  ticket.createdAt
                ).toLocaleString("en-IN")}
              />
            </div>

            <div className="my-8 border-t border-dashed border-yellow-400/20"></div>

            {/* QR */}

            <div className="flex flex-col items-center gap-5">
              <div className="rounded-2xl bg-white p-4">
                <QRCodeCanvas
                  value={qrData}
                  size={160}
                />
              </div>

              <div className="text-center">
                <p className="text-xs tracking-[0.35em] text-gray-500">
                  TICKET ID • {ticket.bookingId}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Scan this QR code at the entrance for ticket verification.
                </p>
              </div>

              {/* Barcode */}

              <div className="flex gap-[2px]">
                {Array.from({ length: 70 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[2px] ${
                      i % 2 === 0 ? "h-10" : "h-7"
                    } bg-white`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Perforated Edges */}

          <div className="absolute left-0 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B0F19]"></div>

          <div className="absolute right-0 top-1/2 h-8 w-8 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B0F19]"></div>
        </motion.div>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-3 rounded-full bg-yellow-400 px-8 py-4 font-semibold text-black hover:bg-yellow-300"
          >
            <FaDownload />
            Download PDF
          </button>

          <button
            onClick={() => navigate("/my-tickets")}
            className="flex items-center gap-3 rounded-full border border-white/10 px-8 py-4 hover:border-yellow-400"
          >
            My Tickets
          </button>

          <button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/");
            }}
            className="flex items-center gap-3 rounded-full border border-white/10 px-8 py-4 hover:border-yellow-400"
          >
            <FaHome />
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

function TicketInfo({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}

export default Ticket;