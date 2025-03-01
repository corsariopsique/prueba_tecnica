import winston from 'winston';

// Formato de logs
const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }
);

// Configuración de Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // Logs en consola
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Errores en archivo
    new winston.transports.File({ filename: 'logs/combined.log' }) // Todos los logs
  ],
});

export default logger;