/**
 * Clase plantilla para manejo de errores en el sistema
 * @class AppError
 * @memberof Error
 * @example
 * const error = new AppError(404,'Ruta no encontrada');
 */

export class AppError extends Error {
    constructor(
      public statusCode: number,
      public message: string,
      public isOperational: boolean = true
    ) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
    }
}