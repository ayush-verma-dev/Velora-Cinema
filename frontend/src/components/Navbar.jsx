import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaFilm,
  FaUser,
  FaTicketAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import SearchModal from "./SearchModal";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab =
    new URLSearchParams(location.search).get("tab") || "movies";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movies?tab=movies" },
    { label: "Theaters", path: "/movies?tab=theaters" },
    { label: "Experiences", path: "/movies?tab=experiences" },
    { label: "Offers", path: "/movies?tab=offers" },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
        setLoginOpen(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = async () => {
    try {
      setLoading(true);
      setError("");

      // Validation for signup
      if (!isLogin) {
        if (!name.trim()) {
          setError("Name is required.");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
      }

      let loginData;

      if (isLogin) {
        // =========================
        // LOGIN
        // =========================
        const response = await API.post("/auth/login", {
          email,
          password,
        });

        loginData = response.data;

        if (!loginData.success || !loginData.token) {
          throw new Error(
            loginData.message || "Login failed."
          );
        }
      } else {
        // =========================
        // REGISTER
        // =========================
        const registerResponse = await API.post(
          "/auth/register",
          {
            name,
            email,
            password,
          }
        );

        const registerData = registerResponse.data;

        console.log("REGISTER RESPONSE:", registerData);

        if (!registerData.success) {
          throw new Error(
            registerData.message || "Registration failed."
          );
        }

        // =========================
        // LOGIN AFTER REGISTER
        // =========================
        const loginResponse = await API.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

        loginData = loginResponse.data;

        console.log("LOGIN AFTER REGISTER:", loginData);

        if (!loginData.success || !loginData.token) {
          throw new Error(
            loginData.message || "Automatic login failed."
          );
        }
      }

      // =========================
      // STORE REAL JWT
      // =========================
      localStorage.setItem("token", loginData.token);

      localStorage.setItem(
        "user",
        JSON.stringify(loginData.user)
      );

      setUser(loginData.user);

      // Close modal
      setLoginOpen(false);

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/");
    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setProfileOpen(false);

    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <header
        className={`relative z-[100] w-full px-3 py-3 transition-all duration-300 ${
          loginOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full border border-yellow-400/20 bg-[#0B0F19]/95 px-4 py-3 backdrop-blur-xl">

          {/* Logo */}
          <button
            aria-label="Go Home"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black shadow-[0_0_25px_rgba(250,204,21,.45)]">
              <FaFilm size={24} />
            </div>

            <div className="hidden text-left sm:block">
              <h1 className="text-xl font-bold text-yellow-300">
                Velora Cinema
              </h1>
              <p className="text-xs tracking-[0.35em] text-gray-400">
                LUXURY IMAX
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname === "/movies" &&
                    currentTab === item.path.split("=")[1];

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={`relative pb-2 font-semibold transition ${
                    isActive
                      ? "text-yellow-300"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                >
                  <>
                    {item.label}

                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-yellow-400"
                      />
                    )}
                  </>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <button
              type="button"
              aria-label="Open Search"
              onClick={() => setSearchOpen(true)}
              className="hidden min-w-[180px] items-center justify-between rounded-full border border-white/10 bg-[#151A26] px-4 py-3 text-gray-300 transition hover:border-yellow-400 hover:text-yellow-300 md:flex"
            >
              <span className="flex items-center gap-2">
                <FaSearch />
                Search
              </span>

              <span className="rounded bg-white/10 px-2 py-1 text-xs">
                Ctrl K
              </span>
            </button>

            {/* Login */}
            {user ? (
              <>
                {/* Desktop Admin Button */}
                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="hidden lg:flex items-center gap-2 rounded-full border border-yellow-400/40 bg-[#151A26] px-4 py-3 text-yellow-300 transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.35)]"
                  >
                    <FaFilm className="text-xl" />
                    <span className="text-lg font-bold">Admin Panel</span>
                  </button>
                )}

                <>
                  {/* Profile Button */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 rounded-full border border-yellow-400/40 bg-[#151A26] px-6 py-3 text-yellow-300 transition-all duration-300 hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.35)]"
                    >
                      <FaUser className="text-xl" />
                      <span className="text-lg font-bold">{user.name}</span>
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-yellow-400/20 bg-[#0E1525] p-3 shadow-2xl backdrop-blur-xl"
                        >
                          {/* User Info */}
                          <div className="mb-3 rounded-xl bg-[#151A26] p-4">
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>

                          {/* My Tickets */}
                          <button
                            onClick={() => {
                              setProfileOpen(false);
                              navigate("/my-tickets");
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white transition hover:bg-[#151A26]"
                          >
                            <FaTicketAlt />
                            My Tickets
                          </button>

                          {/* Admin Panel */}
                          {user.role === "admin" && (
                            <button
                              onClick={() => {
                                setProfileOpen(false);
                                navigate("/admin");
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-yellow-300 transition hover:bg-[#151A26]"
                            >
                              <FaFilm />
                              Admin Panel
                            </button>
                          )}

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-400 transition hover:bg-[#151A26]"
                          >
                            <FaSignOutAlt />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              </>
            ) : (
              <button
                aria-label="Login"
                onClick={() => {
                  setError("");
                  setEmail("");
                  setPassword("");
                  setLoginOpen(true);
                }}
                className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
              >
                Login
              </button>
            )}

            {/* Mobile Menu */}
            <button
              aria-label="Open Menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-full p-2 text-yellow-300 transition hover:bg-white/10 lg:hidden"
            >
              <FaBars size={24} />
            </button>

          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Login Modal */}
      <AnimatePresence>
        {loginOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setLoginOpen(false);
                setEmail("");
                setPassword("");
                setError("");
                setLoading(false);
              }}
              className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-3xl border border-yellow-400/20 bg-[#111827] p-8 max-h-[90vh] overflow-y-auto">

                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black">
                    <FaUser size={26} />
                  </div>

                  <div className="mt-6 flex rounded-full bg-[#1A2233] p-1">
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setError("");
                      }}
                      className={`flex-1 rounded-full py-2 ${
                        isLogin
                          ? "bg-yellow-400 text-black"
                          : "text-gray-400"
                      }`}
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setError("");
                      }}
                      className={`flex-1 rounded-full py-2 ${
                        !isLogin
                          ? "bg-yellow-400 text-black"
                          : "text-gray-400"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold">
                    {isLogin ? "Login" : "Create Account"}
                  </h2>

                  <p className="mt-2 text-gray-400">
                    {isLogin
                      ? "Welcome back to Velora Cinema"
                      : "Create your Velora account"}
                  </p>
                </div>

                <div className="mt-8 space-y-4">

                  {!isLogin && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#1A2233] px-4 py-3 text-white outline-none focus:border-yellow-400"
                    />
                  )}

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A2233] px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#1A2233] px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />

                  {!isLogin && (
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#1A2233] px-4 py-3 text-white outline-none focus:border-yellow-400"
                    />
                  )}

                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}
                </div>

                <button
                  onClick={handleAuth}
                  disabled={loading}
                  className="mt-8 w-full rounded-full bg-yellow-400 py-4 font-semibold text-black hover:bg-yellow-300 disabled:opacity-60"
                >
                  {loading
                    ? "Please wait..."
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                </button>

                <button
                  onClick={() => {
                    setLoginOpen(false);
                    setEmail("");
                    setPassword("");
                    setError("");
                    setLoading(false);
                  }}
                  className="mt-3 w-full rounded-full border border-yellow-400/20 py-4 hover:border-yellow-400"
                >
                  Close
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24 }}
              className="fixed right-0 top-0 z-[70] h-screen w-80 border-l border-yellow-400/20 bg-[#0B0F19] p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-yellow-300">
                  Velora
                </h2>

                <button
                  aria-label="Close Menu"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-[#151A26] p-3 text-yellow-300 transition hover:bg-yellow-400 hover:text-black"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Mobile Search */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setTimeout(() => setSearchOpen(true), 250);
                }}
                className="mt-8 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-yellow-400"
              >
                <FaSearch />
                Search Movies
              </button>

              {/* Mobile Navigation */}
              <div className="mt-8 flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="rounded-xl px-4 py-3 text-left text-lg text-gray-300 transition hover:bg-[#151A26] hover:text-yellow-300"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="mt-10 border-t border-white/10 pt-6">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/my-tickets");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-[#151A26]"
                    >
                      <FaTicketAlt />
                      My Tickets
                    </button>

                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          navigate("/admin");
                        }}
                        className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-yellow-300 transition hover:bg-[#151A26]"
                      >
                        <FaFilm />
                        Admin Panel
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-[#151A26]"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setError("");
                      setEmail("");
                      setPassword("");
                      setLoginOpen(true);
                    }}
                    className="mt-3 w-full rounded-full bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-300"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;