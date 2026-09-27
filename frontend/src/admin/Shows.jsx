import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import API from "../services/api";
import AddShowModal from "./AddShowModal";

function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchShows();
  }, []);

  async function fetchShows() {
    try {
      const { data } = await API.get("/shows");
      setShows(data.shows || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleShowAdded(show) {
    setShows((prev) => [show, ...prev]);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Shows</h1>
          <p className="mt-2 text-gray-400">
            Manage movie schedules across theaters.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300"
        >
          <FaPlus />
          Add Show
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-[#151A26] p-10 text-center">
          Loading Shows...
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#151A26]">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-[#111827]">
              <tr className="text-left text-gray-400">
                <th className="p-5">Movie</th>
                <th className="p-5">Theater</th>
                <th className="p-5">Screen</th>
                <th className="p-5">Date</th>
                <th className="p-5">Time</th>
                <th className="p-5">Price</th>
                <th className="p-5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {shows.map((show) => (
                <tr
                  key={show._id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-5 font-semibold">
                    {show.movie?.title}
                  </td>

                  <td className="p-5">
                    {show.theater?.name}
                  </td>

                  <td className="p-5">{show.screen}</td>

                  <td className="p-5">{show.date}</td>

                  <td className="p-5">{show.time}</td>

                  <td className="p-5">₹{show.price}</td>

                  <td className="p-5">
                    <div className="flex gap-3">
                      <button className="rounded-lg bg-blue-500/20 p-3 text-blue-400 hover:bg-blue-500/30">
                        <FaEdit />
                      </button>

                      <button className="rounded-lg bg-red-500/20 p-3 text-red-400 hover:bg-red-500/30">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {shows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-gray-500"
                  >
                    No shows scheduled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddShowModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onShowAdded={handleShowAdded}
      />
    </div>
  );
}

export default Shows;