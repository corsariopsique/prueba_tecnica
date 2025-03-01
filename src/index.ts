import app from './app';
import { ENV } from './config/env';
import { connectToDatabase } from './config/db';
import logger from './config/logger';
import morgan from 'morgan';
import express from 'express';
import authRouter from './routes/auth.routes';

const PORT = ENV.PORT || 3000;

async function startServer() {
  try {
    await connectToDatabase();
    console.log('✅ Conectado a MongoDB');
    
    app.listen(PORT, () => {
      logger.info(`Servidor escuchando en http://localhost:${PORT}`);
    });

    app.use(morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }));   
    
    app.use('/auth',authRouter); 

    // Manejo de errores
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      res.status(500).send('Algo salió mal');
    });


  } catch (error) {
    console.error('❌ Error de inicio:', error);
    process.exit(1);
  }
}

startServer();