import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaFilm,
  FaBuilding,
  FaTicketAlt,
  FaHome,
  FaSignOutAlt,
  FaClock,
} from "react-icons/fa";

function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaChartPie />,
      end: true,
    },
    {
      name: "Movies",
      path: "/admin/movies",
      icon: <FaFilm />,
    },
    {
      name: "Theaters",
      path: "/admin/theaters",
      icon: <FaBuilding />,
    },
    {
      name: "Shows",
      path: "/admin/shows",
      icon: <FaClock />,
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: <FaTicketAlt />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-white/10 bg-[#111827]">
          {/* Logo */}
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.35)]">
                <FaTicketAlt className="text-3xl text-black" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-yellow-400">
                  Velora Cinema
                </h1>

                <p className="text-sm tracking-[0.3em] text-gray-400">
                  LUXURY IMAX
                </p>

                <p className="mt-1 text-xs font-medium tracking-[0.25em] text-yellow-300">
                  ADMIN PANEL
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-5">
            <div className="space-y-2">
              {menu.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-medium transition ${
                      isActive
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/10"
                        : "text-gray-300 hover:bg-white/5 hover:text-yellow-300"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Bottom */}
          <div className="space-y-3 border-t border-white/10 p-5">
            <button
              onClick={() => navigate("/")}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-4 py-3 transition hover:border-yellow-400 hover:text-yellow-300"
            >
              <FaHome />
              Back Home
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-red-500 px-4 py-3 transition hover:bg-red-600"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111827]/95 px-8 py-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome back, {user?.name || "Admin"} 👋
                </h2>
                <p className="mt-1 text-gray-400">
                  Manage Velora Cinema from one place.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-full border border-yellow-400/30 bg-[#151A26] px-5 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 font-bold text-black">
                  {user?.name?.charAt(0) || "A"}
                </div>

                <div className="hidden md:block">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-400">
                    {user?.role?.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;