export const authorize = (roles) => {
  return (req, res, next) => {
    const normalizeRole = (role) => {
      if (typeof role !== "string") return "";
      return role.trim().toLowerCase();
    };

    const userRole = normalizeRole(req.user?.role);
    const allowedRoles = roles.map((role) => normalizeRole(role));

    console.log("[authorize] authorizing request", {
      userRole,
      allowedRoles,
      path: req.path,
      method: req.method,
      user: req.user,
    });

    if (!allowedRoles.includes(userRole)) {
      console.warn("[authorize] Role mismatch", {
        requiredRoles: allowedRoles,
        userRole,
        user: req.user,
        path: req.path,
      });
      return res.status(403).json({ message: `Access denied${userRole ? ` for role ${req.user.role}` : ''}` });
    }
    next();
  };
};