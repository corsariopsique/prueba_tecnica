/**
 * Modulo de la entidad tarea, determinacion de atributos y metodos de validacion de campos
 * @module Tarea.model.ts
 * @author Mario Andres Ordoñez Serrano
 */

import { Schema, model } from "mongoose";
import { ITarea } from "../interfaces/Tarea.interface";

const tareaSchema = new Schema<ITarea>(
    {
        titulo: {
            type: String,
            required: [true, 'El titulo es obligatorio'],
            trim: true,
        },
        descripcion: {
            type: String,
            required: [true, 'La descripcion es obligatoria'],
            trim: true
        },
        fecha_vencimiento: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],           
            
            validate: [
              {
                validator: (value: any) => validadoresFecha.esFechaValida(value),
                message: 'Formato de fecha inválido. Use ISO8601 (YYYY-MM-DDTHH:mm:ssZ)'
              },
              {
                validator: (value: Date) => validadoresFecha.esFechaNoPasada(value),
                message: 'La fecha debe ser actual o futura (UTC)'
              }
            ],            
            
            set: (value: any) => {
              if (validadoresFecha.esFechaValida(value)) {
                return new Date(value);
              }
              return value; 
            }
        },
        estado: {
            type: String,
            enum: {
                values: ['Pendiente', 'Completada', 'Cancelada'],
                message: '{VALUE} no es un estado válido. Opciones: Pendiente, Completada, Cancelada'
              },
            default: 'Pendiente',   
            required: true
        },
        usuario: { 
            type: Schema.Types.ObjectId, 
            ref: "Usuario", 
            required: true 
        },
    },
    {
        timestamps: true,  
        versionKey: false,
    }    
);

const validadoresFecha = {
    esFechaValida: (value: any): boolean => {
      return !isNaN(new Date(value).getTime());
    },
    
    esFechaNoPasada: (value: Date): boolean => {
      const ahoraUTC = new Date().toISOString();
      const fechaUTC = new Date(value).toISOString();
      return fechaUTC >= ahoraUTC;
    }
  };

  /**
 * Entidad Tarea la cual permite la implementacion de la capa de servicio.
 * @class Tarea
 * @memberof ITarea
 * @example
 * const tareaNueva = new Partial<ITareaBase> (...)
 */

  export const Tarea = model<ITarea>('Tarea', tareaSchema);

