4Sports — Product Requirements Document    v1.0  ·  Confidencial

**4SPORTS**

Product Requirements Document

*Plataforma de Gestión de Torneos y Ligas Deportivas*

Versión 1.0   ·   Mayo 2025

**Confidencial — Solo uso interno**

# **Tabla de Contenidos**

# **1. Resumen Ejecutivo**

4Sports es una plataforma SaaS de gestión de torneos y ligas deportivas diseñada para el mercado latinoamericano. Su propósito es reemplazar el flujo de trabajo artesanal (Excel, WhatsApp, libretas) de los organizadores locales con una herramienta profesional, intuitiva y automatizada.

## **1.1 Propuesta de valor**

La plataforma se diferencia del mercado en tres pilares:

- Formatos de competición reales: soporte nativo para torneos complejos (Fase de Grupos + Eliminatorias, doble eliminación, ligas con múltiples temporadas) que las plataformas actuales no resuelven.

- Automatización y reglas estrictas: validación automática de plantillas por categoría, género y edad; motor de elegibilidad configurable; sanciones automáticas.

- UX/UI de nivel 2026: interfaz moderna, limpia y usable desde el primer minuto, sin curva de aprendizaje para el organizador amateur.

## **1.2 Modelo de negocio**

SaaS puro de suscripción mensual/anual cobrada al organizador por organización. 4Sports no actúa como intermediario financiero en las transacciones entre equipos y organizadores. Las comisiones de pasarela de pago (Stripe / Mercado Pago) las absorbe el organizador directamente.

## **1.3 Estado del proyecto**

| **Hito** | **Descripción** | **Estado** |
| --- | --- | --- |
| Hito 0 | Monorepo + CI/CD | ✅ Completado |
| Hito 1 | Autenticación y roles | ⬜ En progreso |
| Hito 2 | Torneos y equipos | ⬜ Pendiente |
| Hito 3 ★ MVP | Partidos y resultados | ⬜ Pendiente |
| Hito 4 | Jugadores buscan equipos | ⬜ Pendiente |
| Hito 5 | Beta pública | ⬜ Pendiente |

# **2. Contexto y Usuarios**

## **2.1 Usuario objetivo — Fase 1**

El Early Adopter ideal es el organizador local y amateur apasionado: alguien que gestiona ligas o torneos locales, municipales o estatales con estructura seria (canchas propias o rentadas, árbitros, equipos recurrentes), pero que opera hoy con herramientas rudimentarias.

Su dolor principal es la fricción operativa: perseguir pagos por WhatsApp, validar inscripciones manualmente, armar fixtures en Excel y comunicar cambios de horario a decenas de personas.

## **2.2 Actores del ecosistema**

| **Actor** | **Prioridad MVP** | **Problema que resuelve 4Sports** |
| --- | --- | --- |
| Organizador | Core | Reemplaza Excel + WhatsApp con panel de control profesional |
| Capitán / Coach | Core | Centro de control del equipo: plantilla, convocatorias, historial |
| Jugador libre | Hito 4 | Conecta jugadores sin equipo con capitanes que buscan talento |
| Árbitro (perfil propio) | Post-MVP | Directorio profesional + herramienta de reporte en cancha |
| Fanático / Espectador | Post-MVP | Seguimiento en tiempo real de resultados y tablas |

*⚠ En el MVP, las funciones de arbitraje (anotar goles, tarjetas, resultados) las absorbe el organizador o el capitán desde sus respectivos paneles.*

# **3. Roles y Permisos**

El sistema usa un modelo híbrido: roles preconfigurados con scope delimitado en base de datos. Los permisos no son restricciones de UI — cada request al backend valida que el actor tenga acceso al recurso específico que intenta tocar.

## **3.1 Roles a nivel de Organización**

| **Rol** | **Descripción** | **Límite estricto** |
| --- | --- | --- |
| Owner | Dueño de la cuenta SaaS. Control total. | Único que puede cancelar suscripción o borrar la organización |
| Admin | Brazo derecho del Owner. Gestiona todos los torneos, canchas y finanzas. | Sin acceso a datos de facturación hacia 4Sports |

## **3.2 Roles a nivel de Torneo**

