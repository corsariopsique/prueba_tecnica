```markdown
# Prueba Técnica Instaleap

Este es un proyecto de prueba técnica desarrollado con **TypeScript** y **Node.js**. El objetivo de este proyecto es demostrar buenas prácticas en el desarrollo backend, el uso de tipado fuerte y la integración de herramientas modernas de desarrollo en JavaScript/TypeScript.

## Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Crea variables de entorno](#crea-variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)



## Características

- **TypeScript:** Aprovecha el tipado estático para mejorar la calidad y mantenibilidad del código.
- **Node.js:** Servidor backend robusto y escalable.
- **Buenas Prácticas:** Organización modular del código y separación de responsabilidades.
- **Testing:** Configuración inicial para pruebas unitarias (si aplica).
- **Documentación:** README detallado para facilitar el entendimiento y colaboración.

## Requisitos

- [Node.js](https://nodejs.org/) v14 o superior.
- [TypeScript](https://www.typescriptlang.org/)
- [npm](https://www.npmjs.com/) 

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/corsariopsique/prueba_tecnica.git
   cd prueba-tecnica
   ```

2. **Instalar las dependencias:**

   Con npm:
   ```bash
   npm install
   ```

   O con Yarn:
   ```bash
   yarn install
   ```

## Uso

Para iniciar el proyecto en modo desarrollo:

```bash
npm run dev
```

O, si utilizas Yarn:

```bash
yarn dev
```

## Estructura del Proyecto

```
prueba_tecnica/
├── src/                     # Código fuente del proyecto
│   ├── config/              # Archivos de configuracion del servicio
│   ├── errors/              # Clases para la gestion de errores centralizada
│   ├── interfaces/          # Interfaces de los modelos
│   ├── middleware/          # Middleware de gestion Auth, JWT, Errors
│   ├── models/              # Definición de modelos y esquemas
│   ├── routes/              # Definición de rutas
│   ├── services/            # Lógica de negocio y servicios
│   ├── utils/               # paquetes de utilidades (Logger)
│   ├── swagger-generator/   # script generador de swagger.json
│   └── index.ts             # Archivo principal de arranque
├── tests/                   # Pruebas unitarias y de integración
├── package.json             # Configuración de dependencias y scripts
├── tsconfig.json            # Configuración del compilador TypeScript
├── swagger.json             # Esquema documentacion APIs
├── typedoc.json             # Esquema documentacion JSDoc
└── README.md                # Este archivo
```

## Crea variables de entorno:
   ```bash
   PORT=(numero de puerto de salida)
   MONGODB_URL=(url de la base de datos)
   JWT_SECRET={llave de encriptación (HS256)} (Gestión tokens JWT)
   JWT_EXPIRES_IN=(Tiempo de expiracion del token) 
   NODE_ENV=(Entorno de ejecucion{"development","production"})
   ```   


## Scripts Disponibles

En el archivo `package.json` se incluyen algunos scripts útiles:

- `npm run dev` o `yarn dev`: Inicia el servidor en modo desarrollo.
- `npm run build` o `yarn build`: Compila el código TypeScript a JavaScript.
- `npm run start` o `yarn start`: Inicia la aplicación en modo producción (asegúrate de haber compilado previamente).
- `npm run test` o `yarn test`: Ejecuta las pruebas (si están configuradas).
- `npm run generate:swagger`: Genera swagger.json para el esquema de documentacion APIs