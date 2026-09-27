import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGithub,
  FaGoogle,
  FaLock,
  FaTimes,
  FaUser,
} from "react-icons/fa";

function AuthModal({ open, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const validate = () => {
    const newErrors = {};

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Enter a valid email.";
    }

    if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters.";
    }

    if (!isLogin) {
      if (!form.name.trim()) newErrors.name = "Name is required.";

      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    const user = {
        name: isLogin ? "Ayush" : form.name,
        email: form.email,
    };

    localStorage.setItem("veloraUser", JSON.stringify(user));

    onClose();

    window.location.reload();

    setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 z-[100000] w-[92%] max-w-md max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[32px] border border-yellow-400/20 bg-[#111827] shadow-[0_0_60px_rgba(250,204,21,.15)]"
          >
            {/* Header */}

            <div className="sticky top-0 z-20 relative bg-gradient-to-r from-yellow-500 to-yellow-300 p-6 text-black">
              <button
                onClick={onClose}
                className="absolute right-5 top-5 rounded-full bg-black/10 p-2 hover:bg-black/20"
              >
                <FaTimes />
              </button>

              <h2 className="text-3xl font-bold">
                {isLogin ? "Welcome Back" : "Join Velora"}
              </h2>

              <p className="mt-2 text-sm">
                Luxury cinema experience awaits.
              </p>
            </div>

            {/* Tabs */}

            <div className="flex border-b border-white/10">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 font-semibold transition ${
                  isLogin
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "text-gray-400"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 font-semibold transition ${
                  !isLogin
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "text-gray-400"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-5 p-6 pb-8">
              {/* Name */}

              {!isLogin && (
                <div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <FaUser className="text-yellow-400" />

                    <input
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-transparent outline-none"
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}

              <div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <FaEnvelope className="text-yellow-400" />

                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}

              <div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <FaLock className="text-yellow-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="w-full bg-transparent outline-none"
                  />

                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}

              {!isLogin && (
                <div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <FaLock className="text-yellow-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full bg-transparent outline-none"
                    />
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}

              {errors.general && (
                <p className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
                  {errors.general}
                </p>
              )}

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(250,204,21,.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={submit}
                disabled={loading}
                className="w-full rounded-xl bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </motion.button>

              {/* Divider */}

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-gray-500">OR</span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Social */}

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 hover:border-yellow-400">
                  <FaGoogle />

                  Google
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 hover:border-yellow-400">
                  <FaGithub />

                  GitHub
                </button>
              </div>

              <p className="text-center text-sm text-gray-400">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-yellow-400"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-yellow-400"
                    >
                      Login
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;