| **Rol** | **Scope** | **Puede hacer** | **Bloqueado** |
| --- | --- | --- | --- |
| Organizador local | Su torneo asignado | Horarios, marcadores, plantillas, pagos físicos | Ver finanzas globales, crear torneos, cambiar formato |
| Coach | Su equipo | Plantilla, alineaciones, convocatorias | Finanzas, otros equipos |
| Viewer | Lectura pública | Ver resultados y tablas | Cualquier modificación |

## **3.3 Reglas clave**

✓ Un usuario puede tener roles distintos en múltiples organizaciones simultáneamente (arquitectura multitenant).

✓ Al iniciar sesión, la app pregunta en qué perfil/organización desea operar el usuario.

✓ Un Organizador local recibe un 403 Forbidden automático al intentar acceder a recursos de otros torneos de la misma organización.

✓ El rol de Coach dentro de un equipo lo asigna el Capitán, no el Organizador.

# **4. Módulo: Torneos**

## **4.1 Filosofía de diseño**

Automatizado por defecto, editable por excepción. El objetivo es que un organizador pueda crear y publicar su primer torneo en menos de 5 minutos sin leer ningún manual.

## **4.2 Ciclo de vida del torneo**

| **Estado** | **Slug BD** | **Descripción** | **Quién puede verlo** |
| --- | --- | --- | --- |
| Borrador | draft | Configuración privada, simulable. Sin consecuencias públicas. | Solo el organizador |
| Privado | private | Publicado con acceso restringido por código o invitación. | Equipos con código |
| Inscripciones abiertas | open_registration | Equipos pueden solicitar inscripción. | Público |
| Activo | active | Torneo en curso. Partidos en progreso. | Público |
| Completado | completed | Torneo finalizado. Histórico público disponible. | Público |
| Archivado | archived | Accesible según plan del organizador. | Según plan |

## **4.3 Creación de torneos — Asistente guiado**

El flujo de creación opera en dos capas:

- Asistente inteligente: preguntas simples y conversacionales que generan automáticamente grupos, calendario y bracket.

- Ajustes avanzados: capa de edición manual disponible en todo momento para mover equipos entre grupos, cambiar horarios o modificar el bracket.

Preguntas clave del asistente:

- ¿Cuántos equipos participan?

- ¿Qué formato de competición? (Liga, Eliminación directa, Modo Mundial, etc.)

- ¿Cuántos equipos por grupo?

- ¿Cuántos clasifican por grupo?

## **4.4 Modo Borrador**

Todo torneo nace como borrador privado. En esta fase el organizador puede simular el torneo, generar brackets, probar combinaciones de grupos y hacer modificaciones sin consecuencias públicas.

Al hacer clic en "Publicar Oficialmente", el sistema:

- Congela la estructura base (formato, reglas, criterios de desempate).

- Abre el torneo al público según su configuración de privacidad.

- Activa notificaciones para los equipos inscritos.

- Habilita las herramientas de juego en tiempo real.

- Estampa el campo created_under_plan con el plan activo del organizador.

## **4.5 Estructura congelada vs. incidencias gestionables**

| **Categoría** | **Ejemplos** | **Editable post-publicación** |
| --- | --- | --- |
| Estructura (congelada) | Formato del torneo, criterios de desempate, número de grupos | No — protege la integridad de la competencia |
| Incidencias (gestionables) | Horarios, canchas, árbitros, resultados con corrección autorizada, bajas de equipos | Sí — con auditoría automática y notificación pública |

## **4.6 Transparencia post-publicación**

Cada modificación de datos oficiales post-publicación genera automáticamente tres acciones:

- Registro en audit_logs: actor, timestamp, datos antes/después.

- Actualización en tiempo real de tablas de posiciones e históricos.

- Notificación pública automática en el Tablón de Anuncios de la liga.

## **4.7 Baja de equipos en curso**

Si un equipo abandona el torneo durante la competencia, el organizador usa la función "Dar de baja". El sistema:

- Marca al equipo como dado de baja.

- Resuelve automáticamente los partidos restantes de ese equipo como walkover a favor del rival (resultado configurable por torneo, ej. 3-0).

- Mantiene el calendario sin descuadrar.

- Registra el evento en el audit log y notifica a los capitanes afectados.

## **4.8 Temporadas e historial**

La plataforma soporta el concepto de temporadas para que una liga pueda evolucionar año con año manteniendo historial ordenado.

| **Funcionalidad** | **Descripción** |
| --- | --- |
| Clonar torneo | El organizador puede usar un torneo anterior como plantilla (formato, reglas, costos, canchas). Solo ajusta lo que cambió para la nueva temporada. |
| Reutilizar equipos y jugadores | Equipos y jugadores ya registrados pueden arrastrarse a la nueva temporada sin recrearlos. |
| Histórico Público Vivo | Al completarse, el torneo pasa a estado archivado con acceso público. Cualquiera puede navegar resultados, campeones y estadísticas de temporadas pasadas. |

*⚠ La función de clonar torneo es exclusiva del plan Pro en adelante.*

# **5. Módulo: Equipos y Jugadores**

## **5.1 Perfil Puente (Guest Player)**

Para eliminar la barrera de adopción, los capitanes pueden registrar jugadores con solo su nombre, sin que ese jugador tenga cuenta en la plataforma. Estos son "perfiles puente" (is_guest = true en la tabla players).

Cuando el jugador real se registra, puede reclamar su perfil puente mediante un proceso de vinculación controlado. El sistema nunca fusiona identidades de forma automática por nombre.

## **5.2 Flujo de vinculación de identidad**

Regla de oro: la plataforma jamás infiere ni fusiona identidades automáticamente por nombre o similitud.

- Si el sistema detecta coincidencias fuertes por email o teléfono durante el registro, sugiere la vinculación — pero nunca la ejecuta sin confirmación.

- El jugador real busca y solicita "reclamar" su perfil puente desde la app, O el capitán envía una invitación de vinculación.

- El capitán (o persona con rango suficiente) debe aceptar y autorizar la vinculación.

- Una vez aceptada, el perfil puente se transforma en usuario verificado.

Caso especial — múltiples perfiles históricos: un jugador puede haber tenido perfiles puente en varios equipos distintos. Al registrarse, su cuenta única se vincula a todos esos registros históricos mediante IDs internos globales. Las estadísticas pasadas quedan intactas en sus respectivos equipos y temporadas.

## **5.3 Origen de entidades**

| **Nivel** | **Tipo** | **Descripción** |
| --- | --- | --- |
| Torneo | Equipo interno | Creado directamente por el organizador desde su panel. |
| Torneo | Equipo externo | Equipo independiente que envía solicitud para unirse al torneo. |
| Equipo | Jugador interno | Perfil puente creado manualmente por el capitán. |
| Equipo | Jugador externo | Usuario real que solicita unirse, o que recibe invitación digital del capitán. |

## **5.4 Validación de plantillas — tres modos**

| **Modo** | **Comportamiento** | **Perfil de uso** |
| --- | --- | --- |
| Estricto | Bloqueo automático si datos verificados no cumplen requisitos (género, edad). El capitán no puede enviar solicitud hasta corregir. | Torneos competitivos con categorías fijas |
| Flexible | El equipo envía la solicitud con datos incompletos. El organizador revisa y aprueba manualmente. | Torneos informales o rápidos |
| Híbrido (default) | Sistema filtra automáticamente lo que puede; marca con alertas los casos dudosos para decisión del organizador en un clic. | Recomendado para la mayoría de ligas |

## **5.5 Motor de elegibilidad**

| **Tipo de liga** | **Comportamiento** |
| --- | --- |
| Liga flexible | Un jugador verificado puede estar activo en múltiples equipos del mismo torneo simultáneamente. |
| Liga estricta | El sistema bloquea automáticamente cualquier intento de inscripción si la cuenta del jugador ya está registrada en otro equipo del mismo torneo. Gestiona suspensiones, rosters cerrados e integridad del campeonato. |

## **5.6 Reglas de estadísticas entre temporadas**

✓ Las estadísticas pertenecen al momento en que ocurrieron.

✓ El historial del equipo no se altera cuando un jugador se va: los goles y títulos quedan en el equipo donde se generaron.

