/**
 * Modulo de validacion de variables de entorno
 * @module env.ts
 * @author Mario Andres Ordoñez Serrano 
 */

import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URL: z.string().url().regex(/^mongodb(\+srv)?:\/\//),
  JWT_SECRET: z.string().min(32).max(256),
  JWT_EXPIRES_IN: z.coerce.number().default(3600)
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Error en variables de entorno:');
  env.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const ENV = env.data;