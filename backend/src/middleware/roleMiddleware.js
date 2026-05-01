export const authorize = (roles) => {
  return (req, res, next) => {
    const normalizeRole = (role) => {
      if (typeof role !== "string") return "";
      return role.trim().toLowerCase();
    };

    const userRole = normalizeRole(req.user?.role);
    const allowedRoles = roles.map((role) => normalizeRole(role));

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: `Access denied${userRole ? ` for role ${req.user.role}` : ''}` });
    }
    next();
  };
};