const jwt = require("jsonwebtoken");


module.exports = (req, res, nxt) => {
    const token = req.cookies?.["x-auth-token"] || req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try{
        const tokenVerify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = tokenVerify;
        nxt();
    }catch(err){
        res.status(401).send("Invalid token!");
    }
}