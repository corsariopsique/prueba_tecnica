/**
 * Modulo de definicion de rutas para la gestion de tareas (CRUD) y
 * implementa el middleware para la gestion de autorizacion de rutas.
 * @module tarea.routes.ts
 * @author Mario Andres Ordoñez Serrano
 */

import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { validateToken } from "../middlewares/auth.middleware";
import { JwtPayload } from "../interfaces/JwtPayload.interface";
import { TareaServicio } from "../services/tarea.service";
import { TareaCrear } from "../interfaces/Tarea.interface";
import { BadRequestError } from "../errors/http/BadRequestError";
import { ForbiddenError } from "../errors/http/ForbiddenError";
import { UnauthorizedError } from "../errors/http/UnauthorizedError";
import { NotFoundError } from "../errors/http/NotFoundError";
import "express-async-errors";

interface RequestExtendida extends Request {
  user?: JwtPayload;
}

const router = Router();

/**
 * @swagger
 * /tareas:
 *   get:
 *     summary: "[JSON] Permite al usuario listar las tareas registradas por el usuario."
 *     tags: [Tareas]
 *     responses:
 *       201:
 *         description: "Listado de tareas registradas."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       500:
 *         description: "Error: Mensaje del sistema de validacion de entredas o del servicio."
 */

router.get(
  "/tareas",
  validateToken,
  async (req: RequestExtendida, res: Response, next: NextFunction) => {
    try {
      const tareas_usuario = await TareaServicio.buscarTareasByUser(
        req.user!?.usuarioId
      );

      if (!tareas_usuario) {
        throw new NotFoundError(
          `El Usuario ${req.user?.username} no tiene tareas registradas`
        );
      }

      res.json(tareas_usuario);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /addTarea:
 *   post:
 *     summary: "Permite al usuario registrar una tarea"
 *     tags: [Tareas]
 *     responses:
 *       201:
 *         description: "[JSON] Datos de la tarea registrada."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       500:
 *         description: "Error: Mensaje del sistema de validacion de entredas o del servicio."
 */

router.post(
  "/addTarea",
  validateToken,
  async (req: RequestExtendida, res, next) => {
    if (!Types.ObjectId.isValid(req.user!.usuarioId)) {
      throw new BadRequestError("ID de usuario inválido");
    }

    try {
      const nuevaTarea: TareaCrear = {
        titulo: String(req.body.titulo),
        descripcion: String(req.body.descripcion),
        fecha_vencimiento: req.body.fecha_vencimiento
          ? new Date(req.body.fecha_vencimiento)
          : undefined,
        estado: "Pendiente",
        usuario: new Types.ObjectId(req.user?.usuarioId),
      };

      const tareaCreada = await TareaServicio.crearTarea(nuevaTarea);

      res.status(201).json(tareaCreada);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: "Permite al usuario editar una tarea (mientras los datos sean validados solo requiere los campos que se vayan a modificar)"
 *     tags: [Tareas]
 *     responses:
 *       202:
 *         description: "[JSON] Datos de la tarea editada."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       500:
 *         description: "Error: Mensaje del sistema de validacion de entredas o del servicio."
 */

router.put("/:id", validateToken, async (req: RequestExtendida, res, next) => {
  if (!Types.ObjectId.isValid(req.user!.usuarioId)) {
    throw new BadRequestError("ID de usuario inválido");
  }

  const tareaAEditar = await TareaServicio.buscarTareaById(req.params.id);

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new BadRequestError("El cuerpo de la solicitud esta vacio");
  }

  if (
    tareaAEditar?.usuario.toString() ===
    new Types.ObjectId(req.user?.usuarioId).toString()
  ) {
    try {
      const nuevoEstado = req.body.estado;

      const estadosPermitidos = ["Pendiente", "Completada", "Cancelada"];

      const tareaEditar: Partial<TareaCrear> = {};

      if (req.body.titulo !== undefined) {
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
        throw new ForbiddenError("El estado que ha ingresado es invalido");
      } else if (estadosPermitidos.includes(nuevoEstado)) {
        tareaEditar.estado = nuevoEstado;
      }

      tareaEditar.usuario = new Types.ObjectId(req.user?.usuarioId);

      const tareaEditada = await TareaServicio.actualizarTarea(
        req.params.id,
        tareaEditar
      );

      res.status(202).json(tareaEditada);
    } catch (error) {
      next(error);
    }
  } else if (
    tareaAEditar?.usuario.toString() !=
      new Types.ObjectId(req.user?.usuarioId).toString() &&
    tareaAEditar !== null
  ) {
    throw new UnauthorizedError(
      `El usuario ${req.user?.usuarioId} no esta autorizado para editar esta tarea.`
    );
  } else if (tareaAEditar === null) {
    throw new NotFoundError(
      `La tarea con el id ${req.params.id.toString()} no fue encontrada.`
    );
  }
});

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: "Permite al usuario eliminar una tarea (mientras los datos sean validados, autoria de la tarea)"
 *     tags: [Tareas]
 *     responses:
 *       200:
 *         description: "La tarea con el identificador ################## fue eliminada con exito."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarea'
 *       500:
 *         description: "Error: Mensaje del sistema de validacion de entredas o del servicio."
 */

router.delete(
  "/:id",
  validateToken,
  async (req: RequestExtendida, res, next) => {
    const tareaAEliminar = await TareaServicio.buscarTareaById(req.params.id);

    if (
      tareaAEliminar?.usuario.toString() ===
      new Types.ObjectId(req.user?.usuarioId).toString()
    ) {
      const tareaEliminada = TareaServicio.eliminarTarea(req.params.id);
      res
        .status(200)
        .send(
          `La tarea con el identificador ${req.params.id.toString()} fue eliminada con exito.`
        );
      next();
    } else if (
      tareaAEliminar?.usuario.toString() !=
        new Types.ObjectId(req.user?.usuarioId).toString() &&
      tareaAEliminar !== null
    ) {
      throw new UnauthorizedError(
        `El usuario ${req.user?.usuarioId} no esta autorizado para eliminar esta tarea.`
      );
    } else if (tareaAEliminar === null) {
      throw new NotFoundError(
        `La tarea con el id ${req.params.id.toString()} no fue encontrada.`
      );
    }
  }
);

/**
 * Exporta el enrutador taskRouter
 * @function default
 * @example
 * @returns
 * app.use('/tareas',taskRouter);
 */

export default router;
