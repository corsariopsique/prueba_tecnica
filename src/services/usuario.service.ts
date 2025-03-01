import { Usuario } from '../models/Usuario.model';
import { IUsuario, UsuarioCrear } from '../interfaces/Usuario.interface';

export class UsuarioServicio {

  static async crearUsuario(usuarioData: UsuarioCrear) {
    const usuario = new Usuario(usuarioData);
    return ((await usuario.save()));
  }
  
  static async buscaUserCorreo(email: string) {
    return await Usuario.findOne({ email });
  } 

  static async todosLosUsuarios() {
    return await Usuario.find().select('-password'); 
  }

  static async eliminarUsuario(id: string){
    return await Usuario.findByIdAndDelete(id);
  }
}