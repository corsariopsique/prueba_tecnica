/**
 * Modulo de configuracion de la conexion de la base de datos
 * @module db.ts
 * @author Mario Andres Ordoñez Serrano
 */

import mongoose from 'mongoose';
import { ENV } from './env';
import logger from '../utils/logger';

const MONGODB_URL = ENV.MONGODB_URL;

if (!ENV.MONGODB_URL) {
  throw new Error("❌ MONGODB_URL no está definido en .env");
}

 /**
 * Funcion que conecta el servicio con la base de datos MongoDB
 * @function connectToDatabase * 
 * @returns Conexion a la base de datos 
 */

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URL!);
    logger.info('✅ Conectado a MongoDB');  

  } catch (error) {
    logger.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
}