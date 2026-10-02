import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import API from "../services/api";
import AddMovieModal from "./AddMovieModal";
import DeleteMovieModal from "./DeleteMovieModal";

const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMovie, setEditMovie] = useState(null);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      const { data } = await API.get("/movies");
      setMovies(data.movies || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // POSTER URL
  // =========================
  function getPosterUrl(poster) {
    if (!poster) {
      return "https://placehold.co/140x200/111827/FACC15?text=No+Poster";
    }

    // If backend/database already gives a complete URL
    if (
      poster.startsWith("http://") ||
      poster.startsWith("https://")
    ) {
      return poster;
    }

    // Convert Windows path to normal URL path
    const fileName = poster
      .replace(/\\/g, "/")
      .split("/")
      .pop();

    return `${BACKEND_URL}/${fileName}`;
  }

  // =========================
  // ADD MOVIE
  // =========================
  function handleMovieAdded(newMovie) {
    setMovies((prev) => [newMovie, ...prev]);
  }

  // =========================
  // EDIT MOVIE
  // =========================
  function openEditModal(movie) {
    setEditMovie(movie);
    setShowAddModal(true);
  }

  function handleMovieUpdated(updatedMovie) {
    setMovies((prev) =>
      prev.map((movie) =>
        movie._id === updatedMovie._id ? updatedMovie : movie
      )
    );

    setEditMovie(null);
    setShowAddModal(false);
  }

  // =========================
  // DELETE MOVIE
  // =========================
  function openDeleteModal(movie) {
    setSelectedMovie(movie);
    setShowDeleteModal(true);
  }

  async function handleDeleteMovie() {
    if (!selectedMovie) return;

    try {
      setDeleteLoading(true);

      await API.delete(`/movies/${selectedMovie._id}`);

      setMovies((prev) =>
        prev.filter((movie) => movie._id !== selectedMovie._id)
      );

      setShowDeleteModal(false);
      setSelectedMovie(null);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to delete movie."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Movies</h1>

          <p className="mt-2 text-gray-400">
            Manage all movies available in Velora Cinema.
          </p>
        </div>

        <button
          onClick={() => {
            setEditMovie(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300"
        >
          <FaPlus />
          Add Movie
        </button>
      </div>

      {/* Movie Table */}
      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-[#151A26] p-12 text-center">
          Loading Movies...
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#151A26]">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-[#111827]">
              <tr className="text-left text-gray-400">
                <th className="p-5">Poster</th>
                <th className="p-5">Title</th>
                <th className="p-5">Genre</th>
                <th className="p-5">Language</th>
                <th className="p-5">Duration</th>
                <th className="p-5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {movies.map((movie) => (
                <tr
                  key={movie._id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  {/* Poster */}
                  <td className="p-4">
                    <img
                      src={getPosterUrl(movie.poster)}
                      alt={movie.title || "Movie Poster"}
                      className="h-20 w-14 rounded-lg object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/140x200/111827/FACC15?text=No+Poster";
                      }}
                    />
                  </td>

                  {/* Title */}
                  <td className="p-4 font-semibold">
                    {movie.title}
                  </td>

                  {/* Genre */}
                  <td className="p-4 text-gray-300">
                    {movie.genre}
                  </td>

                  {/* Language */}
                  <td className="p-4 text-gray-300">
                    {movie.language}
                  </td>

                  {/* Duration */}
                  <td className="p-4 text-gray-300">
                    {movie.duration}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex gap-3">
                      {/* Edit */}
                      <button
                        onClick={() => openEditModal(movie)}
                        className="rounded-lg bg-blue-500/20 p-3 text-blue-400 transition hover:bg-blue-500/30"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => openDeleteModal(movie)}
                        className="rounded-lg bg-red-500/20 p-3 text-red-400 transition hover:bg-red-500/30"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {movies.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500"
                  >
                    No movies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddMovieModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditMovie(null);
        }}
        onMovieAdded={handleMovieAdded}
        editMovie={editMovie}
        onMovieUpdated={handleMovieUpdated}
      />

      {/* Delete Modal */}
      <DeleteMovieModal
        open={showDeleteModal}
        movie={selectedMovie}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMovie(null);
        }}
        onConfirm={handleDeleteMovie}
        loading={deleteLoading}
      />
    </div>
  );
}

export default Movies;