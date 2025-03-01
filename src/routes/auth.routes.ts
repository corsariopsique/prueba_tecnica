import { Router, Request } from 'express';
import { generateToken, validateToken, validateRoles } from '../middlewares/auth.middleware';
import { Usuario } from '../models/Usuario.model';
import { UsuarioServicio } from '../services/usuario.service';
import rateLimit from 'express-rate-limit';
import { JwtPayload } from '../interfaces/JwtPayload.interface';


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Demasiados intentos de login, intenta nuevamente más tarde'
});

interface RequestExtendida extends Request {
  user?: JwtPayload;
}

const router = Router();

router.post('/registrar', validateToken, validateRoles(['admin']), async (req: RequestExtendida, res, next) => {
  try{

    const nuevoUsuario = req.body;
    const usuarioCreado = await UsuarioServicio.crearUsuario(nuevoUsuario);    

    res.json(usuarioCreado);

  } catch(error){
    console.error('Datos de usuario incompletos');
    next();
  }
});

router.get('/profile', validateToken, validateRoles(['admin','user']), async (req: RequestExtendida, res, next) => {      

  try {
    const usuario = await Usuario.findById(req.user!.usuarioId)
      .select('-password -__v') 
      .lean();
      
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
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
    res.status(404).json({ message: 'no hay usuarios' });
    return;
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
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
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
      res.status(400).json({ message: 'Email y contraseña son requeridos' });
      return;
    }
    
    const usuario = await Usuario.findOne({ email }).select('+password');
    
    if (!usuario || !(await usuario.comparePassword(password))) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
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

export default router;