import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import API from "../services/api";

function AddMovieModal({
  open,
  onClose,
  onMovieAdded,
  editMovie,
  onMovieUpdated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    language: "",
    duration: "",
    rating: "",
    trailer: "",
    description: "",
    poster: "",
    cast: "",
    highlights: "",
    gallery: "",
    showtimes: "",
  });

  const [posters, setPosters] = useState([]);

  // Load posters from backend
  useEffect(() => {
    async function loadPosters() {
      try {
        const { data } = await API.get("/movies/posters");
        setPosters(data);
      } catch (err) {
        console.error("Failed to load posters:", err);
      }
    }

    if (open) loadPosters();
  }, [open]);

  // Fill form while editing
  useEffect(() => {
    if (editMovie) {
      setFormData({
        title: editMovie.title || "",
        genre: editMovie.genre || "",
        language: editMovie.language || "",
        duration: editMovie.duration || "",
        rating: editMovie.rating || "",
        trailer: editMovie.trailer || "",
        description: editMovie.description || "",
        poster: editMovie.poster
          ? editMovie.poster.split(/[\\/]/).pop()
          : "",

        cast: (editMovie.cast || []).join(", "),
        highlights: (editMovie.highlights || []).join(", "),
        gallery: (editMovie.gallery || []).join(", "),
        showtimes: (editMovie.showtimes || []).join(", "),
      });
    } else {
      setFormData({
        title: "",
        genre: "",
        language: "",
        duration: "",
        rating: "",
        trailer: "",
        description: "",
        poster: "",
        cast: "",
        highlights: "",
        gallery: "",
        showtimes: "",
      });
    }
  }, [editMovie, open]);

  if (!open) return null;

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit() {
    if (!formData.title || !formData.poster) {
      return alert("Title and Poster are required.");
    }

    try {
      if (editMovie) {
        const { data } = await API.put(
          `/movies/${editMovie._id}`,
          formData
        );

        onMovieUpdated(data.movie);
      } else {
        const { data } = await API.post("/movies", formData);

        onMovieAdded(data.movie);
      }

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          (editMovie
            ? "Failed to update movie."
            : "Failed to create movie.")
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-yellow-400/20 bg-[#151A26] p-8 shadow-[0_0_50px_rgba(250,204,21,.08)]">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {editMovie ? "Edit Movie" : "Add New Movie"}
            </h2>

            <p className="mt-1 text-gray-400">
              {editMovie
                ? "Update movie details."
                : "Upload a movie to Velora Cinema."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-3 text-gray-400 transition hover:bg-red-500/20 hover:text-red-400"
          >
            <FaTimes />
          </button>
        </div>

        {/* Poster */}
        <div className="mb-8">
          <label className="mb-3 block font-semibold text-white">
            Movie Poster
          </label>

          <select
            name="poster"
            value={formData.poster}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white outline-none transition focus:border-yellow-400"
          >
            <option value="">Select Poster</option>

            {posters.map((poster) => (
              <option key={poster} value={poster}>
                {poster
                  .replace(/\.(png|jpg|jpeg|webp)$/i, "")
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>

          {formData.poster && (
            <img
              src={`http://localhost:5000/${formData.poster}`}
              alt="Poster Preview"
              className="mt-4 h-64 rounded-xl border border-white/10 object-cover shadow-lg"
            />
          )}
        </div>

        {/* Basic Form */}
        <div className="grid gap-5 md:grid-cols-2">

          <Input
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
          />

          <Input
            name="genre"
            label="Genre"
            value={formData.genre}
            onChange={handleChange}
          />

          <Input
            name="language"
            label="Language"
            value={formData.language}
            onChange={handleChange}
          />

          <Input
            name="duration"
            label="Duration"
            value={formData.duration}
            onChange={handleChange}
          />

          <Input
            name="rating"
            label="Rating"
            value={formData.rating}
            onChange={handleChange}
          />

          <Input
            name="trailer"
            label="Trailer URL"
            value={formData.trailer}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="mt-5">
          <label className="mb-2 block font-semibold text-white">
            Description
          </label>

          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-[#111827] p-4 text-white outline-none transition focus:border-yellow-400"
          />
        </div>

        {/* Advanced Movie Details */}
        <div className="mt-6 space-y-5">

          <div>
            <label className="mb-2 block font-semibold text-white">
              Cast
            </label>

            <input
              name="cast"
              value={formData.cast}
              onChange={handleChange}
              placeholder="Brad Pitt, Edward Norton, Helena Bonham Carter"
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white outline-none transition focus:border-yellow-400"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate actor names with commas.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-white">
              Highlights
            </label>

            <input
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
              placeholder="IMAX, Dolby Atmos, Oscar Winner"
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white outline-none transition focus:border-yellow-400"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate highlights with commas.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-white">
              Gallery Images
            </label>

            <input
              name="gallery"
              value={formData.gallery}
              onChange={handleChange}
              placeholder="FightClub.png, FightClub.png, FightClub.png"
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white outline-none transition focus:border-yellow-400"
            />

            <p className="mt-1 text-sm text-gray-500">
              Enter image filenames from the backend/public folder.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-white">
              Showtimes
            </label>

            <input
              name="showtimes"
              value={formData.showtimes}
              onChange={handleChange}
              placeholder="9:30 AM, 12:30 PM, 4:00 PM, 9:00 PM"
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white outline-none transition focus:border-yellow-400"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate showtimes with commas.
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-6 py-3 text-gray-300 transition hover:border-red-400 hover:text-red-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-yellow-400 px-8 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            {editMovie ? "Update Movie" : "Save Movie"}
          </button>
        </div>

      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-white">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white outline-none transition focus:border-yellow-400"
      />
    </div>
  );
}

export default AddMovieModal;