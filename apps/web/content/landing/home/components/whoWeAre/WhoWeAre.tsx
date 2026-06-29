'use client'

/* THEME */
import { useTheme } from 'next-themes'
/* ICONS */
import { FourSportsIcon } from '@/content/shared/icons/fourSports/FourSportsIcon'
/* COMPONENTS */
import { TitleWithDescription } from '@/content/shared/ui/titleWithDescription/TitleWithDescription'
import { ParticlesShapes } from './components/particlesShapes/ParticlesShapes'

export function WhoWeAre() {
  const { resolvedTheme } = useTheme()

  return (
    <div className="relative flex items-center w-full bg-background h-dvh">
      <div className="absolute top-0 left-0 z-0 w-full h-full">
        <ParticlesShapes
          backColor="#00000"
          idContainer="particulasFiguras1"
          shapeColor={resolvedTheme === 'dark' ? '#141610' : '#ecebe4'}
          opacity={{ min: 0.2, max: 0.8 }}
          opacityAnimation={{
            enable: true,
            speed: 0.5,
          }}
        />
      </div>

      <div className="relative flex items-center justify-center w-full overflow-hidden h-3/4">
        <div className="z-10 flex flex-col items-center gap-6 p-4 rounded-full max-w-1/2 bg-background">
          <div className={`pointer-events-none w-36`}>
            <FourSportsIcon />
          </div>

          <TitleWithDescription
            title="¿Quiénes somos?"
            description="4Sports nace de la pasión por el deporte y la idea de conectar a jugadores, equipos y organizadores en un solo lugar. Este espacio simplifica la gestión de torneos, estadísticas y competencias, permitiendo que cada partido, resultado y logro cobre vida. "
          />
        </div>
      </div>
    </div>
  )
}
