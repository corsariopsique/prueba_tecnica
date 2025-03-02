import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Acceso no autorizado") {
    super(401, message);
  }
}