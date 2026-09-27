import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
//import { movies } from "../data/movies";
import API from "../services/api";

function SearchModal({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch movies from backend whenever search opens
  useEffect(() => {
    if (!open) return;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/movies");
        setMoviesData(data.movies || []);
      } catch (error) {
        console.error("Failed to load movies:", error);
        setMoviesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [open]);

  // Close with Escape
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
        if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        }
    };

    document.addEventListener("keydown", handleEscape, true);

    return () => {
        document.removeEventListener("keydown", handleEscape, true);
    };
  }, [open, onClose]);

  // Clear search whenever modal closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedGenre("All");
      setSelectedLanguage("All");
      setSelectedExperience("All");
    }
  }, [open]);

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

  // Advanced filtering
  const filteredMovies = useMemo(() => {
    return (moviesData || []).filter((movie) => {
      const titleMatch = movie.title
        .toLowerCase()
        .includes(query.toLowerCase());

      const genreMatch =
        selectedGenre === "All" ||
        movie.genre?.includes(selectedGenre);

      const languageMatch =
        selectedLanguage === "All" ||
        movie.language === selectedLanguage;

      const format = (movie.format || "").toLowerCase();

      const experienceMatch =
        selectedExperience === "All" ||
        format.includes(selectedExperience.toLowerCase());

      return (
        titleMatch &&
        genreMatch &&
        languageMatch &&
        experienceMatch
      );
    });
  }, [
    moviesData,
    query,
    selectedGenre,
    selectedLanguage,
    selectedExperience,
  ]);

  const openMovie = (slug) => {
    onClose();
    navigate(`/movie/${slug}`);
  };

  const browseAllMovies = () => {
    onClose();
    navigate("/movies");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -35 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-24 z-[100] w-[94%] max-w-2xl -translate-x-1/2 rounded-3xl border border-yellow-400/20 bg-[#111827] p-6 shadow-[0_0_40px_rgba(250,204,21,.12)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-yellow-300">
                Search Movies
              </h2>

              <button
                type="button"
                aria-label="Close Search"
                onClick={onClose}
                className="rounded-full bg-[#1A2235] p-3 text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
              >
                <FaTimes />
              </button>
            </div>

            {/* Search Box */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B0F19] px-4 py-3">
              <FaSearch className="text-yellow-400" />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                    e.preventDefault();
                    onClose();
                    }
                }}
                placeholder="Search for movies..."
                className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none"
              />
            </div>

            {/* Advanced Filters */}

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {/* Genre */}
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="rounded-xl border border-yellow-400/20 bg-[#0B0F19] p-3 text-white outline-none focus:border-yellow-400"
              >
                {genres.map((genre) => (
                  <option key={genre}>{genre}</option>
                ))}
              </select>

              {/* Language */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="rounded-xl border border-yellow-400/20 bg-[#0B0F19] p-3 text-white outline-none focus:border-yellow-400"
              >
                {languages.map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>

              {/* Experience */}
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="rounded-xl border border-yellow-400/20 bg-[#0B0F19] p-3 text-white outline-none focus:border-yellow-400"
              >
                {experiences.map((experience) => (
                  <option key={experience}>{experience}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {filteredMovies.length} movie
                {filteredMovies.length !== 1 ? "s" : ""} found
              </p>

              <button
                onClick={() => {
                  setQuery("");
                  setSelectedGenre("All");
                  setSelectedLanguage("All");
                  setSelectedExperience("All");
                }}
                className="rounded-full border border-yellow-400 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
              >
                Clear Filters
              </button>
            </div>

            {/* Keyboard Hint */}
            <p className="mt-3 text-xs text-gray-500">
              Press Esc to close • Ctrl + K to reopen
            </p>

            {/* Results */}

            {loading && (
              <div className="py-10 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
                <p className="mt-3 text-gray-400">Loading movies...</p>
              </div>
            )}

            <div className="mt-6 max-h-[360px] space-y-3 overflow-y-auto">
              {!loading && filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <button
                    key={movie._id || movie.id || movie.slug}
                    type="button"
                    onClick={() => openMovie(movie.slug)}
                    className="flex w-full items-center gap-4 rounded-xl p-3 transition hover:bg-white/5"
                  >
                    <img
                      src={
                        movie.poster
                          ? `http://localhost:5000/${movie.poster}`
                          : "https://placehold.co/140x200/111827/FACC15?text=No+Poster"
                      }
                      alt={movie.title}
                      className="h-16 w-12 rounded-lg object-cover"
                    />

                    <div className="text-left">
                      <h3 className="font-semibold">{movie.title}</h3>

                      <p className="text-sm text-gray-400">
                        {movie.genre} • {movie.language} • {movie.duration}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-500">No movies found.</p>

                  <button
                    type="button"
                    onClick={browseAllMovies}
                    className="mt-4 rounded-full border border-yellow-400/30 px-5 py-2 text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
                  >
                    Browse All Movies
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full border border-white/10 py-3 text-gray-300 transition hover:border-yellow-400 hover:text-yellow-300"
            >
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;