✓ El perfil del jugador acumula historial completo de carrera, con detalle por temporada y equipo.

✓ Al cambiar de equipo, el contador del jugador para el torneo actual empieza en cero.

# **6. Módulo: Calendario y Fixtures**

## **6.1 Generador automático**

El sistema puede operar en dos modos según la configuración del organizador:

| **Modo** | **Descripción** |
| --- | --- |
| Automático completo | El organizador configura disponibilidad de canchas y horarios. El sistema distribuye los partidos encajándolos perfectamente en esos bloques de tiempo. |
| Semi-manual | El sistema genera los cruces de jornadas (quién juega contra quién). El organizador asigna horas y canchas a mano. |

## **6.2 Restricciones configurables**

| **Restricción** | **Toggle / Configuración** |
| --- | --- |
| Partidos por equipo por día | Toggle: permitir o no múltiples partidos el mismo día (activado para torneos rápidos de fin de semana). |
| Descanso mínimo entre partidos | Si un equipo juega dos veces el mismo día, el sistema fuerza un bloqueo de tiempo mínimo configurable (ej. 1 hora). |
| Disponibilidad de cancha | El organizador define horarios disponibles por cancha (ej. Sábados 8:00–14:00). El generador respeta esos bloques. |

## **6.3 Calculador de bloque de tiempo por partido**

Para evitar el error clásico de agendar el siguiente partido inmediatamente después del anterior sin margen, 4Sports introduce un calculador de bloques:

- El organizador define: número de periodos, duración de cada uno, duración de descansos intermedios.

- El sistema suma todo y reserva ese bloque completo en la agenda de la cancha.

- Para fases eliminatorias, se puede activar un margen adicional para tiempos extra y penales.

Ejemplo fútbol: 2 tiempos × 45 min + 1 descanso × 15 min = bloque de 105 min por partido.

# **7. Módulo: Partidos en Vivo y Estadísticas**

## **7.1 Niveles de captura — Granularidad a la Carta**

| **Nivel** | **Qué captura** | **Para quién** |
| --- | --- | --- |
| Básico / Express | Marcador final + incidencias críticas (expulsiones que afectan suspensiones). | Ligas muy amateurs. Captura en 10 segundos al final del partido. |
| Estándar (recomendado) | Gol, autogol, tarjeta, cambio de jugador — con minuto exacto y jugador asociado. Alimenta tabla de goleo individual y cronograma del partido. | Default para la mayoría de ligas. |
| Avanzado | Métricas de rendimiento por deporte: asistencias, tiros a puerta, rebotes, robos de base, etc. | Torneos semi-profesionales y entrenadores que usan datos para mejorar. |

## **7.2 Métricas por deporte**

Cada deporte tiene una plantilla base de métricas en la base de datos. El organizador activa o desactiva cada métrica mediante toggles al configurar su torneo. No hay métricas fijas impuestas.

| **Deporte** | **Métricas base incluidas** |
| --- | --- |
| Fútbol | Goles, asistencias, tarjetas amarillas/rojas, tiros a puerta, cambios |
| Básquetbol | Puntos, asistencias, rebotes, bloqueos, faltas personales/técnicas |
| Béisbol | Carreras, hits, errores, bases robadas, ponches |
| Voleibol | Sets ganados, puntos por set, aces, bloqueos |

## **7.3 Visibilidad de estadísticas avanzadas**

| **Modo** | **Quién puede verlo** |
| --- | --- |
| Público | Toda la comunidad, fanáticos y equipos rivales. Genera debate y contenido para redes sociales. |
| Privado (Análisis interno) | Solo el organizador y el cuerpo técnico del equipo. Funciona como herramienta de scouting. |

## **7.4 Motor de sanciones multideporte**

El sistema abstrae las expulsiones bajo el concepto técnico de "Sanción por Descalificación de Partido", usando el campo forces_game_ejection por evento deportivo.

| **Deporte** | **Evento** | **forces_game_ejection** |
| --- | --- | --- |
| Fútbol | Tarjeta Roja directa / Doble Amarilla | true |
| Básquetbol | 5 Faltas Personales / 2 Faltas Técnicas | true |
| Béisbol | Expulsión por el Umpire | true |
| Voleibol | Tarjeta Descalificatoria (Roja + Amarilla) | true |
| Hockey | Game Misconduct / Match Penalty | true |

