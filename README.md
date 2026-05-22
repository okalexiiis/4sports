## Instalar Bun Runtime

### Linux / macOS
```bash
curl -fsSL https://bun.sh/install | bash
```

Verificar instalación:
```bash
bun --version
```

---

### Windows (PowerShell)
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Verificar instalación:
```powershell
bun --version
```

> En Windows se recomienda usar PowerShell como administrador.

---

## Instalar pnpm

### Linux / macOS
```bash
# Habilitar Corepack
corepack enable
corepack prepare pnpm@11.0.0 --activate
```

Alternativa:
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

---

### Windows (PowerShell)
```powershell
# Habilitar Corepack
corepack enable
corepack prepare pnpm@11.0.0 --activate
```

Alternativa:
```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

- **No usar npm**
- **Usar pnpm** (gestor de paquetes).  
  El runtime de la aplicación sigue siendo **Bun**; solo usamos `pnpm@11` como gestor de paquetes para aprovechar `minimumReleaseAge` y mejoras de seguridad.

---

## Instalación de dependencias

```bash
pnpm install
```

---

## Ejecutar en desarrollo

Desde la raíz del monorepo:

```bash
pnpm -w run dev
```