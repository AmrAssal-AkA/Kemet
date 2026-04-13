const morgan = require("morgan");
const logger = require("../services/logger");


const morganMiddleware = morgan(
    (tokens, req, res) => {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            response_time: `${tokens["response-time"](req, res)} ms`,
            userAgent: tokens["user-agent"](req, res),
        })
    },
    {
        stream: {
            write: (message) => logger.info(message.trim()),
        }
    }
)

module.exports = morganMiddleware;