const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const verifyToken = require("../services/verifyToken");

module.exports = (req, res, nxt) => {
  const token = req.cookies["x-auth-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return nxt();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
