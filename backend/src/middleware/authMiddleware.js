import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  // Check header properly
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token
  if (!token) {
    console.warn("[authMiddleware] No token found in Authorization header", {
      authorization: req.headers.authorization,
    });
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[authMiddleware] JWT decoded successfully", {
      id: decoded.id,
      role: decoded.role,
      authorization: req.headers.authorization,
    });

    const normalizeRole = (role) => {
      if (typeof role !== "string") return "";
      const trimmed = role.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    req.user = decoded; // { id, role }
    req.user.role = normalizeRole(req.user.role);
    req.user.id = String(req.user.id);
    console.log("[authMiddleware] request user set", req.user);
    next();
  } catch (error) {
    console.error("[authMiddleware] Token verification failed", {
      error: error.message,
      authorization: req.headers.authorization,
    });
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};