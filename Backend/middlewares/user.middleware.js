const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
  try {
    const token = req.cookies.token; // ✅ reads token from cookie

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET_KEY);
    req.user = decoded; // stores user info for access in route handlers

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = {
  userMiddleware,
};
