import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso prohibido") {
    super(403, message);
  }
}