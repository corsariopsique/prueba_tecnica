import { Document } from "mongoose";

/**
 * Interface que termina la estructura base del modelo usuario
 * @interface IUsuarioBase
 */

export interface IUsuarioBase {
  nombre: string;
  email: string;
  password: string;
  roles: string[];
  edad?: number;
  comparePassword(contraseña_usuario: string): Promise<boolean>;
}

/**
 * Tipo que facilita la creacion de instancias del objeto usuario.
 * El tipo omite los campos agregados por mongoose y metodo para validar constraseñas
 * @typedef {UsuarioCrear}
 */
export type UsuarioCrear = Omit<
  IUsuarioBase,
  "_id" | "createdAt" | "updatedAt" | "comparePassword"
>;

/**
 * Interface que determina la estructura completa del modelo usuario con los campos agregados por mongoose.
 * @interface IUsuario
 */

export interface IUsuario extends IUsuarioBase, Document {
  createdAt: Date;
  updatedAt: Date;
}
