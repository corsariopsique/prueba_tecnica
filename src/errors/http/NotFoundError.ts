import { AppError } from "./AppError";

/**
 * Clase plantilla para manejo de errores en el sistema
 * @class NotFoundError
 * @memberof Error
 * @example
 * const error = new NotFoundError('NotFoundError');
 */

export class NotFoundError extends AppError {
  constructor(message: string = "Solicitud no encontrada") {
    super(404, message);
  }
}