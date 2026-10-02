// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   try {
//     let token;

//     // Check Authorization header
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // No token
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied. No token provided.",
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Get user (without password)
//     req.user = await User.findById(decoded.id).select("-password");

//     next();

//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token.",
//     });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  console.log("=== PROTECT MIDDLEWARE HIT ===");
  console.log("URL:", req.originalUrl);
  console.log("METHOD:", req.method);
  console.log(
    "AUTH HEADER:",
    req.headers.authorization ? "Bearer token received" : "NO AUTH HEADER"
  );

  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("NO TOKEN FOUND");

      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    console.log("TOKEN RECEIVED, VERIFYING...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("JWT VERIFIED SUCCESSFULLY");
    console.log("USER ID:", decoded.id);
    console.log("ROLE:", decoded.role);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.log("USER NOT FOUND:", decoded.id);

      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    console.log("USER FOUND:", req.user.email);

    next();
  } catch (error) {
    console.error("=== JWT ERROR ===");
    console.error("NAME:", error.name);
    console.error("MESSAGE:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};