# Frontend Dev Guide — Garib & Ivan

---

## 1. Levantar el entorno

Siempre necesitas la infra corriendo primero:

```bash
pnpm run docker:up   # Postgres + Redis
```

Luego, en terminales separadas:

```bash
# Web (Next.js 16, Turbopack)
bun run dev:web
# → http://localhost:3000

# Mobile (Expo)
bun run dev:mobile
# → Abre Expo Dev Client, escanea QR con la app
```

> **Mobile en dispositivo físico:** Expo usa la IP de tu máquina en la red local, no `localhost`. Si la conexión falla, verifica que tu teléfono y tu laptop estén en la misma red WiFi.

---

## 2. API — Dónde está y cómo se usa

### Base URL

| Entorno | URL |
|---|---|
| Local (web) | `http://localhost:3000` |
| Local (mobile, dispositivo físico) | `http://<IP-de-tu-máquina>:3300` |
| Producción | Definida en variables de entorno |

### Autenticación

La API usa cookies de sesión gestionadas por BetterAuth. Al hacer sign-in con `POST /auth/sign-in/email`, el servidor devuelve la cookie `better-auth.session_token` que el browser/cliente envía automáticamente en cada request siguiente.

- **Web:** las cookies se manejan solas con `fetch` + `credentials: 'include'`
- **Mobile:** necesitas persistir y reenviar la cookie manualmente (usa una librería como `expo-secure-store` o el cliente de BetterAuth para React Native)

### Documentación interactiva

| URL | Qué tiene |
|---|---|
| `http://localhost:4000/openapi` | Swagger de todos los endpoints `/v1` del equipo |
| `http://localhost:4000/auth/reference` | OpenAPI generado por BetterAuth — sign-up, sign-in, OAuth, sesión, etc. |

Úsalos para ver exactamente qué body enviar y qué respuesta esperar.

---

## 3. Stack de estilos

### Mobile — NativeWind v4 + Tailwind v3

La app mobile usa **NativeWind v4** con **Tailwind v3** (no v4 — esa combinación no es estable aún). Escribe clases directamente en `className`:

```tsx
<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-2xl font-bold text-primary-500">4Sports</Text>
</View>
```

**Tokens de color definidos** en `apps/mobile/tailwind.config.js`:

| Token | Valor |
|---|---|
| `primary-50` | `#f0f9ff` |
| `primary-100` | `#e0f2fe` |
| `primary-400` | `#38bdf8` |
| `primary-500` | `#0ea5e9` |
| `primary-600` | `#0284c7` |
| `primary-900` | `#0c4a6e` |

Para agregar colores o tokens nuevos, edita `theme.extend` en ese archivo.

### Web — Next.js 16 App Router

Tailwind estándar. Misma lógica de clases. El App Router usa el directorio `src/app/` — cada `page.tsx` es una ruta.

---

## 4. `packages/ui` — Componentes compartidos

El paquete `@4sports/ui` (en `packages/ui/`) contiene los componentes que usan tanto web como mobile.

```
packages/ui/src/
└── index.ts    ← exporta todos los componentes
```

**Regla para Ivan:** antes de crear cualquier componente, revisa si ya existe en `packages/ui`. Si no existe, habla con Garib antes de crearlo.

**Regla para Garib:** cualquier componente en `packages/ui` es código compartido — afecta a web y mobile al mismo tiempo. Nombres consistentes, sin atajos, código limpio.

Para importar desde cualquier app:

```tsx
import { ButtonPrimary, Card } from '@4sports/ui'
```

---

## 5. Navegación — Expo Router (Mobile)

Mobile usa **Expo Router v4** — navegación basada en el sistema de archivos, igual que Next.js App Router.

```
apps/mobile/src/app/
├── _layout.tsx     ← layout raíz (Stack sin header)
├── index.tsx       ← pantalla home "/"
├── (auth)/         ← grupo sin segmento en URL
│   ├── sign-in.tsx
│   └── sign-up.tsx
└── tournament/
    └── [id].tsx    ← ruta dinámica "/tournament/:id"
```

Cada archivo `.tsx` dentro de `app/` es automáticamente una ruta. Usa `<Link href="/tournament/123">` o `router.push('/tournament/123')` para navegar.

---

## 6. Antes de hacer push

```bash
git fetch origin
git rebase origin/development
pnpm install
git add pnpm-lock.yaml
bun check    # lint + format + imports (Biome)
```
