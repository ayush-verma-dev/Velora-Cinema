import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import API from "../services/api";

function AddShowModal({ open, onClose, onShowAdded }) {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);

  const [formData, setFormData] = useState({
    movie: "",
    theater: "",
    screen: "Screen 1",
    date: "",
    time: "",
    price: 250,
  });

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  async function fetchData() {
    try {
      const [moviesRes, theatersRes] = await Promise.all([
        API.get("/movies"),
        API.get("/theaters"),
      ]);

      setMovies(moviesRes.data.movies || []);
      setTheaters(theatersRes.data.theaters || []);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit() {
    if (!formData.movie || !formData.theater || !formData.date || !formData.time) {
      return alert("Please fill all required fields.");
    }

    try {
      const { data } = await API.post("/shows", formData);

      onShowAdded(data.show);

      setFormData({
        movie: "",
        theater: "",
        screen: "Screen 1",
        date: "",
        time: "",
        price: 250,
      });

      onClose();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to create show.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-yellow-400/20 bg-[#151A26] p-8 shadow-[0_0_50px_rgba(250,204,21,.08)]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Schedule New Show
            </h2>
            <p className="mt-1 text-gray-400">
              Create a movie show for a theater.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-3 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold text-white">
              Movie
            </label>

            <select
              name="movie"
              value={formData.movie}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white"
            >
              <option value="">Select Movie</option>

              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-white">
              Theater
            </label>

            <select
              name="theater"
              value={formData.theater}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white"
            >
              <option value="">Select Theater</option>

              {theaters.map((theater) => (
                <option key={theater._id} value={theater._id}>
                  {theater.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-white">
              Screen
            </label>

            <select
              name="screen"
              value={formData.screen}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white"
            >
              <option>Screen 1</option>
              <option>Screen 2</option>
              <option>Screen 3</option>
              <option>IMAX</option>
              <option>VIP</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-white">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white"
              style={{ colorScheme: "dark" }}
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-white">
              Time
            </label>

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white"
              style={{ colorScheme: "dark" }}
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-white">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-6 py-3 text-gray-300 hover:border-red-400 hover:text-red-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-yellow-400 px-8 py-3 font-semibold text-black hover:bg-yellow-300"
          >
            Create Show
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddShowModal;