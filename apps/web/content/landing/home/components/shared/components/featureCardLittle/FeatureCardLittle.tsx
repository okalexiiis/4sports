/* TYPES */
import { CardItem } from '../../types/cardItem'

export default function FeatureCardLittle({ title, description, component }: CardItem) {
  return (
    <div className="relative flex items-center gap-5 p-5 transition-all duration-300 group rounded-2xl bg-surface hover:scale-105 hover:border-green-300">
      {/* Icono Estilizado en Rombo / Diamante según tu dibujo */}
      <div className="flex items-center justify-center w-12 h-12 transition-colors duration-300 rotate-45 border shrink-0 rounded-xl border-line bg-card group-hover:bg-card-2">
        {/* Des-rotamos el icono interno para que quede derecho */}
        <div className="-rotate-45">{component}</div>
      </div>

      {/* Contenido de texto compacto al lado derecho */}
      <div className="space-y-1">
        <h3 className="text-base font-bold transition-colors duration-200 text-ink group-hover:text-primary">
          {title}
        </h3>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </div>
  )
}
