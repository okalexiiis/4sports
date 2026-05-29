# Equipo

## Quiénes somos y qué hace cada quien

### Alexis — Backend · Arquitectura · Tech lead
Crea y mantiene la base del proyecto. Es el filtro de calidad: todo PR pasa por él antes de entrar a `main`.

- Estructura del monorepo y configuración de CI
- Base de datos: schema, migraciones, seeds
- Módulos críticos de la API: auth, torneos, standings
- Configuración de servicios: Railway, Cloudflare, R2
- Revisión de todos los PRs

### Josue — Backend support
Implementa rutas y endpoints sobre la base que Alexis define.

- Rutas CRUD de módulos secundarios (equipos, jugadores, partidos)
- Conectar rutas con los servicios y repositorios ya definidos
- Validaciones de los endpoints que implemente

> Si tienes dudas sobre cómo funciona algo en la API, pregunta antes de hacer push. El Hito 0 es el momento de aprender el flujo de trabajo.

### Garib — Frontend lead · Web + Mobile
El mejor ojo de diseño del equipo. Dueño del sistema de componentes compartidos.

- Pantallas principales en web y mobile
- Paquete `packages/ui/` — componentes base que Ivan también usa
- Design tokens: colores, tipografía, espaciados

> Todo lo que construyas en `ui/` lo usa el resto del equipo. Trata ese paquete como un producto dentro del producto: código limpio, nombres consistentes, sin atajos.

### Ivan — Frontend support
Construye sobre lo que Garib define.

- Pantallas secundarias: listado de torneos, búsqueda, onboarding
- Assets: íconos, ilustraciones, estados vacíos, skeletons

> Antes de crear cualquier componente nuevo, revisa si ya existe en `packages/ui/`. Si no existe, habla con Garib primero.
