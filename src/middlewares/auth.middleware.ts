import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { ENV } from '../config/env';
import { JwtPayload } from '../interfaces/JwtPayload.interface';
import { AppError } from '../errors/http/AppError';
import logger from '../utils/logger';
import { UnauthorizedError } from '../errors/http/UnauthorizedError';
import { ForbiddenError } from '../errors/http/ForbiddenError';

interface RequestExtendida extends Request{
  user?: JwtPayload;
}

const SECRET_KEY: Secret = String(ENV.JWT_SECRET);

export const validateToken = (req: RequestExtendida, res: Response, next: NextFunction) => {

  const token = req.header('Authorization')?.replace('Bearer ', '');


  if (!token) {
    throw new UnauthorizedError('Acceso denegado, no se proporciono un token');    
  }

  try {
    
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    req.user=decoded;     
    next();
    
  } catch (error) {
    throw new UnauthorizedError('Token invalido o expirado');    
  }
};


export const validateRoles = (requiredRoles: string[]) => {

  return (req: RequestExtendida, res: Response, next: NextFunction) => {

    if (!req.user) {
      throw new UnauthorizedError('Usuario no autorizado');      
    }

    if (!requiredRoles.some(role => req.user!.roles.includes(role))) {
      throw new ForbiddenError('Acceso Denegado');      
    }
    next();
  };
};


export const generateToken = (usuarioId: string, roles: string[]): string => {  

  if (!SECRET_KEY) {
    throw new AppError(500,"La variable JWT_SECRET no está configurada");
  }

  const options: jwt.SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN,
    algorithm: "HS256"    
  };

  return jwt.sign(
    { usuarioId, roles,
      iat: Math.floor(Date.now() / 1000),      
     },
    SECRET_KEY,
    options
  );
};


export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  
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