Comportamiento del sistema al registrar forces_game_ejection = true:

- Bloqueo en tiempo real: el jugador no puede recibir más estadísticas en el partido en curso.

- Sanción post-partido: el sistema consulta las reglas del torneo y genera una "Sanción borrador" en el Panel de Disciplina.

- Control humano: el organizador valida la sanción sugerida o la modifica con justificación (ej. extender de 1 a 3 partidos por agresión verbal).

## **7.5 Panel de Disciplina**

Módulo centralizado donde aparecen automáticamente todas las expulsiones al finalizar cada partido. Opera como "tribunal del organizador":

- Estado "Borrador de Sanción": sistema precarga la sanción estándar del deporte y liga.

- El organizador puede confirmar con un clic o modificar con justificación escrita.

- Las sanciones confirmadas bloquean al jugador automáticamente en los partidos correspondientes.

- Toda decisión queda registrada en el audit log.

# **8. Módulo: Pagos e Inscripciones**

## **8.1 Política de cobro por torneo**

| **Modalidad** | **Comportamiento** | **Ideal para** |
| --- | --- | --- |
| Inscripción con Candado | El equipo queda en estado "Pendiente de Pago". El sistema lo bloquea y no lo incluye en fixtures hasta confirmar pago. | Torneos competitivos o relámpago. |
| Inscripción Flexible | El equipo se aprueba inmediatamente. El sistema genera una deuda (invoice) automáticamente. El capitán puede pagar a plazos. | Ligas locales con relación de confianza. |

## **8.2 Canales de pago**

| **Canal** | **Flujo** | **Plan requerido** |
| --- | --- | --- |
| Efectivo / Manual | El organizador registra el pago en su panel. El sistema actualiza la invoice y genera un recibo digital interno. | Todos los planes (incluyendo Free) |
| Digital (Stripe / Mercado Pago) | El capitán paga desde la app. El webhook confirma al servidor de 4Sports. El sistema liquida la invoice automáticamente y notifica al organizador. | Plan Pro en adelante |

## **8.3 Modelo financiero**

✓ 4Sports no actúa como intermediario financiero. El dinero fluye directamente: Capitán → Pasarela → Cuenta del Organizador.

✓ 4Sports cobra 0% de comisión sobre transacciones de torneos.

✓ Las comisiones de pasarela (Stripe/Mercado Pago) las absorbe el organizador directamente.

✓ Ingresos de 4Sports: únicamente la suscripción SaaS mensual o anual del organizador.

## **8.4 Reconciliación de webhooks fallidos**

Si el servidor de 4Sports sufre una caída temporal y no procesa el webhook de confirmación de pago, el organizador puede usar el botón "Verificar Transacción Manual" en su panel financiero:

- El organizador ingresa el ID de pago de la pasarela.

- El sistema consulta la API externa de Stripe / Mercado Pago.

- Si el pago está confirmado, fuerza la actualización de la invoice en 4Sports.

## **8.5 Recibos digitales**

Los recibos generados por 4Sports son comprobantes internos de control administrativo ("ticket de caja digital"). No tienen validez fiscal. La emisión de facturas fiscales (CFDI en México) es responsabilidad del organizador por fuera de la plataforma.

## **8.6 Conceptos de cobro soportados**

El organizador puede configurar cualquier número de fee_items por torneo. Tipos disponibles:

| **Tipo** | **Se genera automáticamente al...** |
| --- | --- |
| per_team | Aceptar la inscripción del equipo |
| per_match | Crear el partido (ej. cobro de arbitraje por partido) |
| per_tournament | Crear el torneo (costo global único) |

# **9. Módulo: Notificaciones y Comunicación**

## **9.1 Tipos de notificación**

| **Tipo** | **Quién la dispara** | **Ejemplos** |
| --- | --- | --- |
| Transaccional (automática) | El sistema, al detectar un evento en BD | Cambio de horario, aprobación de jugador, resultado registrado, modificación post-publicación |
| Comunicado (manual) | El organizador desde su panel | Suspensión por lluvia, convocatoria a junta de capitanes, aviso de pago pendiente |

