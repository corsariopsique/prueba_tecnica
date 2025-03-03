import swaggerJSDoc from "swagger-jsdoc";
import { writeFileSync } from "fs";
import { options } from "./swagger"; // Ajusta la ruta según tu proyecto

const swaggerSpec = swaggerJSDoc(options);
writeFileSync("swagger.json", JSON.stringify(swaggerSpec, null, 2));
console.log("✅ swagger.json generado!");
