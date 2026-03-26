const jwt = require("jsonwebtoken");

module.exports = (req, res, nxt) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }
    if (user.role !== "guide") {
      return res.status(403).json({ message: "Access denied: Not a guide" });
    }
    req.user = user;
  nxt();
})
};
