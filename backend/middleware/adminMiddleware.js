const adminOnly = (req, res, next) => {
  // req.user is set by authMiddleware (protect)
  // So always use adminOnly AFTER protect
  if (req.user && req.user.role === "admin") {
    next(); // Is admin → allow access
  } else {
    res.status(403).json({
      message: "Access denied. Admins only!"
    });
  }
};

module.exports = { adminOnly };