## **9.2 Segmentación de comunicados**

El organizador puede segmentar sus mensajes manuales a:

- Toda la liga completa.

- Un torneo específico.

- Solo los capitanes de equipos con pagos pendientes.

- Un equipo específico.

## **9.3 Canales — Roadmap**

| **Fase** | **Canal** | **Estado** |
| --- | --- | --- |
| MVP | Push notifications + centro de notificaciones in-app | Activo desde Hito 1 |
| MVP | Botón "Compartir en WhatsApp" con texto y enlace pre-generado | Activo desde Hito 1 |
| Escala (Hito 4+) | Email transaccional para seguridad y reclamación de perfiles puente | Pendiente |
| Fase avanzada | WhatsApp API oficial para alertas críticas | Pendiente |

*⚠ Los perfiles puente sin cuenta no reciben notificaciones directas. Dependen del botón **"**Compartir en WhatsApp**"** del capitán.*

## **9.4 Control de notificaciones**

El organizador puede silenciar o desactivar tipos específicos de notificaciones automáticas desde un panel de configuración granular. Ejemplo: desactivar alertas de "Fin de partido" para no molestar a los fanáticos tarde por la noche, manteniendo activas las de "Cambio de horario".

# **10. Planes y Monetización**

## **10.1 Estructura de planes**

| **Plan** | **Límite clave** | **Feature diferenciador principal** |
| --- | --- | --- |
| Free (Permanente) | 2 torneos simultáneos activos | Liga básica todos-contra-todos, modo express, perfiles puente ilimitados, control de pagos en efectivo |
| Starter | 3 torneos simultáneos, equipos ampliados | Eliminación directa, playoffs, gestión de sedes con horarios automatizados |
| Pro | Torneos, categorías e inscripciones ilimitadas | Modo Mundial, motor de elegibilidad estricto, estadísticas avanzadas, pagos digitales, histórico vivo, Team Landing Pages |
| Elite / Enterprise | Ilimitado + corporativo | Sub-administradores, personalización visual, soporte prioritario, módulo entrenamientos (futuro) |

*⚠ Los planes se cobran por organización, no por usuario. No se penaliza al organizador por hacer crecer su comunidad.*

## **10.2 Ciclo de vida protegido al vencer suscripción**

Regla de oro: ningún torneo que haya iniciado bajo un plan de pago se degrada o congela por vencimiento de suscripción.

Implementación técnica:

- Al publicar un torneo, el sistema estampa created_under_plan con el plan activo en ese momento.

- Las feature flags evalúan: plan actual del organizador OR plan del torneo (el que sea mayor).

- Un torneo Pro sigue corriendo con todas sus funciones aunque la suscripción venza.

Al vencer la suscripción, el panel entra en Modo Liquidación:

- Bloqueo de creación de nuevos torneos.

- Bloqueo de clonación de temporadas.

- Bloqueo de escala (no puede agregar equipos más allá del límite Free).

- Banner de retención: "Tu plan Pro ha vencido. Tu torneo activo continúa por cortesía. Reactiva tu suscripción para crear nuevos torneos."

## **10.3 Período de gracia**

Al vencer el plan, el organizador dispone de 7 días de gracia con todas las funciones Pro activas para realizar el pago sin interrumpir la operación del fin de semana. Al octavo día, entra en Modo Liquidación de forma estricta.

# **11. Stack Técnico y Arquitectura**

Esta sección es un resumen ejecutivo de referencia. El detalle completo se encuentra en ARQUITECTURA.md.

## **11.1 Stack principal**

| **Capa** | **Tecnología** | **Razón** |
| --- | --- | --- |
| Runtime / Monorepo | Bun + Turborepo | Más rápido, TypeScript nativo, workspaces simples |
| API | ElysiaJS + Drizzle ORM | Construido para Bun, tipo-seguro, SQL-first |
| Auth | BetterAuth | OAuth (Google/Facebook) + sesiones sin código manual |
| Web | Next.js 14+ App Router + Tailwind | SSR, caché de datos, componentes de servidor |
| Mobile | Expo SDK 52 + Expo Router v4 + NativeWind | Build nativo, file-based routing, Tailwind en mobile |
| Base de datos | PostgreSQL 16 | Base principal con soporte JSONB para datos variables |
| Caché / Sesiones | Redis | Rate limiting, sesiones, caché de queries frecuentes |
| Archivos | Cloudflare R2 | Sin costo de egress, integrado con CDN existente |
| Push notifications | Firebase FCM | Push a iOS y Android |
| Infraestructura | Railway (API) + Cloudflare Pages (Web) | Zero-ops, deploys automáticos, SSL |

