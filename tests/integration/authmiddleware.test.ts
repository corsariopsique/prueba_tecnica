import request from "supertest";
import { configureApp } from "../../src/app";
import { Application } from "express";
import { generateToken } from "../../src/middlewares/auth.middleware";

describe("Endpoints de usuario y control autenticaciones", () => {
  let app: Application;

  interface User {
    nombre: string;
    email: string;
    roles: string[];
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }

  let storedUser: User | null = null;

  function setUser(user: User): void {
    storedUser = user;
  }

  beforeAll(async () => {
    app = await configureApp();
  });

  it("debe registrar un nuevo usuario", async () => {
    const data = {
      nombre: "Usuario Pruebas",
      email: "correo@pruebas.org",
      password: "password",
      roles: ["user"],
    };
    const res = await request(app).post("/auth/registrar").send(data);
    setUser(res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email");
  });

  it("debe hacer un login correctamente", async () => {
    const data = { email: storedUser?.email, password: "password" };

    const res = await request(app).post("/auth/login").send(data);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.usuario.email).toBe(data.email);
  });

  it("debe devolver error 401 si los datos de usuario estan mal", async () => {
    const data = { email: storedUser?.email, password: "noeselpass" };
    const res = await request(app).post("/auth/login").send(data);
    expect(res.statusCode).toEqual(401);
  });

  it("debe negar el acceso a la lista de usuarios", async () => {
    const token = generateToken(storedUser!?._id, storedUser!?.roles);

    const res = await request(app)
      .get("/auth/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(401);
  });

  it("debe eliminar el usuario registrado", async () => {
    const token = generateToken(storedUser!?._id, ["admin"]);
    const id = String(storedUser?._id);
    const res = await request(app)
      .delete(`/auth/user/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
