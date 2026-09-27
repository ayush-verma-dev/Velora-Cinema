import { FaFilter, FaTimes } from "react-icons/fa";

function MovieFilters({ filters, setFilters }) {
  const toggle = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "All" : value,
    }));
  };

  const clearAll = () => {
    setFilters({
      format: "All",
      genre: "All",
      language: "All",
      rating: "All",
    });
  };

  const Chip = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition ${
        active
          ? "bg-yellow-400 text-black"
          : "border border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400 hover:text-yellow-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-12 rounded-3xl border border-white/10 bg-[#151A26] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaFilter className="text-yellow-400" />
          <h3 className="text-xl font-bold">Filter Movies</h3>
        </div>

        <button
          onClick={clearAll}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-300"
        >
          <FaTimes />
          Clear
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-sm text-gray-400">Format</p>

          <div className="flex flex-wrap gap-3">
            <Chip
              label="IMAX"
              active={filters.format === "IMAX"}
              onClick={() => toggle("format", "IMAX")}
            />

            <Chip
              label="Dolby Atmos"
              active={filters.format === "Dolby Atmos"}
              onClick={() => toggle("format", "Dolby Atmos")}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm text-gray-400">Genre</p>

          <div className="flex flex-wrap gap-3">
            <Chip
              label="Action"
              active={filters.genre === "Action"}
              onClick={() => toggle("genre", "Action")}
            />

            <Chip
              label="Sci-Fi"
              active={filters.genre === "Sci-Fi"}
              onClick={() => toggle("genre", "Sci-Fi")}
            />

            <Chip
              label="Thriller"
              active={filters.genre === "Thriller"}
              onClick={() => toggle("genre", "Thriller")}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm text-gray-400">Language</p>

          <div className="flex flex-wrap gap-3">
            <Chip
              label="English"
              active={filters.language === "English"}
              onClick={() => toggle("language", "English")}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm text-gray-400">Minimum Rating</p>

          <div className="flex flex-wrap gap-3">
            <Chip
              label="8+"
              active={filters.rating === "8"}
              onClick={() => toggle("rating", "8")}
            />

            <Chip
              label="9+"
              active={filters.rating === "9"}
              onClick={() => toggle("rating", "9")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieFilters;