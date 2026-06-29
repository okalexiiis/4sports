/* COMPONENTS */
import FeatureCardLittle from '../shared/components/featureCardLittle/FeatureCardLittle'

/* DATA */
import { tournaments } from './data/tournaments'

export function Tournaments() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-48 bg-background min-h-dvh">
      <div className="px-4 max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <h2 className="px-4 py-1 mb-6 text-xs font-bold rounded-full w-fit bg-secondary text-secondary-text">
            COMPETENCIAS
          </h2>

          <h3 className="font-bold text-primary text-8xl font-bebas">Torneos</h3>

          <p className="max-w-2xl text-lg text-center text-muted">
            Vive torneos con reglas claras, resultados automáticos y momentos memorables para tu
            equipo.
          </p>
        </div>

        <div className="grid max-w-5xl gap-8 mx-auto md:grid-cols-2">
          {tournaments.map((item) => (
            <FeatureCardLittle
              key={item.title}
              title={item.title}
              description={item.description}
              component={item.component}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
