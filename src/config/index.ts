import env from './env';

export default {
  server: {
    port: parseInt(env.PORT, 10),
    environment: env.NODE_ENV,
  },
  database: {
    uri: env.DB_URI,
  },
  jwt: {
    secret: env.JWT_SECRET,
  },
};