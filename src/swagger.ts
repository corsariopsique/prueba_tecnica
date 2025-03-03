import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Prueba Tecnica Instaleap",
      version: "1.0.0",
      description: "Documentación de API para manejo de usuarios",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
      {
        url: "https://prueba-tecnica-fos4.onrender.com",
        description: "Produccion",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "67c33824326cb76fdfb91434",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              example: "john@example.com",
            },
            password: {
              type: "string",
              example: "secretpassword",
            },
            roles: {
              type: "string",
              example: ["admin", "user", "editor"],
            },
            edad: {
              type: "number",
              example: 20,
            },
          },
        },
        Tarea: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "67c33824326cb76fdfb91434",
            },
            titulo: {
              type: "string",
              example: "Tarea # 1",
            },
            descripcion: {
              type: "string",
              example: "Esta es la tarea # 1",
            },
            fecha_vencimiento: {
              format: "date",
              type: "string",
              example: "2025-03-05",
            },
            estado: {
              type: "string",
              example: ["Pendiente", "Completada", "Cancelada"],
              items: {
                type: "string",
              },
            },
            usuario: {
              $ref: "#/components/schemas/Usuario",
              example: "67c33824326cb76fdfb91434",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
