import { AppError } from "./AppError";

/**
 * Clase plantilla para manejo de errores en el sistema
 * @class UnauthorizedError
 * @memberof Error
 * @example
 * const error = UnauthorizedError('No tiene permiso');
 */

export class UnauthorizedError extends AppError {
  constructor(message: string = "Acceso no autorizado") {
    super(401, message);
  }
}