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
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const normalizeRole = (role) => {
      if (typeof role !== "string") return "";
      const trimmed = role.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    req.user = decoded; // { id, role }
    req.user.role = normalizeRole(req.user.role);
    req.user.id = String(req.user.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};