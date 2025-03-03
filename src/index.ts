// src/index.ts
import { configureApp } from "./app";
import { ENV } from "./config/env";
import logger from "./utils/logger";

const PORT = ENV.PORT || 3000;

export async function startServer() {
  try {
    const app = await configureApp();

    app.listen(PORT, () => {
      logger.info(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error de inicio:", error);
    process.exit(1);
  }
}

// Solo se arranca el servidor si se ejecuta directamente
if (require.main === module) {
  startServer();
}
