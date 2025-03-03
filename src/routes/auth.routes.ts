/**
 * Modulo de definicion de rutas para la gestion de usuarios (CRUD) y
 * autenticacion de usuarios.
 * @module auth.routes.ts
 * @author Mario Andres Ordoñez Serrano
 */

import { Router, Request, Response, NextFunction } from "express";
import {
  generateToken,
  validateToken,
  validateRoles,
} from "../middlewares/auth.middleware";
import { Usuario } from "../models/Usuario.model";
import { UsuarioServicio } from "../services/usuario.service";
import rateLimit from "express-rate-limit";
import { JwtPayload } from "../interfaces/JwtPayload.interface";
import { BadRequestError } from "../errors/http/BadRequestError";
import { UnauthorizedError } from "../errors/http/UnauthorizedError";
import { NotFoundError } from "../errors/http/NotFoundError";
import "express-async-errors";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Demasiados intentos de login, intenta nuevamente más tarde",
});

interface RequestExtendida extends Request {
  user?: JwtPayload;
}

const router = Router();

/**
 * @swagger
 * /registrar:
 *   post:
 *     summary: "Permite el registro de un usuario"
 *     tags: [Usuarios]
 *     responses:
 *       201:
 *         description: "Usuario regisrado"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: "Error: Mensaje del sistema de validacion de entredas o del servicio."
 */

router.post(
  "/registrar",
  async (req: RequestExtendida, res: Response, next: NextFunction) => {
    try {
      const nuevoUsuario = req.body;
      const usuarioCreado = await UsuarioServicio.crearUsuario(nuevoUsuario);

      res.status(201).json(usuarioCreado);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: "Permite el acceso a los datos de usuario."
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: "[JSON] Usuario encontrado - Datos de usuario"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: "Error: Usuario no encontrado"
 */

router.get(
  "/profile",
  validateToken,
  async (req: RequestExtendida, res, next) => {
    try {
      const usuario = await Usuario.findById(req.user!.usuarioId)
        .select("-password -__v")
        .lean();

      if (!usuario) {
        throw new NotFoundError("Usuario no encontrado");
      }

      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: "Permite el acceso al listado de usuarios con autorizacion [admin]."
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: "[JSON] arreglo de usuarios registrados en el sistema."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: "Error: Este error no tiene sentido, sino quien haria la consulta?... jejejejeje"
 */

router.get(
  "/users",
  validateToken,
  validateRoles(["admin"]),
  async (req, res, next) => {
    try {
      const usuario = await UsuarioServicio.todosLosUsuarios();

      if (!usuario) {
        throw new NotFoundError(
          "Este error no tiene sentido, sino quien haria la consulta?... jejejejeje"
        );
      }
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: "Permite eliminar el usuario identificado con el id siempre y cuando disponga de autorizacion [admin]."
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: "Mensaje: El usuario con el id ############ ha sido eliminado."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: "Usuario no encontrado"
 */

router.delete(
  "/user/:id",
  validateToken,
  validateRoles(["admin"]),
  async (req: RequestExtendida, res, next) => {
    try {
      const deletedUser = await UsuarioServicio.eliminarUsuario(req.params.id);
      res.send(`El usuario con el id ${req.user!.usuarioId} ha sido eliminado`);

      if (!deletedUser) {
        throw new NotFoundError("Usuario no encontrado");
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: "Permite a los usuarios identificarse con el sistema y recibir un token JWT para identificarse en proximas solicitudes, limita el numero (5) de intentos fallidos para loggearse."
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: "[JSON] con los datos de usuario y token generado."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: "Email y constraseña son requeridos"
 *
 *       401:
 *         description: "Datos de usuario invalidos"
 *
 *       404:
 *         description: "Usuario no encontrado."
 *
 */

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new BadRequestError("Email y constraseña son requeridos");
    }

    const usuario = await Usuario.findOne({ email }).select("+password");

    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }

    if (!(await usuario.comparePassword(password))) {
      throw new UnauthorizedError("Datos de usuario invalidos");
    }

    const token = generateToken(usuario.id, usuario.roles);

    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        roles: usuario.roles,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Exporta el enrutador authRouter
 * @function default
 * @example
 * @returns
 * app.use('/auth',authRouter);
 */

export default router;
