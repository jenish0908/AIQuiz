const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {}
}

module.exports = auth;
