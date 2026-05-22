import { Elysia } from "elysia";
import {auth} from "@/shared/lib/auth"
// ... otros módulos

const app = new Elysia()
  // Montar todas las rutas de BetterAuth en /auth/*
  .all("/auth/*", async (ctx) => {
    return auth.handler(ctx.request);
  })
  // Tus rutas de negocio
  .listen(process.env.PORT ?? 4000);

console.log(`🚀 API corriendo en ${app.server?.hostname}:${app.server?.port}`);

