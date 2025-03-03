/**
 * Modulo de implementacion de servicios para el modelo Tarea
 * @module tarea.service.ts
 * @author Mario Andres Ordoñez Serrano
 */

import { Tarea } from "../models/Tarea.model";
import { TareaCrear } from "../interfaces/Tarea.interface";
import { AppError } from "../errors/http/AppError";

/**
 * Clase que implementa los metodos de gestion CRUD para el modelo tarea
 * se gestionan errores que son enviados automaticamente al middleware.
 * @class TareaServicio
 * @memberof ITarea
 */

export class TareaServicio {
  static async crearTarea(tareaData: TareaCrear) {
    try {
      const tarea = new Tarea(tareaData);
      return await tarea.save();
    } catch (error: any) {
      throw new AppError(error.code || 500, error.message || "Error interno");
    }
  }

  static async buscarTareaById(tarea_id: string) {
    try {
      return await Tarea.findById(tarea_id);
    } catch (error: any) {
      throw new AppError(error.code || 500, error.message || "Error interno");
    }
  }

  static async buscarTareasByUser(usuario_id: string) {
    try {
      return await Tarea.find({ usuario: usuario_id });
    } catch (error: any) {
      throw new AppError(error.code || 500, error.message || "Error interno");
    }
  }

  static async actualizarTarea(
    id_tarea: string,
    data_actualizar_tarea: Partial<TareaCrear>
  ) {
    try {
      const tareaActualizada = await Tarea.findByIdAndUpdate(
        { _id: id_tarea },
        data_actualizar_tarea,
        { new: true, runValidators: true }
      );

      const tareaLista = await Tarea.findById(id_tarea);

      return tareaLista;
    } catch (error: any) {
      throw new AppError(error.code || 500, error.message || "Error interno");
    }
  }

  static async eliminarTarea(tarea_id: string) {
    try {
      return await Tarea.findByIdAndDelete(tarea_id);
    } catch (error: any) {
      throw new AppError(error.code || 500, error.message || "Error interno");
    }
  }
}
