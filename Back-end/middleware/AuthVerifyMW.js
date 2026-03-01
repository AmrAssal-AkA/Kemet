const jwt = require("jsonwebtoken");
const config = require("config");


module.exports = (req, res, nxt) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try{
        const tokenVerify = jwt.verify(token, config.get("YourSecretKeyForJWT"));
        req.user = tokenVerify;
        nxt();
    }catch(err){
        res.status(500).send("server error!");
    }
}