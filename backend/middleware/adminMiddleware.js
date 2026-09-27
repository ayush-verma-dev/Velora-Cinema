

export const adminOnly = (req, res, next) => {
  console.log("=== ADMIN MIDDLEWARE ===");
  console.log(req.user);

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only.",
    });
  }

  next();
};