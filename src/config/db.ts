import mongoose from 'mongoose';
import { ENV } from './env';
import logger from './logger';

const MONGODB_URL = ENV.MONGODB_URL;

if (!ENV.MONGODB_URL) {
  throw new Error("❌ MONGODB_URL no está definido en .env");
}

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URL!);
    logger.info('✅ Conectado a MongoDB');

    mongoose.connection.on("disconnected", () => {
      logger.warn('⚠️  Desconectado de MongoDB');
    });

    mongoose.connection.on('connected', () => {
      logger.info('📊 Conexión activa a MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on("reconnected", () => {
      logger.info('✅ Reconectado a MongoDB');
    });

  } catch (error) {
    logger.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
}