const winston = require("winston");
const {combine, timestamp, json}= winston.format;

const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" },{ level: "error" }),
        new winston.transports.File({filename: "logs/combined.log"})
    ]
});

module.exports = logger;
