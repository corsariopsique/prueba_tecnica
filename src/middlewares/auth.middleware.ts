import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import jwt, { Secret } from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.model';
import { ENV } from '../config/env';

// Interface para el payload del token
interface JwtPayload {
  userId: string;
  role: string;
}

const SECRET_KEY: Secret = String(ENV.JWT_SECRET);

// Configuración de la estrategia JWT
const configurePassport = () => {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY, // Usa una variable de entorno
    algorithms: ['HS256'] as jwt.Algorithm[],
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload: JwtPayload, done: VerifiedCallback) => {
      try {
        const usuario = await Usuario.findById(payload.userId);

        if (!usuario){
          done(null, false);
          return;
        }         
        
        // Agrega datos adicionales al req.user si es necesario
        done(null, { id: usuario.id, role: usuario.role });
        return;
        
      } catch (error) {
        done(error, false);
        return;
      }
    })
  );
};

// Middleware de autenticación
export const authenticateJwt = passport.authenticate('jwt', { session: false });

// Middleware para verificar roles (ejemplo: admin)
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.role)) {
      res.status(403).json({ message: 'Acceso no autorizado' });
      return;
    }
    next();
  };
};

// Generador de token JWT
export const generateToken = (usuarioId: string, role: string): string => {  

  if (!SECRET_KEY) {
    throw new Error("La variable JWT_SECRET no está configurada");
  }

  const options: jwt.SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN,
    algorithm: "HS256"    
  };

  return jwt.sign(
    { usuarioId, role,
      iat: Math.floor(Date.now() / 1000),      
     },
    SECRET_KEY,
    options
  );
};

// Inicializa Passport al cargar el middleware
configurePassport();