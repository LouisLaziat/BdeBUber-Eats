import { transports, createLogger, format } from "winston";

const loggerConfig = {
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
};
const logger = createLogger(loggerConfig);

export default logger;
