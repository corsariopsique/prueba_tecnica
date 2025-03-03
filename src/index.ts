/**
 * Indice principal del sistema de gestión de usuarios y tareas.
 * @module index.ts
 * @author Mario Andres Ordoñez Serrano
 */

import express from "express";
import { ENV } from "./config/env";
import { connectToDatabase } from "./config/db";
import logger from "./utils/logger";
import morgan from "morgan";
import authRouter from "./routes/auth.routes";
import taskRouter from "./routes/tarea.routes";
import { errorHandler } from "./middlewares/auth.middleware";
import { AppError } from "./errors/http/AppError";
import { setupSwagger } from "./swagger";

const app = express();

const PORT = ENV.PORT || 3000;

async function startServer() {
  try {
    app.use(express.json());

    app.use(
      morgan("combined", {
        stream: {
          write: (message) => logger.info(message.trim()),
        },
      })
    );

    await connectToDatabase();
    console.log("✅ Conectado a MongoDB");

    app.use("/auth", authRouter);
    app.use("/tareas", taskRouter);

    setupSwagger(app);

    app.use((req, res, next) => {
      next(new AppError(404, "Ruta no encontrada"));
    });

    app.use(errorHandler);

    app.listen(PORT, () => {
      logger.info(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error de inicio:", error);
    process.exit(1);
  }
}

startServer();
