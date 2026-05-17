const rateLimiter = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

exports.authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 10 : 100,
  skipSuccessfulRequests: true,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["forwarded"]?.match(/for=([^;,]+)/)?.[1]?.trim() ||
      req.ip;

    return ipKeyGenerator({ ip });
  },
});

exports.apiLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  skipSuccessfulRequests: true,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
  keyGenerator: (req, res) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["forwarded"]?.match(/for=([^;,]+)/)?.[1]?.trim() ||
      req.ip;

    return ipKeyGenerator({ ip });
  },
});
