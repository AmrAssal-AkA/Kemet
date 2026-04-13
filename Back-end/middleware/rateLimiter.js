const rateLimiter = require("express-rate-limit");

exports.authLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});


exports.apiLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: {messgae: "Too many requests from this IP, please try again later."},
})