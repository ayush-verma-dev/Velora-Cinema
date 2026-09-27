import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import API from "../services/api";

function AddTheaterModal({
  open,
  onClose,
  editTheater,
  onTheaterAdded,
  onTheaterUpdated,
}) {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    location: "",
    experience: "Standard",
    screens: 1,
  });

  useEffect(() => {
    if (editTheater) {
      setFormData({
        name: editTheater.name || "",
        city: editTheater.city || "",
        location: editTheater.location || "",
        experience: editTheater.experience || "Standard",
        screens: editTheater.screens || 1,
      });
    } else {
      setFormData({
        name: "",
        city: "",
        location: "",
        experience: "Standard",
        screens: 1,
      });
    }
  }, [editTheater, open]);

  if (!open) return null;

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "screens"
          ? Number(e.target.value)
          : e.target.value,
    });
  }

  async function handleSubmit() {
    if (!formData.name || !formData.city || !formData.location) {
      return alert("Name, City and Location are required.");
    }

    try {
      if (editTheater) {
        const { data } = await API.put(
          `/theaters/${editTheater._id}`,
          formData
        );

        onTheaterUpdated(data.theater);
      } else {
        const { data } = await API.post("/theaters", formData);

        onTheaterAdded(data.theater);
      }

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          (editTheater
            ? "Failed to update theater."
            : "Failed to create theater.")
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-yellow-400/20 bg-[#151A26] p-8 shadow-[0_0_50px_rgba(250,204,21,.08)]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {editTheater ? "Edit Theater" : "Add Theater"}
            </h2>

            <p className="mt-1 text-gray-400">
              {editTheater
                ? "Update theater details."
                : "Create a new cinema location."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-3 text-gray-400 transition hover:bg-red-500/20 hover:text-red-400"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            name="name"
            label="Theater Name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
          />

          <Input
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block font-semibold text-white">
              Experience
            </label>

            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white"
            >
              <option>Standard</option>
              <option>IMAX</option>
              <option>4DX</option>
              <option>VIP</option>
            </select>
          </div>

          <Input
            name="screens"
            label="Number of Screens"
            inputType="number"
            value={formData.screens}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
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
            {editTheater ? "Update Theater" : "Save Theater"}
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
        className="w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-white outline-none focus:border-yellow-400"
      />
    </div>
  );
}

export default AddTheaterModal;