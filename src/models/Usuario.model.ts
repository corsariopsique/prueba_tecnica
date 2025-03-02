import { Schema, model } from 'mongoose';
import { IUsuario } from '../interfaces/Usuario.interface';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema<IUsuario>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Correo inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      trim: true,
      select: false
    },
    roles: {
      type: [String],
      enum: ['user', 'editor', 'admin'],
      default: ['user']
    },
    edad: {
      type: Number,
      min: [10, 'La edad mínima es 18 años'],
    },
  },
  {
    timestamps: true,  
    versionKey: false, 
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; 
        return ret;
      },
    },
  }
);


usuarioSchema.pre<IUsuario>('save', async function (next) {
    const usuario = this;

  if (!this.isModified('password')) return next();
  try {
    
    const salt = await bcrypt.genSalt(10); 

    
    const hash = await bcrypt.hash(usuario.password, salt);

    
    usuario.password = hash;
    next();
  } catch (error) {
    next(error as Error); 
  }

});

usuarioSchema.methods.comparePassword = async function 
(contraseña_usuario: string): Promise<boolean> {
  return bcrypt.compare(contraseña_usuario, this.password);
};

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);