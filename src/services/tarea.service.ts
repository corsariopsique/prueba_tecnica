import { Tarea } from '../models/Tarea.model'
import { TareaCrear } from '../interfaces/Tarea.interface'

export class TareaServicio {

    static async crearTarea(tareaData: TareaCrear){
        const tarea = new Tarea(tareaData);
        return ((await tarea.save()));
    }

    static async buscarTareaById(tarea_id: string){
        try{
            return await Tarea.findById(tarea_id);
        }catch(error){
            return null;
        }
        
    }

    static async buscarTareasByUser(usuario_id:string){
        return await Tarea.find({usuario:usuario_id});
    }

    static async actualizarTarea(
        id_tarea:string,        
        data_actualizar_tarea: Partial<TareaCrear>){  
            
            const tareaActualizada = await Tarea.findByIdAndUpdate(
                {_id: id_tarea},
                data_actualizar_tarea,
                    { new:true, runValidators:true} 
                );

                return tareaActualizada;        
    }

    static async eliminarTarea(tarea_id:string){
        return await Tarea.findByIdAndDelete(tarea_id);
    }

}