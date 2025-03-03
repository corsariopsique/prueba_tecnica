import express from "express";
import { connectToDatabase } from "./config/db";
import logger from "./utils/logger";
import morgan from "morgan";
import authRouter from "./routes/auth.routes";
import taskRouter from "./routes/tarea.routes";
import { errorHandler } from "./middlewares/auth.middleware";
import { AppError } from "./errors/http/AppError";
import { setupSwagger } from "./swagger";

const app = express();

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

export async function configureApp() {
  await connectToDatabase();
  console.log("✅ Conectado a MongoDB");

  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/tareas", taskRouter);

  setupSwagger(app);

  // Manejo de rutas no encontradas
  app.use((req, res, next) => {
    next(new AppError(404, "Ruta no encontrada"));
  });

  app.use(errorHandler);

  return app;
}

export default app;
