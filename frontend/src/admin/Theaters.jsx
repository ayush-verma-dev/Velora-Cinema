import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import API from "../services/api";
import AddTheaterModal from "./AddTheaterModal";
import DeleteTheaterModal from "./DeleteTheaterModal";

function Theaters() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTheater, setEditTheater] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchTheaters();
  }, []);

  async function fetchTheaters() {
    try {
      const { data } = await API.get("/theaters");
      setTheaters(data.theaters || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleTheaterAdded(theater) {
    setTheaters((prev) => [theater, ...prev]);
  }

  function handleTheaterUpdated(updated) {
    setTheaters((prev) =>
      prev.map((theater) =>
        theater._id === updated._id ? updated : theater
      )
    );

    setEditTheater(null);
    setShowAddModal(false);
  }

  function openDeleteModal(theater) {
    setSelectedTheater(theater);
    setShowDeleteModal(true);
  }

  async function handleDelete() {
    try {
      setDeleteLoading(true);

      await API.delete(`/theaters/${selectedTheater._id}`);

      setTheaters((prev) =>
        prev.filter((t) => t._id !== selectedTheater._id)
      );

      setShowDeleteModal(false);
      setSelectedTheater(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Theaters</h1>
          <p className="mt-2 text-gray-400">
            Manage cinema locations.
          </p>
        </div>

        <button
          onClick={() => {
            setEditTheater(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300"
        >
          <FaPlus />
          Add Theater
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-[#151A26] p-12 text-center">
          Loading...
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#151A26]">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-[#111827]">
              <tr className="text-left text-gray-400">
                <th className="p-5">Name</th>
                <th className="p-5">City</th>
                <th className="p-5">Location</th>
                <th className="p-5">Experience</th>
                <th className="p-5">Screens</th>
                <th className="p-5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {theaters.map((theater) => (
                <tr
                  key={theater._id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4 font-semibold">
                    {theater.name}
                  </td>

                  <td className="p-4">{theater.city}</td>

                  <td className="p-4">{theater.location}</td>

                  <td className="p-4">{theater.experience}</td>

                  <td className="p-4">{theater.screens}</td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditTheater(theater);
                          setShowAddModal(true);
                        }}
                        className="rounded-lg bg-blue-500/20 p-3 text-blue-400 hover:bg-blue-500/30"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => openDeleteModal(theater)}
                        className="rounded-lg bg-red-500/20 p-3 text-red-400 hover:bg-red-500/30"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {theaters.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500"
                  >
                    No theaters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddTheaterModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditTheater(null);
        }}
        editTheater={editTheater}
        onTheaterAdded={handleTheaterAdded}
        onTheaterUpdated={handleTheaterUpdated}
      />

      <DeleteTheaterModal
        open={showDeleteModal}
        theater={selectedTheater}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTheater(null);
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

export default Theaters;