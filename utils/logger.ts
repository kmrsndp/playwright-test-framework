/**
 * Custom logger utility for test automation
 * Provides formatted logging with timestamps and different log levels
 */

import winston from 'winston';
import path from 'path';

// Configure log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../reports/test-execution.log')
        })
    ]
});

// Export typed logging functions
export const log = {
    info: (message: string) => {
        logger.info(message);
    },
    warn: (message: string) => {
        logger.warn(message);
    },
    error: (message: string) => {
        logger.error(message);
    },
    debug: (message: string) => {
        logger.debug(message);
    }
};

export default log; 