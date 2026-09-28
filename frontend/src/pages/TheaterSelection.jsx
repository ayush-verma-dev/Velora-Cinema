import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFilm,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaCalendarAlt,
  FaChair,
} from "react-icons/fa";

// Backend URL
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");

// Convert poster name to correct URL
const getPosterUrl = (poster) => {
  if (!poster) return "";

  if (poster.startsWith("http")) return poster;

  return `${BACKEND_URL}/${poster.split(/[\\/]/).pop()}`;
};

function TheaterSelection() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Movie must come from navigation state
  const movie = state?.movie;
  const initialShow = state?.selectedTime || null;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(initialShow);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate unique dates from available shows
  const dates = useMemo(() => {
    const uniqueDates = [
      ...new Map(
        theaters
          .flatMap((t) => t.showtimes || [])
          .map((show) => {
            const d = new Date(show.date);

            return [
              show.date,
              {
                label: d.toLocaleDateString("en-US", { weekday: "short" }),
                date: d.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                }),
                full: d.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
                iso: show.date,
              },
            ];
          })
      ).values(),
    ];

    // Sort dates chronologically
    uniqueDates.sort((a, b) => new Date(a.iso) - new Date(b.iso));

    return uniqueDates;
  }, [theaters]);

  // Fetch all shows for this movie
  const fetchShows = useCallback(async () => {
    console.log("fetchShows called");
    console.log("Movie ID:", movie?._id);


    if (!movie?._id) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.get(`/shows/movie/${movie._id}`);
      console.log("API response:", data);

      const shows = data.shows || [];

      const groupedMap = {};
      shows.forEach((show) => {
        const id = show.theater._id;

        if (!groupedMap[id]) {
          groupedMap[id] = {
            _id: id,
            name: show.theater.name,
            city: show.theater.city || "Bangalore",
            location: show.theater.location || "",
            experience: show.theater.experience || show.screen,
            distance: show.theater.location || "Unknown Location",
            screens: show.theater.screens || 1,
            showtimes: [],
          };
        }

        groupedMap[id].showtimes.push({
          _id: show._id,
          time: show.time,
          price: show.price,
          screen: show.screen,
          date: show.date,
        });
      });

      const grouped = Object.values(groupedMap);
      grouped.sort((a, b) => a.name.localeCompare(b.name));
      setTheaters(grouped);
      console.log("Grouped theaters:", grouped);

      setTheaters(grouped);
      console.log("Grouped theaters:", grouped);

      if (grouped.length) {
        const allShows = grouped.flatMap(
          (t) => t.showtimes
        );

        const firstDate = allShows
          .sort(
            (a, b) =>
              new Date(a.date) - new Date(b.date)
          )[0].date;

        const d = new Date(firstDate);

        setSelectedDate({
          label: d.toLocaleDateString("en-US", {
            weekday: "short",
          }),
          date: d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          }),
          full: d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          iso: firstDate,
        });
      }

      setSelectedTheater(null);
      setSelectedTime(null);
    } catch (error) {
      console.error("Failed to load shows:", error);
      setTheaters([]);
    } finally {
      setLoading(false);
    }
  }, [movie]);

  // Load shows when movie changes
  useEffect(() => {
    if (movie?._id) {
      fetchShows();
    } else {
      setLoading(false);
    }
  }, [fetchShows, movie]);

  // Filter theaters by selected date
  const filteredTheaters = useMemo(() => {
    if (!selectedDate) return [];

    return theaters
      .map((theater) => ({
        ...theater,
        showtimes: (theater.showtimes || []).filter(
          (show) => show.date === selectedDate.iso
        ),
      }))
      .filter(
        (theater) => theater.showtimes.length > 0
      );
  }, [theaters, selectedDate]);

  // Auto-select first theater and show
  useEffect(() => {
    if (!filteredTheaters.length) {
      setSelectedTheater(null);
      setSelectedTime(null);
      return;
    }

    const firstTheater = filteredTheaters[0];
    const firstShow =
      firstTheater?.showtimes?.[0];

    if (!firstShow) return;

    setSelectedTheater(firstTheater);

    if (initialShow) {
      const matched = firstTheater.showtimes.find(
        (s) =>
          s.time ===
            (initialShow?.time || initialShow) ||
          s._id ===
            (initialShow?._id || initialShow)
      );

      setSelectedTime(matched || firstShow);
    } else {
      setSelectedTime(firstShow);
    }
  }, [filteredTheaters, initialShow]);

  // Prevent crashes on refresh
  if (!movie) {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
            <p className="mt-5 text-lg text-gray-400">
              Loading Theaters...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Movie Not Found</h2>
          <p className="mt-3 text-gray-400">
            Please choose a movie first.
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

  function continueBooking() {
    if (!selectedTheater || !selectedTime) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    navigate("/seat-booking", {
      state: {
        movie,
        showId: selectedTime._id,
        theater: selectedTheater,
        theaterId: selectedTheater._id,
        date: selectedTime.date,
        time: selectedTime.time,
        price: selectedTime.price,
        screen: selectedTime.screen,
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-28 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center">
          <div className="h-[360px] w-[240px] overflow-hidden rounded-3xl border border-white/10 bg-[#151A26] shadow-xl">
            <img
              src={getPosterUrl(movie.poster)}
              alt={movie.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/400x600/111827/FACC15?text=No+Poster";
              }}
            />
          </div>

          <div>
            <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm tracking-[0.25em] text-yellow-300">
              SELECT YOUR SHOW
            </span>

            <h1 className="mt-6 text-5xl font-bold">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-5 text-gray-300">
              <span className="flex items-center gap-2">
                <FaFilm className="text-yellow-400" />
                {movie.genre}
              </span>

              <span className="flex items-center gap-2">
                <FaClock className="text-yellow-400" />
                {movie.duration}
              </span>

              <span className="flex items-center gap-2">
                <FaChair className="text-yellow-400" />
                {movie.format}
              </span>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-10">
          <div className="mb-5 flex items-center gap-3">
            <FaCalendarAlt className="text-yellow-400" />
            <h2 className="text-2xl font-bold">Select Date</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {dates.map((day) => (
              <button
                key={day.full}
                onClick={() => setSelectedDate(day)}
                className={`min-w-[90px] rounded-2xl border px-4 py-4 transition ${
                  selectedDate?.full === day.full
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : "border-white/10 bg-[#151A26] hover:border-yellow-400"
                }`}
              >
                <p className="text-sm">{day.label}</p>
                <p className="mt-1 text-lg font-bold">
                  {day.date}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Theater Cards */}
        <div className="space-y-8">
          {filteredTheaters.map((theater, index) => (
            <motion.div
              key={theater._id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-3xl border p-7 transition-all duration-300 ${
                selectedTheater?._id === theater._id
                  ? "border-yellow-400 bg-yellow-400/5 shadow-[0_0_40px_rgba(250,204,21,.15)]"
                  : "border-white/10 bg-[#151A26] hover:border-yellow-400/30"
              }`}
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                {/* Left Side - Theater Info */}
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {theater.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-5 text-gray-400">
                    <span className="flex items-center gap-2">
                      <FaFilm className="text-yellow-400" />
                      {theater.experience}
                    </span>

                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-yellow-400" />
                      {theater.location}
                    </span>

                    <span className="flex items-center gap-2">
                      <FaChair className="text-yellow-400" />
                      {theater.screens} Screens
                    </span>
                  </div>
                </div>

                {/* Right Side - Select Button */}
                <button
                  onClick={() => {
                    setSelectedTheater(theater);
                    setSelectedTime(theater.showtimes[0]);
                  }}
                  className={`rounded-full px-6 py-3 font-semibold transition ${
                    selectedTheater?._id === theater._id
                      ? "bg-yellow-400 text-black"
                      : "border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black"
                  }`}
                >
                  {selectedTheater?._id === theater._id
                    ? "Selected"
                    : "Choose Theater"}
                </button>
              </div>

              {/* Showtimes */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold">
                  Showtimes
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {theater.showtimes.map((show) => (
                    <button
                      key={show._id}
                      onClick={() => {
                        setSelectedTheater(theater);
                        setSelectedTime(show);
                      }}
                      className={`rounded-xl border px-4 py-4 text-left transition ${
                        selectedTime?._id === show._id
                          ? "border-yellow-400 bg-yellow-400 text-black"
                          : "border-white/10 bg-white/5 hover:border-yellow-400"
                      }`}
                    >
                      <p className="font-bold">{show.time}</p>
                      <p className="text-sm">₹{show.price}</p>
                      <p className="text-xs">{show.screen}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* NEW: Empty State */}
        {!loading && filteredTheaters.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-[#151A26] p-12 text-center">
            <h3 className="text-2xl font-bold">No Shows Available</h3>

            <p className="mt-3 text-gray-400">
              No shows are available for the selected date. Try another date.
            </p>
          </div>
        )}

        {/* Bottom Summary */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-3 mt-10 rounded-3xl border border-yellow-400/20 bg-[#111827]/95 p-4 sm:p-6 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500">Theater</p>
                <p className="font-semibold">
                  {selectedTheater?.name || "Select a theater"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold">
                  {selectedTime
                    ? new Date(selectedTime.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : selectedDate?.full || "Select a date"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="font-semibold">
                  {selectedTime?.time || "Select a show"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-semibold">
                  {selectedTime ? `₹${selectedTime.price}` : "--"}
                </p>
              </div>
            </div>

            <button
              onClick={continueBooking}
              disabled={!selectedTheater || !selectedTime}
              className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition sm:w-auto sm:px-8 sm:py-4 sm:text-lg ${
                selectedTheater && selectedTime
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "cursor-not-allowed bg-gray-600 text-gray-400"
              }`}
            >
              <FaTicketAlt />
              Continue to Seat Selection
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TheaterSelection; 