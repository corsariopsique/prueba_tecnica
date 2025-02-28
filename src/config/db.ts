import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mi_base_de_datos';

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    } as any); // "as any" para evitar conflictos de tipos

    console.log('✅  Conectado a MongoDB con Mongoose');
  } catch (error) {
    console.error('❌  Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Ejemplo de modelo (crea una carpeta "models" adicional)
import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const User = model<IUser>('User', userSchema);