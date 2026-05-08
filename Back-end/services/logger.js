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
    ],
});

module.exports = logger;
