import { Router, Request } from 'express';
import { Types } from "mongoose";
import { validateToken, validateRoles } from '../middlewares/auth.middleware';
import { JwtPayload } from '../interfaces/JwtPayload.interface';
import { TareaServicio } from '../services/tarea.service';
import { TareaCrear } from '../interfaces/Tarea.interface';


interface RequestExtendida extends Request {
    user?: JwtPayload;
}

const router = Router();

router.get('/tareas', validateToken, async (req: RequestExtendida, res, next ) => {
    try{
        const tareas_usuario = await TareaServicio.buscarTareasByUser(req.user!?.usuarioId);

        if(!tareas_usuario){
            res.status(404).json({mensaje: `El Usuario ${req.user?.username} no tiene tareas registradas`});
            return;
        }
        res.json(tareas_usuario);

    }   catch(error){
            next(error);
        }
});

router.post('/addTarea', validateToken, async (req:RequestExtendida, res, next) => {

    if (!Types.ObjectId.isValid(req.user!.usuarioId)) {
        throw new Error("ID de usuario inválido");
    }     

    try{
        const nuevaTarea: TareaCrear= {
            titulo: String(req.body.titulo),
            descripcion: String(req.body.descripcion),
            fecha_vencimiento: req.body.fecha_vencimiento 
              ? new Date(req.body.fecha_vencimiento)
              : undefined, 
            estado:'Pendiente',
            usuario: new Types.ObjectId(req.user?.usuarioId)
        };

        const tareaCreada = await TareaServicio.crearTarea(nuevaTarea);

        res.status(201).json(tareaCreada);

    } catch (error) {
      next(error);    
    }

});

router.put('/:id', validateToken, async (req: RequestExtendida, res, next) => {

    if (!Types.ObjectId.isValid(req.user!.usuarioId)) {
        throw new Error("ID de usuario inválido");
    }
    
    const tareaAEditar = await TareaServicio.buscarTareaById(req.params.id);    

    if(tareaAEditar?.usuario.toString() === new Types.ObjectId(req.user?.usuarioId).toString()){

        try {
            const nuevoEstado = req.body.estado;
    
            const estadosPermitidos = ['Pendiente', 'Completada', 'Cancelada'];        
            
            const tareaEditar: Partial<TareaCrear>= {};
    
                if(req.body.titulo !== undefined) {
                    tareaEditar.titulo = String(req.body.titulo);
                }
    
                if (req.body.descripcion !== undefined) {
                    tareaEditar.descripcion = String(req.body.descripcion);
                }
    
                if (req.body.fecha_vencimiento !== undefined) {
                    tareaEditar.fecha_vencimiento = req.body.fecha_vencimiento 
                      ? new Date(req.body.fecha_vencimiento)
                      : undefined; // Permitir eliminar la fecha
                }
    
                if (!estadosPermitidos.includes(nuevoEstado)) {
                    res.status(400).json({
                    success: false,
                    error: 'Estado no válido'
                    });
        
                    return;
                }else if (estadosPermitidos.includes(nuevoEstado)) {
                    tareaEditar.estado = nuevoEstado;
                } 
                
                tareaEditar.usuario = new Types.ObjectId(req.user?.usuarioId);        
    
            const tareaEditada = TareaServicio.actualizarTarea(
                req.params.id,                
                tareaEditar);
    
            res.status(202).send(`La tarea con el id ${req.params.id.toString()} fue editada exitosamente.`)
    
        } catch (error) {
            next(error);    
        }

    }else if (tareaAEditar?.usuario.toString() != new Types.ObjectId(req.user?.usuarioId).toString() && tareaAEditar !== null){
        res.status(401).send(`El usuario ${req.user?.usuarioId} no esta autorizado para editar esta tarea.`);
        return;

    }else if (tareaAEditar === null){
        res.status(404).send(`La tarea con el id ${req.params.id.toString()} no fue encontrada.`);
        return;
    }   
});

router.delete('/:id', validateToken, async(req:RequestExtendida, res, next) => {

    const tareaAEliminar = await TareaServicio.buscarTareaById(req.params.id);        

    if(tareaAEliminar?.usuario.toString() === new Types.ObjectId(req.user?.usuarioId).toString()){

        const tareaEliminada = TareaServicio.eliminarTarea(req.params.id);
        res.status(200).send(`La tarea con el identificador ${req.params.is} fue eliminada con exito.`);
        return;
    }else if (tareaAEliminar?.usuario.toString() != new Types.ObjectId(req.user?.usuarioId).toString() && tareaAEliminar !== null){
        res.status(401).send(`El usuario ${req.user?.usuarioId} no esta autorizado para eliminar esta tarea.`);
        return;
    }else if (tareaAEliminar===null){
        res.status(404).send(`La tarea con el id ${req.params.id.toString()} no fue encontrada.`);
        return;
    }
});

export default router;





