import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string = "Error en la solicitud") {
    super(400, message);
  }
}