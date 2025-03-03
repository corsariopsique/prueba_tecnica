/**
 * Modulo de configuracion inicial del servicio web en express
 * @module index.ts
 * @author Mario Andres Ordoñez Serrano
 */
import { ENV } from "./env";

/**
 * Exporta esquema de configuracion del servicio
 * @function default
 * @returns esquema de configuracion
 */

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
