import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { ENV } from '../config/env';
import { JwtPayload } from '../interfaces/JwtPayload.interface';

interface RequestExtendida extends Request{
  user?: JwtPayload;
}

const SECRET_KEY: Secret = String(ENV.JWT_SECRET);


export const validateToken = (req: RequestExtendida, res: Response, next: NextFunction) => {

  const token = req.header('Authorization')?.replace('Bearer ', '');


  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    return;
  }

  try {
    
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    req.user=decoded;     
    next();
    
  } catch (error) {
    
    res.status(401).json({ message: 'Token inválido o expirado.' });
    return;
  }
};

export const validateRoles = (requiredRoles: string[]) => {
  return (req: RequestExtendida, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    if (!requiredRoles.some(role => req.user!.roles.includes(role))) {
      res.status(403).json({ error: 'Acceso denegado' });
      return;
    }
    next();
  };
};

export const generateToken = (usuarioId: string, roles: string[]): string => {  

  if (!SECRET_KEY) {
    throw new Error("La variable JWT_SECRET no está configurada");
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