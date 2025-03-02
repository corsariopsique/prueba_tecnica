import { Document, Types } from "mongoose";

export interface ITareaBase {
    titulo:string;
    descripcion:string;
    fecha_vencimiento: Date | undefined;
    estado: 'Pendiente' | 'Completada' | 'Cancelada';
    usuario: Types.ObjectId;
}

export type TareaCrear = Omit<ITareaBase, "_id" | "createdAt" | "updatedAt" >;

export interface ITarea extends ITareaBase, Document{
    createdAt: Date;
    updatedAt: Date;    
}