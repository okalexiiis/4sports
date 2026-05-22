# 4Sports — Design System

> Referencia viva del sistema de diseño. Cualquier cambio a tokens, componentes o patrones se documenta aquí primero, luego se implementa.

---

## Índice

1. [Principios](#1-principios)
2. [Temas: Dark y Light](#2-temas-dark-y-light)
3. [Color](#3-color)
4. [Tipografía](#4-tipografía)
5. [Espaciado y layout](#5-espaciado-y-layout)
6. [Bordes y radios](#6-bordes-y-radios)
7. [Iconografía](#7-iconografía)
8. [Componentes](#8-componentes)
9. [Estados de feedback](#9-estados-de-feedback)
10. [Animación y movimiento](#10-animación-y-movimiento)
11. [Accesibilidad](#11-accesibilidad)
12. [Tokens CSS — referencia rápida](#12-tokens-css--referencia-rápida)

---

## 1. Principios

### Industrial deportiva
4Sports vive en el mundo real de las canchas municipales: árbitros registrando resultados desde el teléfono bajo el sol, organizadores revisando pagos entre partido y partido. La UI no es un app de bienestar ni un dashboard corporativo. Es herramienta.

### Tres reglas de oro
- **Jerarquía sobre decoración.** Cada elemento en pantalla tiene un rango. El número del marcador es más importante que el nombre de la cancha. La UI refleja eso.
- **Oscuro primero, claro como alternativa.** El tema dark es el diseño principal. El light es una adaptación fiel, no una versión de menor calidad.
- **Velocidad de lectura.** Un árbitro tiene 10 segundos para registrar un gol. Tipografía grande, contraste alto, zonas táctiles generosas.

---

## 2. Temas: Dark y Light

El sistema soporta dos temas completos. El switch se activa por el usuario y se persiste en preferencias.

```
Tema dark  → fondo #0D0F0C  (principal, el diseño canónico)
Tema light → fondo #F7F6F2  (alternativa, igual de completo)
```

Cada token de color tiene valor en ambos temas. **No existe un color hardcodeado** fuera del archivo de tokens. Todo va por variable CSS o equivalente en el framework.

### Implementación

```css
/* Raíz del documento */
:root { /* valores dark por defecto */ }
[data-theme="light"] { /* overrides light */ }

/* O vía clase en el elemento raíz */
.theme-dark { ... }
.theme-light { ... }
```

En React Native / Expo: usar un `ThemeContext` que expone el objeto de tokens activo.

---

## 3. Color

### 3.1 Paleta de marca

Dos colores de acento. Solo dos. No hay un tercero.

| Nombre | Rol | Dark | Light |
|--------|-----|------|-------|
| **Volt** | Acción primaria, primeros lugares, éxito deportivo | `#D4F233` | `#5A8A00` |
| **Ember** | Urgencia, en vivo, alertas deportivas | `#FF4B1F` | `#C93A12` |

> **Por qué dos valores distintos por tema:** El amarillo-lima `#D4F233` es perfectamente legible sobre negro pero desaparece sobre blanco. En light mode, Volt baja a un verde deportivo que conserva la energía sin sacrificar contraste WCAG AA (ratio ≥ 4.5:1 sobre blanco).

### 3.2 Tokens de superficie

| Token | Dark | Light | Uso |
|-------|------|-------|-----|
| `--bg` | `#0D0F0C` | `#F7F6F2` | Fondo de página |
| `--surface` | `#141610` | `#F0EFE9` | Fondos de secciones, sidebars |
| `--card` | `#1A1D1A` | `#FFFFFF` | Tarjetas, modales, dropdowns |
| `--card-2` | `#212420` | `#F7F6F2` | Fondos secundarios dentro de cards |

### 3.3 Tokens de texto

| Token | Dark | Light | Uso |
|-------|------|-------|-----|
| `--ink` | `#F2F2EF` | `#141510` | Títulos, marcadores, texto principal |
| `--body` | `#C8CBC4` | `#2E3128` | Texto de cuerpo |
| `--muted` | `#8C8F89` | `#6B6F62` | Texto secundario, labels |
| `--faint` | `#555955` | `#9DA19A` | Placeholders, timestamps, texto deshabilitado |

### 3.4 Tokens de borde

| Token | Dark | Light | Uso |
|-------|------|-------|-----|
| `--line` | `rgba(242,242,239,0.08)` | `rgba(20,21,16,0.09)` | Bordes de cards y separadores |
| `--line-2` | `rgba(242,242,239,0.14)` | `rgba(20,21,16,0.18)` | Bordes de inputs, énfasis |

### 3.5 Colores semánticos

Los colores semánticos cubren cuatro estados del sistema. Cada uno tiene tres valores: el color puro (para texto e iconos), el fondo tenue (para banners y badges), y el borde (para inputs en ese estado).

#### Success — confirmación, completado, primero
| Token | Dark | Light |
|-------|------|-------|
| `--success` | `#4CAF72` | `#2E7D4F` |
| `--success-bg` | `rgba(76,175,114,0.12)` | `#EAF5EF` |
| `--success-border` | `rgba(76,175,114,0.35)` | `rgba(46,125,79,0.35)` |

#### Danger — error, pago vencido, eliminado
| Token | Dark | Light |
|-------|------|-------|
| `--danger` | `#FF4B1F` | `#C93A12` |
| `--danger-bg` | `rgba(255,75,31,0.12)` | `#FDEEE9` |
| `--danger-border` | `rgba(255,75,31,0.35)` | `rgba(201,58,18,0.35)` |

> Nota: `--danger` comparte valor con `--ember` en ambos temas. Son el mismo color — Ember es el nombre de marca, Danger es el rol semántico.

#### Warning — cobro pendiente, conflicto de horario, advertencia
| Token | Dark | Light |
|-------|------|-------|
| `--warn` | `#F5A623` | `#A0640A` |
| `--warn-bg` | `rgba(245,166,35,0.12)` | `#FDF3E3` |
| `--warn-border` | `rgba(245,166,35,0.35)` | `rgba(160,100,10,0.35)` |

#### Info — notificaciones, solicitudes, neutral informativo
| Token | Dark | Light |
|-------|------|-------|
| `--info` | `#4A9EE8` | `#1A5FA0` |
| `--info-bg` | `rgba(74,158,232,0.12)` | `#EAF2FB` |
| `--info-border` | `rgba(74,158,232,0.35)` | `rgba(26,95,160,0.35)` |

### 3.6 Tints de marca

Para fondos de badges, iconos y highlights de fila.

| Token | Dark | Light |
|-------|------|-------|
| `--volt-bg` | `rgba(212,242,51,0.12)` | `#EEF7D0` |
| `--volt-text` (texto sobre volt sólido) | `#0D0F0C` | `#FFFFFF` |
| `--ember-bg` | `rgba(255,75,31,0.12)` | `#FDEEE9` |
| `--ember-text` (texto sobre ember sólido) | `#FFFFFF` | `#FFFFFF` |

### 3.7 Reglas de uso de color

- **Nunca poner texto `--ink` sobre un fondo de color.** Siempre usar el token semántico del mismo color (ej: texto verde sobre fondo verde-tenue usa `--success`, no `--ink`).
- **Volt sólido como CTA.** Solo en botones primarios y acciones de primera importancia.
- **Ember/Danger para urgencia real.** No usar para decoración. Si algo está en ember, el usuario debe atenderlo.
- **Warning para pendiente, no para error.** Un cobro que lleva 3 días sin pagar es warning. Uno que bloqueó al equipo es danger.
- **Info para contexto.** Solicitudes de ingreso, notificaciones de sistema, estados intermedios.

---

## 4. Tipografía

### 4.1 Familias

| Familia | Variable | Uso |
|---------|----------|-----|
| **Bebas Neue** | `--ff-display` | Marcadores, títulos de torneo, números de estadística, nombres de equipo en headers |
| **DM Sans** | `--ff-body` | Todo lo demás: body, labels, inputs, navegación, botones |

```css
--ff-display: 'Bebas Neue', serif;
--ff-body:    'DM Sans', sans-serif;
```

Bebas Neue se carga desde Google Fonts. DM Sans también. Ambas son open source.

### 4.2 Escala tipográfica

| Nombre | Tamaño | Peso | Familia | Letter-spacing | Uso |
|--------|--------|------|---------|----------------|-----|
| **Display XL** | 80–88px | 400 | Display | 2px | Wordmark, splash screens |
| **Display L** | 48–56px | 400 | Display | 1px | Marcadores en vivo, estadísticas hero |
| **Display M** | 28–36px | 400 | Display | 0.5px | Títulos de sección grandes, nombres de equipo |
| **Display S** | 18–20px | 400 | Display | 0.5px | Resultados en listas, nombres en bracket |
| **Heading** | 15–16px | 500 | Body | 0.3px | Títulos de card, encabezados de sección |
| **Body** | 13–14px | 400 | Body | 0 | Texto general, descripciones |
| **Body light** | 13–14px | 300 | Body | 0 | Texto de apoyo, narrativa, párrafos largos |
| **Label** | 11–12px | 500 | Body | 0.3px | Labels de form, metadatos de partido |
| **Caption** | 10–11px | 400–500 | Body | 1–2px | Timestamps, overlines, categorías |
| **Overline** | 10px | 500 | Body | 2.5–3px + uppercase | Etiquetas de sección, column headers |

### 4.3 Reglas

- **Bebas Neue solo para información de alto impacto.** No para body text, labels, o mensajes de error.
- **DM Sans en tres pesos:** 300 (narrativa), 400 (UI general), 500 (énfasis y labels). No usar 600 ni 700 — resultan pesados en este sistema.
- **Overlines siempre en uppercase con letter-spacing amplio** (`text-transform: uppercase; letter-spacing: 2.5px`).
- **Line-height:** 1 para display, 1.5 para UI compacta, 1.7 para body text largo.
- **No escalar Bebas Neue por debajo de 16px** — pierde legibilidad.

### 4.4 Jerarquía visual en pantalla

```
[Overline — 10px/500/uppercase/faint]
[Título display — Bebas Neue 28–36px/ink]
[Subtítulo — 14px/500/body]
[Cuerpo — 13px/300 o 400/muted]
[Caption / timestamp — 10–11px/faint]
```

---

## 5. Espaciado y layout

### 5.1 Escala de espaciado

Basada en múltiplos de 4px.

| Token | Valor | Uso típico |
|-------|-------|------------|
| `--space-1` | 4px | Gap mínimo entre elementos inline |
| `--space-2` | 8px | Gap interno de componentes pequeños |
| `--space-3` | 12px | Gap entre items de lista, padding de badge |
| `--space-4` | 16px | Padding interno de cards pequeñas |
| `--space-5` | 20px | Padding de página, separación entre secciones |
| `--space-6` | 24px | Margen entre tarjetas |
| `--space-8` | 32px | Separación entre bloques de contenido |
| `--space-10` | 40px | Padding de secciones principales |
| `--space-12` | 48px | Altura de navbar |

### 5.2 Layout de página

```
Navbar: 48px height, fondo card, border-bottom line
Content: padding 20px horizontal, 20px top
Max-width de contenido en pantallas grandes: 1280px centrado
Sidebar (si aplica): 220px fija, resto al content
```

### 5.3 Grid interno

Las páginas de dashboard usan grid de 12 columnas con gap de 12px. Los componentes ocupan:

| Componente | Columnas |
|------------|----------|
| Stat card | 3 (4 en fila) |
| Card grande (partidos, standings) | 6 |
| Card extra grande | 8–9 |
| Full width | 12 |

En pantallas < 768px: todo a una columna.

### 5.4 Zonas táctiles (mobile)

Altura mínima de elemento interactivo: **44px**. En listas de partidos y standings, las filas tienen `min-height: 44px` para garantizar tap area adecuada.

---

## 6. Bordes y radios

### 6.1 Grosor de borde

Siempre `0.5px`. No `1px`. El sistema es limpio y los bordes finos comunican precisión.

```css
border: 0.5px solid var(--line);        /* cards, contenedores */
border: 0.5px solid var(--line-2);      /* inputs, elementos interactivos */
border: 2px solid var(--volt);          /* excepción: card destacada / "most popular" */
```

### 6.2 Radio de esquina

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 3–4px | Badges, pills, esquinas de tabla |
| `--radius-md` | 6–8px | Inputs, botones, componentes pequeños |
| `--radius-lg` | 10–12px | Cards, modales, paneles |
| `--radius-xl` | 16px | Sheets de mobile, modales grandes |
| `--radius-full` | 9999px | Avatares, dots de estado, toggles |

### 6.3 Reglas de radio

- **Nunca radio en bordes de un solo lado.** Un `border-left` con `border-radius` es incorrecto. Radio solo cuando el borde rodea todo el elemento.
- **Cards siempre `--radius-lg`.** Nunca cuadradas.
- **Inputs `--radius-md`.** Consistencia en todo el sistema.
- **Badges y pills `--radius-sm` (3px).** No redondos — el estilo es más industrial que amigable.

---

## 7. Iconografía

### 7.1 Librería

**Tabler Icons — outline exclusivamente.** 5,800+ iconos. No usar variantes filled.

```html
<i class="ti ti-trophy" aria-hidden="true"></i>
```

### 7.2 Tamaños

| Contexto | Tamaño | Notas |
|----------|--------|-------|
| Inline en texto | 14–16px | Alineado con `vertical-align: -2px` |
| Iconos de UI (nav, botones) | 18–20px | |
| Iconos decorativos en cards | 20–24px | Máximo decorativo |
| Iconos en empty states | 32–40px | Con color `--faint` |

### 7.3 Contenedores de icono

Para iconos en cards y notificaciones: cuadrado de 32–42px, `border-radius: 6–8px`, fondo semántico.

```css
/* Ejemplo: icono de torneo */
.icon-box {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: var(--volt-bg);
  color: var(--volt);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
```

### 7.4 Iconos por módulo

| Módulo | Icono |
|--------|-------|
| Torneos | `ti-trophy` |
| Equipos | `ti-users-group` |
| Partidos | `ti-ball-football` |
| Estadísticas | `ti-chart-bar` |
| Agenda / calendario | `ti-calendar` |
| Canchas | `ti-map-pin` |
| Cobros | `ti-receipt` |
| Notificaciones | `ti-bell` |
| Roles / permisos | `ti-shield-check` |
| Jugadores | `ti-user` |
| Configuración | `ti-settings` |
| Árbitro | `ti-whistle` |
| Bracket | `ti-tournament` |
| Resultados | `ti-clipboard-check` |

---

## 8. Componentes

### 8.1 Navbar

```
Altura: 48px
Fondo: --card
Borde inferior: 0.5px solid --line
Logo: Bebas Neue 26px, "4" en --volt
Tabs de navegación: 12px/400/--muted, activo: 12px/500/--ink con border-bottom 2px --volt
```

### 8.2 Botones

Tres variantes principales:

| Variante | Fondo | Texto | Borde | Uso |
|----------|-------|-------|-------|-----|
| **Primary** | `--volt` | `--volt-text` | Ninguno | Acción principal de la página |
| **Ghost** | Transparente | `--muted` | `0.5px --line-2` | Acciones secundarias |
| **Danger** | `--danger-bg` | `--danger` | `0.5px --danger-border` | Acciones destructivas |
| **Success** | `--success` | `#fff` | Ninguno | Confirmación explícita |

```css
/* Todos los botones */
font-family: var(--ff-body);
font-size: 12–13px;
font-weight: 500;
letter-spacing: 0.5–1px;
text-transform: uppercase;
padding: 9–11px 18–24px;
border-radius: var(--radius-md);
cursor: pointer;
```

### 8.3 Inputs y formularios

```css
/* Input base */
background: var(--card-2);
border: 0.5px solid var(--line-2);
border-radius: var(--radius-md);
padding: 9px 12px;
font-family: var(--ff-body);
font-size: 13px;
color: var(--ink);

/* Estados */
:focus    → border-color: var(--volt)
.success  → border-color: var(--success); background: var(--success-bg)
.error    → border-color: var(--danger); background: var(--danger-bg)
:disabled → opacity: 0.45; cursor: not-allowed
```

**Labels:** 11px/500/--muted, encima del input, gap 5px.

**Mensajes de ayuda:** 11px/400/--faint, debajo del input.

**Mensajes de error:** 11px/400/--danger, con icono `ti-alert-circle` a 12px.

**Mensajes de éxito:** 11px/400/--success, con icono `ti-check` a 12px.

### 8.4 Cards

```css
background: var(--card);
border: 0.5px solid var(--line);
border-radius: var(--radius-lg);
overflow: hidden;

/* Card header */
.card-head {
  padding: 14px 16px;
  border-bottom: 0.5px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Card body */
.card-body {
  padding: 14px 16px;
}
```

### 8.5 Badges y pills

```css
/* Base */
display: inline-flex;
align-items: center;
gap: 4px;
font-size: 10px;
font-weight: 500;
letter-spacing: 1px;
text-transform: uppercase;
padding: 3px 8px;
border-radius: var(--radius-sm);

/* Variantes */
.pill-volt    { background: var(--volt-bg);    color: var(--volt);    }
.pill-ember   { background: var(--ember-bg);   color: var(--ember);   }
.pill-success { background: var(--success-bg); color: var(--success); }
.pill-warn    { background: var(--warn-bg);    color: var(--warn);    }
.pill-info    { background: var(--info-bg);    color: var(--info);    }
.pill-neutral { background: var(--card-2);     color: var(--faint);
                border: 0.5px solid var(--line); }
```

### 8.6 Tabla de posiciones (standings)

```
Header de columnas: 9px/500/uppercase/--faint, border-bottom --line
Fila normal: 12px/400/--muted para celdas, 13px/400/--body para nombre de equipo
Fila líder (#1): fondo --volt-bg, pts en --volt
Celda Pts: 13px/500/--ink
Borde entre filas: 0.5px --line
Números: font-variant-numeric: tabular-nums
```

### 8.7 Match card / fila de partido

```
Hora: 11px/400/--faint
Nombre equipo ganador: 12px/500/--ink
Nombre equipo perdedor: 12px/400/--muted
Marcador: Bebas Neue 20px/--ink, ganador en --volt
Badge de estado: pill semántico (live→ember, done→neutral, próximo→info)
```

### 8.8 Bracket

```
Columnas de ronda: min-width 148px, label 9px/500/uppercase/--faint
Match card: border 0.5px --line, border-radius 6px
Equipo ganador: fondo --volt-bg, texto --ink/500
Equipo perdedor: texto --faint/400
Partido en vivo: texto --ember
Pendiente / sin definir: opacidad 0.35–0.4
Conectores: líneas 2px --line
```

### 8.9 Notificaciones

```
Item leído: fondo --card, borde --line, sin acento lateral
Item no leído: border-left 2px en color semántico de la notif
  - Resultado deportivo → --volt
  - Pago vencido / error → --danger
  - Solicitud / info → --info
  - Éxito / aprobado → --success
  - Advertencia → --warn

Icono: caja 32px, border-radius 6px, fondo semántico
Título: 12px/500/--ink
Descripción: 11px/400/--muted, line-height 1.45
Timestamp: 10px/400/--faint
```

### 8.10 Stat cards (métricas)

```
Fondo: --card
Borde: 0.5px --line
Border-radius: 8px
Padding: 14px 16px
Label: 10px/500/uppercase/--faint, letter-spacing 1.5px
Número: Bebas Neue 36px/--ink
Delta positivo: 11px/--success
Delta negativo: 11px/--danger
```

### 8.11 Avatares

```
Tamaños: 24px (nav), 32px (lista), 44px (perfil)
Forma: circular (border-radius 50%)
Sin foto: iniciales en --volt-bg / texto --volt
Con foto: object-fit cover
```

---

## 9. Estados de feedback

### 9.1 Banners de formulario

Aparecen encima o debajo del formulario, nunca a mitad.

```css
/* Base */
border-radius: var(--radius-md);
padding: 10px 14px;
font-size: 12px;
display: flex;
align-items: flex-start;
gap: 8px;
border: 0.5px solid;

/* Variantes */
.banner-success { background: var(--success-bg); color: var(--success); border-color: var(--success-border); }
.banner-error   { background: var(--danger-bg);  color: var(--danger);  border-color: var(--danger-border);  }
.banner-warn    { background: var(--warn-bg);    color: var(--warn);    border-color: var(--warn-border);    }
.banner-info    { background: var(--info-bg);    color: var(--info);    border-color: var(--info-border);    }
```

Icono a 16px a la izquierda. Texto: `<strong>Título.</strong> Descripción opcional.`

### 9.2 Toast / notificación flotante

```
Posición: bottom-right en web, top en mobile
Ancho: 320px (web), full-width con margen 16px (mobile)
Duración: 4s (success), 6s (error — el usuario necesita leerlo)
Animación: slide-in desde abajo 200ms ease-out, fade-out 300ms
Mismo sistema de color que banners
```

### 9.3 Estados vacíos

```
Icono Tabler: 36px, color --faint
Título: 14px/500/--muted
Descripción: 13px/300/--faint
CTA (si aplica): botón primary o ghost
Centrado vertical y horizontal
Min-height: 200px
```

### 9.4 Estados de carga

```
Skeleton: fondo --card-2, border-radius igual al elemento real
Animación: shimmer sutil (opacity 0.5→1→0.5, 1.5s infinite)
Spinner: solo cuando no se puede usar skeleton (operaciones puntuales)
Color del spinner: --volt
```

### 9.5 Indicador "En vivo"

```css
.live-dot {
  width: 6px; height: 6px;
  background: var(--ember);
  border-radius: 50%;
  animation: live-pulse 1.4s ease-in-out infinite;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.25; }
}
```

Siempre acompañado del texto "En vivo" en `--ember`. Nunca solo el dot.

---

## 10. Animación y movimiento

### 10.1 Principios

- **Funcional, no decorativa.** Las animaciones comunican estado, no entretienen.
- **Rápidas.** El usuario no esperará que termine una transición para interactuar.
- **Reducción de movimiento.** Respetar `prefers-reduced-motion`.

### 10.2 Duraciones

| Tipo | Duración | Easing |
|------|----------|--------|
| Micro-interacciones (hover, focus) | 100–150ms | ease |
| Transiciones de tema | 250ms | ease |
| Modales / sheets | 200ms | ease-out |
| Toasts | 200ms in / 300ms out | ease-out / ease-in |
| Skeletons | 1.5s | ease-in-out, infinite |
| Live pulse | 1.4s | ease-in-out, infinite |

### 10.3 Reglas

- **No animar layout properties** (width, height, padding). Solo `transform` y `opacity`.
- **El botón primary tiene `scale(0.97)` en `:active`** — feedback táctil inmediato.
- **Theme switch no flashea.** La transición `background 250ms, color 250ms` evita el destello.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Accesibilidad

### 11.1 Contraste

| Par de colores | Ratio mínimo | Nivel |
|----------------|-------------|-------|
| Texto body sobre fondos | 4.5:1 | AA |
| Texto grande (18px+) | 3:1 | AA Large |
| Iconos interactivos | 3:1 | AA |

Todos los tokens del sistema pasan AA en ambos temas. Verificar siempre con [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) al agregar combinaciones nuevas.

### 11.2 Focus

```css
/* Focus ring en inputs y elementos interactivos */
:focus-visible {
  outline: 2px solid var(--volt);
  outline-offset: 2px;
}
```

Nunca `outline: none` sin reemplazar con un focus visible equivalente.

### 11.3 Semántica

- Iconos decorativos llevan `aria-hidden="true"`.
- Iconos que comunican estado llevan `aria-label` descriptivo.
- Botones de icono sin texto visible: `aria-label` obligatorio.
- Tablas de datos: `<thead>` con `<th scope="col">`.
- Notificaciones: `role="status"` (toasts no urgentes) o `role="alert"` (errores).

### 11.4 Touch targets (mobile)

Mínimo 44×44px para cualquier elemento interactivo. En listas densas, usar padding vertical para alcanzar el mínimo aunque el texto sea pequeño.

---

## 12. Tokens CSS — referencia rápida

Copiar en la raíz del proyecto y extender con el selector `[data-theme="light"]`.

```css
:root {
  /* Tema: DARK (por defecto) */

  /* Fuentes */
  --ff-display: 'Bebas Neue', serif;
  --ff-body:    'DM Sans', sans-serif;

  /* Superficie */
  --bg:       #0D0F0C;
  --surface:  #141610;
  --card:     #1A1D1A;
  --card-2:   #212420;

  /* Texto */
  --ink:   #F2F2EF;
  --body:  #C8CBC4;
  --muted: #8C8F89;
  --faint: #555955;

  /* Bordes */
  --line:   rgba(242,242,239,0.08);
  --line-2: rgba(242,242,239,0.14);

  /* Marca */
  --volt:      #D4F233;
  --volt-bg:   rgba(212,242,51,0.12);
  --volt-text: #0D0F0C;
  --ember:     #FF4B1F;
  --ember-bg:  rgba(255,75,31,0.12);
  --ember-text:#FFFFFF;

  /* Semántico: success */
  --success:        #4CAF72;
  --success-bg:     rgba(76,175,114,0.12);
  --success-border: rgba(76,175,114,0.35);

  /* Semántico: danger */
  --danger:        #FF4B1F;
  --danger-bg:     rgba(255,75,31,0.12);
  --danger-border: rgba(255,75,31,0.35);

  /* Semántico: warning */
  --warn:        #F5A623;
  --warn-bg:     rgba(245,166,35,0.12);
  --warn-border: rgba(245,166,35,0.35);

  /* Semántico: info */
  --info:        #4A9EE8;
  --info-bg:     rgba(74,158,232,0.12);
  --info-border: rgba(74,158,232,0.35);

  /* Espaciado */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Radios */
  --radius-sm:   3px;
  --radius-md:   6px;
  --radius-lg:   10px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  /* Transiciones */
  --transition-fast:   100ms ease;
  --transition-base:   150ms ease;
  --transition-theme:  250ms ease;
  --transition-modal:  200ms ease-out;
}

[data-theme="light"] {
  /* Superficie */
  --bg:       #F7F6F2;
  --surface:  #F0EFE9;
  --card:     #FFFFFF;
  --card-2:   #F7F6F2;

  /* Texto */
  --ink:   #141510;
  --body:  #2E3128;
  --muted: #6B6F62;
  --faint: #9DA19A;

  /* Bordes */
  --line:   rgba(20,21,16,0.09);
  --line-2: rgba(20,21,16,0.18);

  /* Marca */
  --volt:      #5A8A00;
  --volt-bg:   #EEF7D0;
  --volt-text: #FFFFFF;
  --ember:     #C93A12;
  --ember-bg:  #FDEEE9;
  --ember-text:#FFFFFF;

  /* Semántico: success */
  --success:        #2E7D4F;
  --success-bg:     #EAF5EF;
  --success-border: rgba(46,125,79,0.35);

  /* Semántico: danger */
  --danger:        #C93A12;
  --danger-bg:     #FDEEE9;
  --danger-border: rgba(201,58,18,0.35);

  /* Semántico: warning */
  --warn:        #A0640A;
  --warn-bg:     #FDF3E3;
  --warn-border: rgba(160,100,10,0.35);

  /* Semántico: info */
  --info:        #1A5FA0;
  --info-bg:     #EAF2FB;
  --info-border: rgba(26,95,160,0.35);

  /* Espaciado y radios: sin cambios */
}
```

---

## Preguntas frecuentes del equipo

**¿Puedo usar un color que no está en los tokens?**
No. Si hace falta un nuevo tono, se propone aquí primero, se revisa con el equipo, y se agrega como token con nombre. Los valores hardcodeados rompen el sistema de temas.

**¿Cuándo usar Bebas Neue vs DM Sans para un número?**
Si el número es el protagonista de la pantalla (marcador, stat principal, ranking), usa Bebas Neue. Si es parte de una oración o tabla de datos, usa DM Sans con `font-variant-numeric: tabular-nums`.

**¿Puedo agregar un color de acento nuevo?**
Solo con una razón muy sólida y aprobación del lead de diseño. El sistema tiene dos acentos por diseño. Agregar un tercero diluye la identidad.

**¿El `border: 0.5px` funciona en todos los browsers?**
Sí, desde 2019 en todos los browsers modernos. En displays de alta densidad (Retina) se ve más fino que `1px` y es parte de la estética del sistema.

**¿Qué pasa con Tailwind?**
Los tokens de esta guía se mapean directamente a `tailwind.config.js` bajo `theme.extend`. Ver `/packages/config/tailwind.base.js` para la implementación.

---

*Última actualización: Mayo 2025 — Hito 3 MVP*
*Maintainer: Garib (frontend lead)*
*Cambios al sistema deben pasar por PR con etiqueta `design-system`*
