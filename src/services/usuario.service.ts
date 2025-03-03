/**
 * Modulo de implementacion de servicios para el modelo Usuario
 * @module usuario.service.ts
 * @author Mario Andres Ordoñez Serrano
 */

import { Usuario } from '../models/Usuario.model';
import { UsuarioCrear } from '../interfaces/Usuario.interface';
import { AppError } from '../errors/http/AppError';

/**
 * Clase que implementa los metodos de gestion CRUD para el modelo usuario
 * se gestionan errores que son enviados automaticamente al middleware.
 * @class UsuarioServicio
 * @memberof ITarea 
 */

export class UsuarioServicio {

  static async crearUsuario(usuarioData: UsuarioCrear) {
    try{
      const usuario = new Usuario(usuarioData);
    return ((await usuario.save()));

    }catch(error:any){
      throw new AppError(error.code || 500, error.message || 'Error interno');
    }    
  }
  
  static async buscaUserCorreo(email: string) {
    try{
      return await Usuario.findOne({ email });

    }catch(error:any){
      throw new AppError(error.code || 500, error.message || 'Error interno');
    }    
  } 

  static async todosLosUsuarios() {
    try{
      return await Usuario.find().select('-password'); 

    }catch(error:any){
      throw new AppError(error.code || 500, error.message || 'Error interno');
    }    
  }

  static async eliminarUsuario(id: string){
    try{
      return await Usuario.findByIdAndDelete(id);
      
    }catch(error:any){
      throw new AppError(error.code || 500, error.message || 'Error interno');
    }    
  }
}