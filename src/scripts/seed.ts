import { UsuarioServicio } from '../services/usuario.service';
import { connectToDatabase } from '../config/db';
import { UsuarioCrear } from '../interfaces/Usuario.interface';

async function seedDatabase() {
  try {
    await connectToDatabase();
    
    const usuario: UsuarioCrear = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'USUARIO',
      password: 'secreto123'
    };

    const creado = await UsuarioServicio.crearUsuario(usuario);
    console.log('Usuario semilla creado:', creado);
    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
}

seedDatabase();