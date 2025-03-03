import request from "supertest";
import { configureApp } from "../../src/app";
import { Application } from "express";
import { generateToken } from "../../src/middlewares/auth.middleware";

describe("Pruebas Endpoints del modulo Tareas", () => {
  let app: Application;

  interface User {
    nombre: string;
    email: string;
    roles: string[];
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Tarea {
    titulo: string;
    descripcion: string;
    fecha_vencimiento: Date;
    estado: string;
    usuario: string;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  }

  let storesTask: Tarea | null = null;

  let storedUser: User | null = null;

  function setUser(user: User): void {
    storedUser = user;
  }

  function setTarea(tarea: Tarea): void {
    storesTask = tarea;
  }

  beforeAll(async () => {
    app = await configureApp();
  });

  it("debe registrar un nuevo usuario", async () => {
    const data = {
      nombre: "Usuario Pruebas Tareas",
      email: "tareas@pruebas.org",
      password: "password",
      roles: ["user"],
    };
    const res = await request(app).post("/auth/registrar").send(data);
    setUser(res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email");
  });

  it("el nuevo usuario debe crear una tarea nueva solo con los argumentos obligatorios", async () => {
    const dataTarea = {
      titulo: "Tarea esquema de pruebas",
      descripcion: "La Tarea debe quedar registrada",
      fecha_vencimiento: "2025-10-05",
    };
    const token = generateToken(storedUser!?._id, storedUser!?.roles);

    const res = await request(app)
      .post("/tareas/addTarea")
      .set("Authorization", `Bearer ${token}`)
      .send(dataTarea);
    setTarea(res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("titulo");
    expect(res.body.titulo).toBe(dataTarea.titulo);
  });

  it("el nuevo usuario debe crear una segunda tarea solo con los argumentos obligatorios", async () => {
    const dataTarea = {
      titulo: "segunda Tarea esquema de pruebas",
      descripcion: "La Tarea debe quedar registrada",
      fecha_vencimiento: "2025-10-05",
    };
    const token = generateToken(storedUser!?._id, storedUser!?.roles);

    const res = await request(app)
      .post("/tareas/addTarea")
      .set("Authorization", `Bearer ${token}`)
      .send(dataTarea);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("titulo");
    expect(res.body.titulo).toBe(dataTarea.titulo);
  });

  it("el usuario va a intentar modificar el estado de la tarea de forma errada y el sistema debe rechazar su solicitud", async () => {
    const dataEdicion = {
      titulo: "Tarea de pruebas editada",
      descricion: "Depende de la prueba la tarea puede o no ser editada",
      estado: "mal ediatada",
    };
    const token = generateToken(storedUser!?._id, storedUser!?.roles);

    const res = await request(app)
      .put(`/tareas/${storesTask?._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(dataEdicion);
    expect(res.statusCode).toEqual(403);
  });

  it("el usuario va a intentar modificar el estado de la tarea de forma correcta y el sistema debe aceptar su solicitud", async () => {
    const dataEdicion = {
      titulo: "Tarea de pruebas editada",
      descricion: "Depende de la prueba la tarea puede o no ser editada",
      estado: "Completada",
    };
    const token = generateToken(storedUser!?._id, storedUser!?.roles);

    const res = await request(app)
      .put(`/tareas/${storesTask?._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(dataEdicion);
    expect(res.statusCode).toEqual(202);
    expect(res.body).toHaveProperty("estado");
    expect(res.body.estado).toBe(dataEdicion.estado);
  });

  it("el usuario va a eliminar la tarea ya completada", async () => {
    const token = generateToken(storedUser!?._id, storedUser!?.roles);

    const res = await request(app)
      .delete(`/tareas/${storesTask?._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it("el usuario va a listar las tarea existentes en el sistema a nombre suyo", async () => {
    const token = generateToken(storedUser!?._id, storedUser!?.roles);

    const res = await request(app)
      .get(`/tareas/tareas`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
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
