# Setup del proyecto

## Requisitos

Antes de comenzar, instala:

* [Bun](https://bun.sh/) → runtime del proyecto
* [pnpm](https://pnpm.io/) → gestor de paquetes

> ⚠️ No usar `npm`.
>
> El proyecto usa **Bun** como runtime y **pnpm@11** como package manager para aprovechar mejoras de seguridad como `minimumReleaseAge`.

---

# Instalar Bun

## Linux / macOS

```bash
curl -fsSL https://bun.sh/install | bash
```

Verificar instalación:

```bash
bun --version
```

---

## Windows (PowerShell)

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Verificar instalación:

```powershell
bun --version
```

> Se recomienda ejecutar PowerShell como administrador.

---

# Instalar pnpm

## Opción recomendada: Corepack

### Linux / macOS

```bash
corepack enable
corepack prepare pnpm@11.0.0 --activate
```

### Windows (PowerShell)

```powershell
corepack enable
corepack prepare pnpm@11.0.0 --activate
```

Verificar instalación:

```bash
pnpm --version
```

---

## Alternativa manual

### Linux / macOS

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Windows (PowerShell)

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

---

# Instalar dependencias

Desde la raíz del monorepo:

```bash
pnpm install
```

---

# Desarrollo

## 1. Levantar infraestructura

Inicia los servicios necesarios:

```bash
pnpm run docker:up
```

Esto levanta:

* PostgreSQL
* Redis

---

## 2. Ejecutar la API

```bash
bun dev --filter @4sports/api
```

La API estará disponible en:

```txt
http://localhost:4000
```

---

## 3. Ejecutar el entorno TUI

```bash
pnpm run dev:tui
```

---

# BetterAuth

## Documentación de rutas auth

BetterAuth expone automáticamente documentación OpenAPI para todas las rutas `/auth/*`.

Disponible en:

```txt
http://localhost:4000/auth/reference
```

Incluye documentación para:

* sign-up
* sign-in
* sign-out
* OAuth
* sesiones
* reset de contraseña
* etc.

Úsalo para verificar:

* body esperado
* headers requeridos
* parámetros
* respuestas

> Esta ruta se habilita mediante el plugin `openAPI()` en:
>
> ```txt
> src/shared/lib/auth.ts
> ```
