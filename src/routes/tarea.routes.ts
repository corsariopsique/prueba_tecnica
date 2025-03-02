import { Router, Request, Response, NextFunction } from 'express';
import { Types } from "mongoose";
import { validateToken } from '../middlewares/auth.middleware';
import { JwtPayload } from '../interfaces/JwtPayload.interface';
import { TareaServicio } from '../services/tarea.service';
import { TareaCrear } from '../interfaces/Tarea.interface';
import { BadRequestError } from '../errors/http/BadRequestError';
import { ForbiddenError } from '../errors/http/ForbiddenError';
import { UnauthorizedError } from '../errors/http/UnauthorizedError';
import { NotFoundError } from '../errors/http/NotFoundError';
import 'express-async-errors';

interface RequestExtendida extends Request {
    user?: JwtPayload;
}

const router = Router();

router.get('/tareas', validateToken, async (req: RequestExtendida, res: Response, next: NextFunction ) => {
    try{
        const tareas_usuario = await TareaServicio.buscarTareasByUser(req.user!?.usuarioId);

        if(!tareas_usuario){
            throw new NotFoundError(`El Usuario ${req.user?.username} no tiene tareas registradas`);                        
        }
        
        res.json(tareas_usuario);

    }catch(error){
        next(error);
    }
});

router.post('/addTarea', validateToken, async (req:RequestExtendida, res, next) => {

    if (!Types.ObjectId.isValid(req.user!.usuarioId)) {
        throw new BadRequestError("ID de usuario inválido");
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
        throw new BadRequestError("ID de usuario inválido");
    }
    
    const tareaAEditar = await TareaServicio.buscarTareaById(req.params.id);   
    
    if (!req.body || Object.keys(req.body).length === 0){
        throw new BadRequestError('El cuerpo de la solicitud esta vacio');
    }

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
                    throw new ForbiddenError('El estado que ha ingresado es invalido');                    
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
        throw new UnauthorizedError(`El usuario ${req.user?.usuarioId} no esta autorizado para editar esta tarea.`)        
    
    }else if (tareaAEditar === null){
        throw new NotFoundError(`La tarea con el id ${req.params.id.toString()} no fue encontrada.`);        
    }   
});

router.delete('/:id', validateToken, async(req:RequestExtendida, res, next) => {

    const tareaAEliminar = await TareaServicio.buscarTareaById(req.params.id);        

    if(tareaAEliminar?.usuario.toString() === new Types.ObjectId(req.user?.usuarioId).toString()){

        const tareaEliminada = TareaServicio.eliminarTarea(req.params.id);
        res.status(200).send(`La tarea con el identificador ${req.params.is} fue eliminada con exito.`);
        return;

    }else if (tareaAEliminar?.usuario.toString() != new Types.ObjectId(req.user?.usuarioId).toString() && tareaAEliminar !== null){
        throw new UnauthorizedError(`El usuario ${req.user?.usuarioId} no esta autorizado para eliminar esta tarea.`);        

    }else if (tareaAEliminar===null){
        throw new NotFoundError(`La tarea con el id ${req.params.id.toString()} no fue encontrada.`);        
    }
});

export default router;





