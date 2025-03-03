/**
 * Modulo de configuracion del middleware para gestion de autenticacion, autorizacion, errores y generacion de tokens JWT.
 * @module auth.middleware.ts
 * @author Mario Andres Ordoñez Serrano
 */

import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,  
} from "express";
import jwt, { Secret } from "jsonwebtoken";
import { ENV } from "../config/env";
import { JwtPayload } from "../interfaces/JwtPayload.interface";
import { AppError } from "../errors/http/AppError";
import logger from "../utils/logger";
import { UnauthorizedError } from "../errors/http/UnauthorizedError";
import { ForbiddenError } from "../errors/http/ForbiddenError";

interface RequestExtendida extends Request {
  user?: JwtPayload;
}

const SECRET_KEY: Secret = String(ENV.JWT_SECRET);

/**
 * Valida tokens JWT y verifica su autenticidad y vigencia
 * requiere de la interfaz RequestExtendida para poder manejar los campos de JWTPayload
 * @function validateToken
 * @param req
 * @param res
 * @param next
 * @returns {RequestHandler}
 */

export const validateToken = (
  req: RequestExtendida,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new UnauthorizedError("Acceso denegado, no se proporciono un token");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError("Token invalido o expirado");
  }
};

/**
 * Valida roles de usuario en una solicitud
 * @function validateRoles
 * @param requiredRoles
 * @returns {RequestHandler}
 */

export const validateRoles = (requiredRoles: string[]) => {
  return (req: RequestExtendida, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ForbiddenError("Usuario no autorizado");
    }

    if (!requiredRoles.some((role) => req.user!.roles.includes(role))) {
      throw new UnauthorizedError("Acceso Denegado");
    }
    next();
  };
};

/**
 * Genera tokens JWT
 * @function generateToken
 * @param usuarioId
 * @param roles
 * @returns {String}
 */

export const generateToken = (usuarioId: string, roles: string[]): string => {
  if (!SECRET_KEY) {
    throw new AppError(500, "La variable JWT_SECRET no está configurada");
  }

  const options: jwt.SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN,
    algorithm: "HS256",
  };

  return jwt.sign(
    { usuarioId, roles, iat: Math.floor(Date.now() / 1000) },
    SECRET_KEY,
    options
  );
};

/**
 * Gestiona errores del sistema
 * por medio de la @class{AppError} y envia respuestas
 * @function errorHandler
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns {ErrorRequestHandler}
 */

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  logger.error(`Error no controlado: ${err.message}`, {
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
};
