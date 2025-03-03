import { AppError } from "./AppError";

/**
 * Clase plantilla para manejo de errores en el sistema
 * @class BadRequestError
 * @memberof Error
 * @example
 * const error = new BadRequestError('Solicitud invalida');
 */

export class BadRequestError extends AppError {
  constructor(message: string = "Error en la solicitud") {
    super(400, message);
  }
}