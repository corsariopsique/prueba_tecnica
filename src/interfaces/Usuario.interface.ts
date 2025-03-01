import { Document } from 'mongoose';

export interface IUsuarioBase {
    nombre: string;
    email: string;
    password: string;
    role: 'ADMINISTRADOR' | 'USUARIO';
    edad?: number;
    comparePassword(contraseña_usuario: string): Promise<boolean>;
}

export type UsuarioCrear = Omit<IUsuarioBase, "_id" | "createdAt" | "updatedAt" |"comparePassword">;

export interface IUsuario extends IUsuarioBase, Document {  
  createdAt: Date;
  updatedAt: Date;
}