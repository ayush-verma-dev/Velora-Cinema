import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaTicketAlt,
  FaHeart,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProfileDropdown({ open, onClose, user, onLogout }) {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    {
      icon: FaUser,
      label: "Profile",
      action: () => alert("Profile Page (Coming Soon)"),
    },
    {
      icon: FaTicketAlt,
      label: "My Tickets",
      action: () => navigate("/my-tickets"),
    },
    {
      icon: FaHeart,
      label: "Favorites",
      action: () => alert("Favorites Coming Soon"),
    },
    {
      icon: FaCog,
      label: "Settings",
      action: () => alert("Settings Coming Soon"),
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-16 z-[9999] w-72 overflow-hidden rounded-3xl border border-yellow-400/20 bg-[#111827] shadow-[0_0_40px_rgba(250,204,21,.12)]"
        >
          {/* Header */}

          <div className="border-b border-white/10 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-xl font-bold text-black">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  {user?.name || "Velora User"}
                </h3>

                <p className="text-sm text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}

          <div className="p-2">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                <item.icon className="text-yellow-400" />

                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="mt-2 flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left text-red-400 transition hover:bg-red-500/10"
            >
              <FaSignOutAlt />

              Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProfileDropdown;