/* TYPES */
import { CardItem } from '../../types/cardItem'

export function FeatureCard({ title, description, component }: CardItem) {
  return (
    <div className="relative flex flex-col items-center p-8 transition-all duration-300 shadow-xs group rounded-2xl bg-card hover:scale-105">
      <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-xl bg-card-2">
        {component}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-center transition-colors duration-200 text-ink group-hover:text-primary">
          {title}
        </h3>
        <p className="text-sm text-center text-muted">{description}</p>
      </div>

      <div className="absolute bottom-0 left-8 right-8 h-0.5 scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 rounded-full" />
    </div>
  )
}
