import { FaTrash, FaTimes } from "react-icons/fa";

function DeleteMovieModal({
  open,
  movie,
  onClose,
  onConfirm,
  loading,
}) {
  if (!open || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#151A26] p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Delete Movie</h2>

          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-gray-400 hover:text-red-400"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-5 text-3xl text-red-400">
            <FaTrash />
          </div>
        </div>

        <p className="text-center text-gray-300">
          Are you sure you want to delete
        </p>

        <h3 className="mt-2 text-center text-xl font-bold text-yellow-400">
          {movie.title}
        </h3>

        <p className="mt-4 text-center text-sm text-gray-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-3 text-gray-300 hover:border-white/30"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMovieModal;