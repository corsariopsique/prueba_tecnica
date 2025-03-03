/**
 * Modulo de definicion de rutas para la gestion de usuarios (CRUD) y
 * autenticacion de usuarios.
 * @module auth.routes.ts
 * @author Mario Andres Ordoñez Serrano
 */

import { Router, Request, Response, NextFunction } from 'express';
import { generateToken, validateToken, validateRoles, errorHandler } from '../middlewares/auth.middleware';
import { Usuario } from '../models/Usuario.model';
import { UsuarioServicio } from '../services/usuario.service';
import rateLimit from 'express-rate-limit';
import { JwtPayload } from '../interfaces/JwtPayload.interface';
import { BadRequestError } from '../errors/http/BadRequestError';
import { UnauthorizedError } from '../errors/http/UnauthorizedError';
import { NotFoundError } from '../errors/http/NotFoundError';
import 'express-async-errors';


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Demasiados intentos de login, intenta nuevamente más tarde'
});

interface RequestExtendida extends Request {
  user?: JwtPayload;
}

const router = Router();

router.post('/registrar', errorHandler, async (req: RequestExtendida, res:Response, next:NextFunction) => {
  try{

    const nuevoUsuario = req.body;
    const usuarioCreado = await UsuarioServicio.crearUsuario(nuevoUsuario);    

    res.status(201).json(usuarioCreado);

  } catch(error){    
    next(error);
  }
});

router.get('/profile', validateToken, validateRoles(['admin','user']), async (req: RequestExtendida, res, next) => {      

  try {
    const usuario = await Usuario.findById(req.user!.usuarioId)
      .select('-password -__v') 
      .lean();
      
    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');      
    }
    
    res.json(usuario);

  } catch (error) {
    next(error); 
  }
});

router.get('/users', validateToken, validateRoles(['admin']), async (req, res, next) => {
  try {
  const usuario = await UsuarioServicio.todosLosUsuarios();

  if (!usuario) {
    throw new NotFoundError('Este error no tiene sentido, sino quien haria la consulta?... jejejejeje');    
  }
  res.json(usuario);

  }catch (error) {
    next(error);
  }
});

router.delete('/:id', validateToken, validateRoles(['admin']), async (req: RequestExtendida, res, next) => {
  try {
    const deletedUser = await UsuarioServicio.eliminarUsuario(req.params.id);    
    res.send(`El usuario con el id ${req.user!.usuarioId} ha sido eliminado`);    
    
    if (!deletedUser) {
      throw new NotFoundError('Usuario no encontrado');      
    }    
    
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validar entrada
    if (!email || !password) {
      throw new BadRequestError('Email y constraseña son requeridos');      
    }
    
    const usuario = await Usuario.findOne({ email }).select('+password');
    
    if (!usuario || !(await usuario.comparePassword(password))) {
      throw new UnauthorizedError('Datos de usuario invalidos');      
    }

    const token = generateToken(usuario.id, usuario.roles);
    
    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        roles: usuario.roles
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Exporta el enrutador authRouter
 * @function default 
 * @example
 * @returns
 * app.use('/auth',authRouter);
 */

export default router;