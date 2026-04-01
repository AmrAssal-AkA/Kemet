const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, nxt) => {
  const token = req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(401).json({ error: "Unauthorized" });
  }
  const secretKey = process.env.ACCESS_TOKEN_SECRET
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = decoded;
  nxt();
});
}