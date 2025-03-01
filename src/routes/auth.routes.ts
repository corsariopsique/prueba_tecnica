import { Router } from 'express';
import { authenticateJwt, checkRole, generateToken } from '../middlewares/auth.middleware';
import { Usuario } from '../models/Usuario.model';
import { UsuarioServicio } from '../services/usuario.service';
import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env';

// Configuración de rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por ventana
  message: 'Demasiados intentos de login, intenta nuevamente más tarde'
});

const router = Router();

// Extender tipo Request de Express (colocar en archivo de tipos)
declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: string;
        role: string;
      };
    }
  }
}

// Ruta protegida
router.get('/profile', authenticateJwt, async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario?.id)
      .select('-password -__v') // Excluir información sensible
      .lean();
      
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    
    res.json(usuario);
  } catch (error) {
    next(error); // Pasar al manejador de errores
  }
});

router.get('/users', authenticateJwt, async (req, res, next) => {
  try {
  const usuario = await UsuarioServicio.todosLosUsuarios();

  if (!usuario) {
    res.status(404).json({ message: 'no hay usuarios' });
    return;
  }

  res.json(usuario);
  }catch (error) {
    next(error);
  }
});

// Ruta de eliminación para administradores
router.delete('/:id', authenticateJwt, checkRole(['ADMINISTRADOR']), async (req, res, next) => {
  try {
    const deletedUser = await Usuario.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Login con rate limiting
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validar entrada
    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son requeridos' });
      return;
    }
    
    const usuario = await Usuario.findOne({ email }).select('+password');
    
    if (!usuario || !(await usuario.comparePassword(password))) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = generateToken(usuario.id, usuario.role);
    
    // Configurar cookie segura (opcional)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      maxAge: 3600000 // 1 hora
    });
    
    res.json({
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;