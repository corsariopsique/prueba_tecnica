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
    },
    role: {
        type: String,
        enum: {
            values: ['ADMINISTRADOR', 'USUARIO'],
            message: '{VALUE} no es un role válido. Usar ADMIN o USER'
        },
        default: 'USUARIO', // Valor por defecto si no se especifica        
      },
    edad: {
      type: Number,
      min: [18, 'La edad mínima es 18 años'],
    },
  },
  {
    timestamps: true,  // Auto-genera createdAt y updatedAt
    versionKey: false, // Elimina el campo __v
  }
);

// Métodos personalizados (ej: hashear contraseña)
usuarioSchema.pre<IUsuario>('save', async function (next) {
    const usuario = this;

  if (!this.isModified('password')) return next();
  try {
    // Generar "salt" (costo computacional)
    const salt = await bcrypt.genSalt(10); // 10 es el número de rondas

    // Hashear la contraseña con el salt
    const hash = await bcrypt.hash(usuario.password, salt);

    // Reemplazar la contraseña en texto plano por el hash
    usuario.password = hash;
    next();
  } catch (error) {
    next(error as Error); // Pasar el error a Mongoose
  }

});

usuarioSchema.methods.comparePassword = async function 
(contraseña_usuario: string): Promise<boolean> {
  return bcrypt.compare(contraseña_usuario, this.password);
};

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);