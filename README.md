Instalar Bun
```bash
# Linux / macOS (recommended via Corepack)
corepack enable
corepack prepare pnpm@11.0.0 --activate

# Alternatively install pnpm directly
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

- **No usar npm**
- **Usar pnpm** (gestor de paquetes). El runtime de la aplicación sigue siendo Bun; solo cambiamos el gestor de paquetes a `pnpm@11` para aprovechar `minimumReleaseAge` y mejoras de seguridad.

Instalación local de dependencias:
```bash
pnpm install
```

Ejecutar en desarrollo (desde la raíz):
```bash
pnpm -w run dev
```
