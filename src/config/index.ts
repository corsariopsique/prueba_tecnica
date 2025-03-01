import { ENV } from './env';

export default {
  server: {
    port: parseInt(ENV.PORT, 10),
    environment: ENV.NODE_ENV,
  },
  database: {
    uri: ENV.MONGODB_URL,
  },
  jwt: {
    secret: ENV.JWT_SECRET,
  },
};