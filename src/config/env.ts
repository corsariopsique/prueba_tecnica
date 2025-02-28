import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
});

const env = envSchema.parse(process.env);

export default env;