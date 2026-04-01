const jwt = require('jsonwebtoken');


module.exports = (req, res, nxt) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid access token" });
        }
        req.user = user;
    nxt();
})
};