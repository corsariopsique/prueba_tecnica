// archivo: src/@types/express.d.ts
import { IUsuario } from '../models/Usuario.model'; // Ajusta la ruta

declare global {
  namespace Express {
    interface Request {
      usuario?: IUsuario; 
    }
  }
}