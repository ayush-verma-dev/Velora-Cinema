import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaClock,
  FaPlay,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaFilm,
} from "react-icons/fa";

import API from "../services/api";
import MovieFilters from "../components/MovieFilters";
import TrailerModal from "../components/TrailerModal";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");


function Movies() {
  const navigate = useNavigate();

  const genres = [
  "All",
  "Action",
  "Sci-Fi",
  "Psychological Thriller",
  "Thriller",
  ];

  const languages = ["All", "English", "Hindi", "Kannada"];

  const experiences = [
    "All",
    "2D",
    "3D",
    "IMAX",
    "Dolby Atmos",
  ];

  const [searchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "movies";

  const [featured, setFeatured] = useState(0);

  const [showingTab, setShowingTab] = useState("showing");
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [moviesData, setMoviesData] = useState([]);

  useEffect(() => {
    if (featured >= moviesData.length && moviesData.length > 0) {
      setFeatured(0);
    }
  }, [featured, moviesData.length]);

  const [loading, setLoading] = useState(true);

  const [theaters, setTheaters] = useState([]);
  const [loadingTheaters, setLoadingTheaters] = useState(true);

  const [filters, setFilters] = useState({
    format: "All",
    genre: "All",
    language: "All",
    rating: "All",
  });

  useEffect(() => {
    if (tab !== "movies" || moviesData.length === 0) return;

    const interval = setInterval(() => {
      setFeatured((prev) => (prev + 1) % moviesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tab, moviesData.length]);


  const fetchMovies = useCallback(async () => {
    try {
      const { data } = await API.get("/movies");
      setMoviesData(data.movies || []);
    } catch (error) {
      console.error("Failed to load movies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTheaters = useCallback(async () => {
    try {
      const { data } = await API.get("/theaters");

      if (data.success) {
        setTheaters(data.theaters || []);
      }
    } catch (error) {
      console.error("Failed to load theaters:", error);
    } finally {
      setLoadingTheaters(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    fetchTheaters();
  }, [fetchTheaters]);

  const filteredMovies = useMemo(() => {
    return moviesData.filter((movie) => {
      if (
        filters.format !== "All" &&
        !movie.format?.toLowerCase().includes(filters.format.toLowerCase())
      )
        return false;

      if (
        filters.genre !== "All" &&
        !movie.genre.includes(filters.genre)
      )
        return false;

      if (
        filters.language !== "All" &&
        movie.language !== filters.language
      )
        return false;

      if (
        filters.rating !== "All" &&
        movie.rating < Number(filters.rating)
      )
        return false;

      return true;
    });
  }, [filters, moviesData]);
  if (loading) {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
        <p className="mt-5 text-lg text-gray-400">Loading Movies...</p>
      </div>
    </div>
  );
}

  const comingSoon = moviesData.length
    ? [
        {
          title: "Crimson Rift",
          poster: moviesData[0].poster,
          release: "Coming Oct 12",
        },
        {
          title: "Quantum Drift",
          poster: moviesData[1]?.poster || moviesData[0].poster,
          release: "Coming Nov 05",
        },
        {
          title: "Dark Frequency",
          poster: moviesData[2]?.poster || moviesData[0].poster,
          release: "Coming Dec 01",
        },
      ]
    : [];

  /*const theaters = [
    {
      name: "Velora IMAX Downtown",
      experience: "IMAX Laser",
      distance: "2.4 km",
    },
    {
      name: "Velora Luxe Mall",
      experience: "Luxury Recliners",
      distance: "5.1 km",
    },
    {
      name: "Velora Grand Cinema",
      experience: "Dolby Atmos",
      distance: "7.8 km",
    },
  ];*/

  const experienceCards = [
    {
      title: "IMAX Laser",
      desc: "Crystal-clear visuals on a giant immersive screen.",
    },
    {
      title: "4DX Motion",
      desc: "Moving seats with wind, vibration and water effects.",
    },
    {
      title: "Luxury Recliners",
      desc: "Premium leather recliners with extra legroom.",
    },
  ];

  const offers = [
    {
      title: "HDFC Bank Offer",
      desc: "Flat ₹150 off every weekend.",
    },
    {
      title: "SBI BOGO",
      desc: "Buy One Get One every Friday.",
    },
    {
      title: "Velora Combo",
      desc: "Popcorn + Drink only ₹199.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0B0F19] pt-28 text-white">
      <div className="mx-auto max-w-7xl px-6">

        {/* ================= MOVIES TAB ================= */}

        {tab === "movies" && (
          <>
            {/* Featured Banner */}
            <AnimatePresence mode="wait">
              <motion.div
                key={featured}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.6 }}
                className="relative mt-6 w-full overflow-hidden rounded-[32px] border border-white/10 md:mt-8 md:rounded-[42px]"
              >
                <img
                  src={
                    moviesData[featured]?.poster?.startsWith("http")
                      ? moviesData[featured].poster
                      : `${BACKEND_URL}/${moviesData[featured]?.poster
                          ?.split(/[\\/]/)
                          .pop()}`
                  }
                  alt={moviesData[featured]?.title || "Movie Poster"}
                  className="h-[420px] w-full object-cover sm:h-[420px] md:h-[560px]"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/1200x700/111827/FACC15?text=No+Poster";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#05070F] via-[#05070F]/75 to-transparent" />

                <div className="absolute inset-0 flex items-end px-4 pb-6 pt-6 sm:items-center sm:px-8 md:px-20">
                  <div className="w-full max-w-full sm:max-w-3xl">
                    <span className="inline-flex rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300 sm:px-5 sm:py-2 sm:text-sm">
                      Featured Premiere
                    </span>

                    <h1 className="mt-2 text-[26px] font-bold leading-tight sm:mt-5 sm:text-5xl md:mt-8 md:text-7xl">
                      {moviesData[featured]?.title}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-300 sm:mt-8 sm:gap-4 sm:text-sm">
                      <span className="flex items-center gap-2 text-yellow-400">
                        <FaStar />
                        {moviesData[featured]?.rating}
                      </span>

                      <span className="flex items-center gap-2">
                        <FaClock />
                        {moviesData[featured]?.duration}
                      </span>

                      <span>{moviesData[featured]?.genre}</span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-200 sm:text-lg sm:leading-8">
                      {moviesData[featured]?.description}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-5">
                      <button
                        aria-label={`Watch trailer for ${moviesData[featured]?.title || "movie"}`}
                        onClick={() => {
                          setSelectedMovie(moviesData[featured]);
                          setTrailerOpen(true);
                        }}
                        className="flex items-center gap-2 rounded-full border border-yellow-400 px-5 py-3 text-sm text-yellow-300 transition hover:bg-yellow-400 hover:text-black sm:px-8 sm:py-4 sm:text-lg"
                      >
                        <FaPlay />
                        Watch Trailer
                      </button>

                      <button
                        aria-label={`Book tickets for ${moviesData[featured]?.title || "movie"}`}
                        onClick={() =>
                          navigate(
                            `/movie/${moviesData[featured]?.slug || moviesData[featured]?._id}`
                          )
                        }
                        className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 sm:px-8 sm:py-4 sm:text-lg"
                      >
                        <FaTicketAlt />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Banner Indicators */}

            <div className="mt-6 flex justify-center gap-3">
              {moviesData.map((movie, index) => (
                <button
                  key={movie._id || movie.slug}
                  aria-label={`Show featured movie ${movie.title}`}
                  onClick={() => setFeatured(index)}
                  className={`h-2 rounded-full transition-all ${
                    featured === index
                      ? "w-12 bg-yellow-400"
                      : "w-6 bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* Filters */}

            <MovieFilters
              filters={filters}
              setFilters={setFilters}
            />

            {/* Toggle */}

            <div className="mt-12 flex flex-wrap gap-3">
              <button
                onClick={() => setShowingTab("showing")}
                className={`rounded-full px-8 py-4 ${
                  showingTab === "showing"
                    ? "bg-yellow-400 text-black"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                Now Showing
              </button>

              <button
                onClick={() => setShowingTab("coming")}
                className={`rounded-full px-8 py-4 ${
                  showingTab === "coming"
                    ? "bg-yellow-400 text-black"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                Coming Soon
              </button>
            </div>

            {/* Empty State */}

            {showingTab === "showing" &&
              filteredMovies.length === 0 && (
                <div className="mt-10 rounded-3xl border border-white/10 bg-[#151A26] p-12 text-center">
                  <h2 className="text-2xl font-bold">
                    No Movies Found
                  </h2>

                  <p className="mt-3 text-gray-400">
                    Try changing your filters.
                  </p>

                  <button
                    onClick={() =>
                      setFilters({
                        format: "All",
                        genre: "All",
                        language: "All",
                        rating: "All",
                      })
                    }
                    className="mt-6 rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

            {/* Movie Grid */}

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {(showingTab === "showing"
                ? filteredMovies
                : comingSoon
              ).map((movie, index) => (
                <motion.div
                  key={movie._id || movie.slug || movie.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#151A26]"
                >
                  <img
                    src={`${BACKEND_URL}/${movie.poster
                      ?.split(/[\\/]/)
                      .pop()}`}
                    alt={movie.title}
                    className="h-[300px] w-full object-cover sm:h-[380px] lg:h-[430px]"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/400x600/111827/FACC15?text=No+Poster";
                    }}
                  />

                  <div className="p-6">
                    <h2 className="text-2xl font-bold">
                      {movie.title}
                    </h2>

                    {showingTab === "showing" ? (
                      <>
                        <div className="mt-3 flex items-center gap-2 text-yellow-400">
                          <FaStar />
                          {movie.rating}
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/movie/${movie.slug || movie._id}`)
                          }
                          className="mt-6 w-full rounded-full bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-300"
                        >
                          View Details
                        </button>
                      </>
                    ) : (
                      <p className="mt-4 text-yellow-400">
                        {movie.release}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ================= THEATERS TAB ================= */}

        {tab === "theaters" && (
          <>
            <h1 className="mb-10 scroll-mt-32 text-4xl font-bold md:text-5xl">
              Theaters
            </h1>

            <div className="space-y-6">
              {loadingTheaters ? (
                <div className="py-16 text-center text-gray-400">
                  Loading theaters...
                </div>
              ) : (
                theaters.map((theater, index) => (
                  <motion.div
                    key={theater._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-[#151A26] p-6 md:flex-row md:items-center hover:border-yellow-400/30 transition-all"
                  >
                    {/* Left Side */}
                    <div>
                      <h2 className="text-2xl font-bold">{theater.name}</h2>

                      <div className="mt-3 flex flex-wrap gap-5 text-gray-400">
                        <span className="flex items-center gap-2">
                          <FaFilm className="text-yellow-400" />
                          {theater.experience}
                        </span>

                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-yellow-400" />
                          {theater.location}
                        </span>

                        <span>{theater.city}</span>

                        <span>{theater.screens} Screens</span>
                      </div>
                    </div>

                    {/* Right Side */}
                    <button
                      onClick={() => navigate("/movies?tab=movies")}
                      className="rounded-full bg-yellow-400 px-8 py-3 font-semibold text-black transition hover:bg-yellow-300"
                    >
                      Browse Movies
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}

        {/* ================= EXPERIENCES TAB ================= */}

        {tab === "experiences" && (
          <>
            <h1 className="mb-10 scroll-mt-32 text-4xl font-bold md:text-5xl">
                Premium Experiences
            </h1>

            <div className="grid gap-8 md:grid-cols-3">
              {experienceCards.map((exp, index) => (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-[#151A26] to-[#10141F] p-8"
                >
                  <FaFilm className="text-4xl text-yellow-400" />

                  <h2 className="mt-6 text-2xl font-bold">
                    {exp.title}
                  </h2>

                  <p className="mt-4 text-gray-400">
                    {exp.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ================= OFFERS TAB ================= */}

        {tab === "offers" && (
          <>
            <h1 className="mb-10 scroll-mt-32 text-4xl font-bold md:text-5xl">
                Exclusive Offers
            </h1>

            <div className="grid gap-8 md:grid-cols-3">
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-[#151A26] to-[#10141F] p-8"
                >
                  <FaTicketAlt className="text-4xl text-yellow-400" />

                  <h2 className="mt-6 text-2xl font-bold">
                    {offer.title}
                  </h2>

                  <p className="mt-4 text-gray-400">
                    {offer.desc}
                  </p>

                  <button
                    type="button"
                    onClick={async () => {
                        try {
                        await navigator.clipboard.writeText("VELORA50");
                        alert("🎉 Offer Applied!\nCoupon VELORA50 copied.");
                        } catch {
                        alert("Use coupon code: VELORA50");
                        }
                    }}
                    className="mt-6 rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300 active:scale-95"
                    >
                    Claim Offer
                  </button>

                </motion.div>
              ))}
            </div>
          </>
        )}

      </div>

      <TrailerModal
        movie={selectedMovie}
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
      />
    </div>
  );
}

export default Movies;