## **11.2 Arquitectura de la API**

La API sigue arquitectura limpia por capas. Cada módulo tiene exactamente la misma estructura: routes → service → repository → schema. Las capas no se mezclan: las rutas solo llaman a servicios, los servicios solo llaman a repositorios, los repositorios solo hacen queries con Drizzle.

## **11.3 Decisiones de base de datos relevantes para el producto**

| **Decisión** | **Impacto en producto** |
| --- | --- |
| Dinero en centavos (INT) | $500 MXN = 50000. Nunca floats. División por 100 solo al mostrar al usuario. |
| JSONB para datos variables | player_fields, settings, fee_config y extra_stats sin migraciones adicionales. |
| created_under_plan en tournaments | Permite ciclo de vida protegido al vencer suscripción. |
| Soft deletes en organizations, teams, players | Los datos no se eliminan permanentemente — permiten recovery y auditoría. |
| referee_session_token en matches | Árbitros externos y capitanes invitados acceden por token en URL, sin registrarse. |

# **12. Reglas de Negocio Críticas**

Este capítulo concentra las reglas que el equipo de desarrollo debe implementar con precisión. Una regla mal implementada puede comprometer la integridad de un torneo o generar conflictos legales.

## **12.1 Identidad y jugadores**

✓ Nunca fusionar perfiles por similitud de nombre. Siempre requiere confirmación humana en dos pasos.

✓ Un jugador real puede vincularse a múltiples perfiles puente históricos sin alterar estadísticas pasadas.

✓ Un perfil puente sin cuenta no recibe notificaciones directas.

✓ La elegibilidad del jugador se valida contra su cuenta real (user_id), no contra su perfil puente.

## **12.2 Torneos y estructura**

✓ Al publicar, el torneo recibe created_under_plan inmutable.

✓ El formato, reglas base y criterios de desempate no pueden modificarse post-publicación.

✓ Todo cambio post-publicación genera: audit_log + actualización de standings + notificación pública.

✓ Un walkover se resuelve con el marcador configurado en settings.walkover_score del torneo.

## **12.3 Pagos**

✓ 4Sports nunca retiene dinero de torneos. El flujo es siempre: Capitán → Pasarela → Organizador.

✓ Los recibos de 4Sports son comprobantes internos sin validez fiscal.

✓ Si el webhook falla, el organizador tiene el botón de reconciliación manual — el sistema nunca asume un pago no confirmado.

## **12.4 Planes y feature flags**

✓ Feature flag check: plan_actual >= plan_requerido OR tournament.created_under_plan >= plan_requerido.

✓ Al vencer suscripción: 7 días de gracia, luego Modo Liquidación estricto.

✓ Modo Liquidación bloquea creación y clonación, pero nunca congela torneos activos.

✓ Los planes se cobran por organización. Nunca por número de usuarios.

## **12.5 Sanciones y disciplina**

✓ forces_game_ejection bloquea al jugador en tiempo real para el partido en curso.

✓ Las suspensiones post-partido son configurables por torneo y deporte — nunca hardcodeadas.

✓ Toda decisión del Panel de Disciplina queda registrada en audit_logs con actor, timestamp y justificación.

# **13. Requerimientos No Funcionales**

## **13.1 Rendimiento**

- La API debe responder en menos de 200ms para endpoints de lectura frecuente (standings, fixtures, resultados).

- El generador de fixtures debe completar el cálculo en menos de 3 segundos para torneos de hasta 32 equipos.

- Las actualizaciones de marcadores en vivo deben reflejarse para el usuario en menos de 5 segundos (WebSockets).

## **13.2 Disponibilidad**

