import { Document, Types } from "mongoose";

/**
 * Interface que determina los campos bases del modelo tarea.
 * @interface ITareaBase
 */

export interface ITareaBase {
    titulo:string;
    descripcion:string;
    fecha_vencimiento: Date | undefined;
    estado: 'Pendiente' | 'Completada' | 'Cancelada';
    usuario: Types.ObjectId;
}

/**
 * Tipo que facilita la creacion de instancias del objeto tarea.
 * El tipo omite los campos agregados por mongoose.
 * @typedef {TareaCrear}
 */

export type TareaCrear = Omit<ITareaBase, "_id" | "createdAt" | "updatedAt" >;

/**
 * Interface que determina el modelo completo con las propiedades agregadas de mongoose
 * @interface ITarea
 */

export interface ITarea extends ITareaBase, Document{
    createdAt: Date;
    updatedAt: Date;    
}