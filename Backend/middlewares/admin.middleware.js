const jwt = require("jsonwebtoken");

// this middleware provides JWT-based Authentication for admin routes (protect admin only routes)
function adminMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY);
    req.admin = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = {
  adminMiddleware,
};
