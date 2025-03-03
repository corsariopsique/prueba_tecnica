/**
 * Modulo de implementacion de sistema de logs en el servicio.
 * @module logger.ts
 * @author Mario Andres Ordoñez Serrano
 */

import winston from 'winston';

const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }
);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

/**
 * Exporta esquema de gestions de logs
 * @function default
 * @returns flujo de logs sobre consola y archivos
 */

export default logger;