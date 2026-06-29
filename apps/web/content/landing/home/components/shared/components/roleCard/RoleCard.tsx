/* TYPES */
import { CardItem } from '../../types/cardItem'

export function RoleCard({ title, description, component }: CardItem) {
  return (
    <div className="group relative flex gap-4 items-center justify-between overflow-hidden rounded-2xl bg-[#141610]/80 p-8 transition-all duration-300 hover:scale-105">
      {/* Contenedor del Icono/Emoji (Centrado arriba) */}
      <div className="p-4 rounded-xl bg-[#141610]">{component}</div>

      {/* Contenido de Texto (Alineado abajo a la izquierda según boceto) */}
      <div className="space-y-2 text-left">
        <h3 className="text-2xl font-black tracking-tight text-[#f7f6f2] transition-colors duration-200 group-hover:text-[#d4f233]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[#f0efe9]">{description}</p>
      </div>
    </div>
  )
}
