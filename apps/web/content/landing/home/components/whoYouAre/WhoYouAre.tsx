/* COMPONENTS */
import { RoleCard } from '../shared/components/roleCard/RoleCard'

/* DATA */
import { roles } from './data/roles'

/* IMAGES */
import ball from './images/banner.webp'

export function WhoYouAre() {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full py-48 bg-fixed bg-center bg-cover min-h-dvh"
      style={{
        backgroundImage: `url(${ball.src})`,
      }}
    >
      <div className="absolute top-0 left-0 z-0 w-full h-full bg-linear-to-b from-black/60 via-black/30 to-transparent" />

      <div>
        <div className="relative z-20 flex flex-col items-center mb-16">
          <h1 className="rounded-full px-4 py-1 text-xs font-bold w-fit bg-[#ff4b1f] text-[#f7f6f2] mb-6">
            PERFILES 4SPORTS
          </h1>

          <h2 className="text-5xl text-[#f7f6f2] mb-2">Tu posición, tu rol,</h2>
          <h3 className="text-[#d4f233] text-8xl font-bebas font-bold">tu hogar</h3>

          <p className="max-w-2xl text-lg text-[#f0efe9] text-center">
            En 4Sports cada usuario importa: desde el jugador que compite hasta el organizador que
            mueve todo detrás del escenario.
          </p>
        </div>

        <div className="px-4 max-w-7xl sm:px-6 lg:px-8">
          {/* Grid de 2 Columnas */}
          <div className="grid max-w-5xl gap-8 md:grid-cols-2">
            {roles.map((role) => (
              <RoleCard
                key={role.title}
                title={role.title}
                description={role.description}
                component={role.component}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
