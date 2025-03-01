import express from 'express';
import passport from 'passport';

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(passport.initialize());

// Exportar para usar en index.ts
export default app;