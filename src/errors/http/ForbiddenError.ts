import { AppError } from "./AppError";

/**
 * Clase plantilla para manejo de errores en el sistema
 * @class ForbiddenError
 * @memberof Error
 * @example
 * const error = new ForbiddenError('Acceso denegado');
 */

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso prohibido") {
    super(403, message);
  }
}
