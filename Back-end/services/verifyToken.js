const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const verifyToken = (token) => {
    const secretKey = [
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_SECRET_OLD
    ].filter(Boolean);

    for (const key of secretKey){
        try{
            return jwt.verify(token, key);
        }catch (err){
            continue;
        }
    }
    throw new Error("Invalid token");
}

module.exports = verifyToken;