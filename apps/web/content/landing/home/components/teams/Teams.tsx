/* COMPONENTS */
import Image from 'next/image'
import stats from './images/stats.webp'
/* IMAGES */
import teams from './images/teams.webp'

export function Teams() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-48 bg-surface min-h-dvh">
      <div className="flex flex-col items-center mb-16">
        <h2 className="px-4 py-1 mb-6 text-xs font-bold rounded-full w-fit bg-secondary text-secondary-text">
          RENDIMIENTO COLECTIVO
        </h2>

        <h2 className="mb-2 text-5xl text-ink">Mi equipo</h2>
        <h3 className="font-bold text-primary text-8xl font-bebas">Mis logros</h3>

        <p className="max-w-2xl text-lg text-center text-muted">
          Nuestra plataforma centraliza toda la información de tus torneos en un solo lugar,
          permitiendo administrar tus equipos y estadísticas fácilmente
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        <div className="flex flex-col gap-16">
          <div className="flex items-center gap-8">
            <div className="relative w-64 h-64 min-w-64 min-h-64">
              <Image
                src={teams}
                alt="Equipos"
                fill
                quality={70}
                loading="lazy"
                className="object-cover object-top rounded-2xl"
              />
            </div>

            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-2xl font-bold text-ink">Equipos</h3>
              <p className="text-body">
                Crea equipos sólidos, administra miembros y mantén una visión clara de tus
                agrupaciones con herramientas optimizadas para coordinar a cada integrante.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-2xl font-bold text-ink">Estadísticas</h3>
              <p className="text-body">
                Consulta logros, rendimiento y resultados con paneles claros para todos los
                perfiles, haciendo que la toma de decisiones sea precisa y visual.
              </p>
            </div>

            <div className="relative w-64 h-64 min-w-64 min-h-64">
              <Image
                src={stats}
                alt="Estadísticas"
                fill
                quality={70}
                loading="lazy"
                className="object-cover object-top rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
