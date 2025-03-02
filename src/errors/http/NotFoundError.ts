import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string = "Solicitud no encontrada") {
    super(404, message);
  }
}