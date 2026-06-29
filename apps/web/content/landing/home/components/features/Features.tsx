/* COMPONENTS */
import { FeatureCard } from '../shared/components/featureCard/FeatureCard'

/* DATA */
import { features } from './data/features'

export function Features() {
  return (
    <div className="flex items-center w-full py-16 bg-surface sm:py-24 min-h-dvh">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <h2 className="px-4 py-1 mb-6 text-xs font-bold rounded-full w-fit bg-secondary text-secondary-text">
            BENEFICIOS CLAVE
          </h2>

          <h2 className="mb-2 text-5xl text-ink">Enfocados en el</h2>
          <h3 className="font-bold text-primary text-8xl font-bebas">éxito deportivo</h3>

          <p className="max-w-2xl text-lg text-center text-muted">
            Planes claros, soporte constante y un entorno seguro para que tu club, tu equipo y tu
            torneo crezcan con confianza.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((item) => (
            <FeatureCard
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