- Disponibilidad objetivo: 99.5% mensual.

- Los torneos activos tienen prioridad de recuperación ante fallos — el sistema de partidos en vivo es el servicio más crítico.

## **13.3 Seguridad**

- Toda modificación de datos sensibles (resultados, pagos, sanciones) requiere autenticación válida y validación de scope en el backend.

- Los tokens de árbitro externo (referee_session_token) tienen acceso limitado estrictamente al partido asignado.

- Los tokens de capitán invitado (captain_invite_tokens) expiran según configuración y son de un solo uso.

- Variables de entorno nunca en el repositorio. Rotación periódica de secretos.

## **13.4 Escalabilidad**

- La arquitectura multitenant debe soportar múltiples organizaciones sin degradación de rendimiento.

- Redis maneja sesiones, caché y rate limiting para absorber picos de carga (ej. todos los partidos de una jornada actualizándose simultáneamente).

- BullMQ se introduce en Hito 3 para procesar notificaciones y auditoría de forma asíncrona.

## **13.5 Usabilidad**

- Un organizador debe poder crear y publicar su primer torneo en menos de 5 minutos sin leer documentación.

- El flujo de captura de resultados en Modo Express debe completarse en menos de 30 segundos desde el teléfono.

- La interfaz debe ser completamente funcional en móvil — el 90% de los usuarios accederán desde el teléfono.

# **14. Temas Pendientes — Segunda Sesión**

Los siguientes puntos quedaron identificados durante la sesión de discovery pero requieren decisión formal antes de implementarse:

| **#** | **Tema** | **Impacto** | **Urgencia** |
| --- | --- | --- | --- |
| 1 | ¿El historial público (torneos archivados) requiere cuenta o es acceso libre sin registro? | UX, auth, SEO | Hito 2 |
| 2 | ¿Quién puede iniciar la vinculación de un perfil puente — solo el capitán, solo el jugador, o ambos? | Flujo de onboarding | Hito 2 |
| 3 | Cuando un jugador está suspendido, ¿aplica solo en ese torneo o en toda la plataforma? | Motor de elegibilidad | Hito 3 |
| 4 | ¿Hay número mínimo y máximo de jugadores para que una plantilla sea válida? | Validación de inscripción | Hito 2 |
| 5 | ¿Quién puede registrar eventos durante el partido — solo árbitro/organizador o también el capitán? | Roles y permisos en vivo | Hito 3 |
| 6 | Precios exactos de cada plan (Starter, Pro, Elite) en MXN — mensual y anual. | Monetización, onboarding | Antes de Hito 5 |

# **15. Apéndice — Glosario**

| **Término** | **Definición** |
| --- | --- |
| Perfil puente | Jugador registrado solo con nombre por el capitán, sin cuenta en la plataforma (is_guest = true). |
| Modo Borrador | Estado inicial del torneo, privado y simulable, sin consecuencias públicas. |
| Modo Liquidación | Estado del panel del organizador al vencer la suscripción. Bloquea creación pero no interrumpe torneos activos. |
| Ciclo de Vida Protegido | Regla que garantiza que un torneo iniciado bajo un plan continúa con esas funciones hasta el partido final. |
| created_under_plan | Campo en la tabla tournaments que registra el plan activo al publicar. Inmutable post-publicación. |
| forces_game_ejection | Flag en eventos deportivos que indica expulsión inmediata del partido en curso. |
| Panel de Disciplina | Módulo del organizador donde se gestionan y confirman sanciones post-partido. |
| Walkover | Resultado administrativo asignado cuando un equipo no se presenta o es dado de baja. El marcador lo define el reglamento del torneo. |
| Motor de elegibilidad | Sistema que valida si un jugador puede participar en un torneo/equipo según las reglas configuradas. |
| Organizador local | Rol con scope limitado a un torneo asignado. No tiene acceso a finanzas globales ni puede crear torneos. |
| Modo Mundial | Formato de competición de dos fases: Fase de Grupos + Eliminatorias. Disponible desde plan Pro. |
| Team Landing Page | URL pública generada por la plataforma para cada equipo con su escudo, plantilla y estadísticas. Plan Pro. |

4Sports © 2025  ·  Página  de