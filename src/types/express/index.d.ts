// archivo: src/@types/express.d.ts
import { JwtPayload } from "../interfaces/JwtPayload.interface";
import "supertest";
import { Request } from "express";
import { IUsuario, IUsuarioBase } from "../interfaces/Usuario.interface";
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
    usuario?: IUsuario;
    token: string;
  }
}