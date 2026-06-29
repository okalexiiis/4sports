'use client'

import { FourSportsIcon } from '../../icons/fourSports/FourSportsIcon'
/* ICONS */
import { FacebookColorless } from './icons/facebook/FacebookColorless'
import { InstagramColorless } from './icons/instagram/InstagramColorless'
import { TwitterColorless } from './icons/twitter/TwitterColorless'

export function Footer() {
  return (
    <footer className="bg-surface min-h-[50dvh] w-full flex flex-col">
      <div className="flex items-center justify-between flex-1 px-24 py-12">
        <div className="flex flex-col gap-6 w-fit">
          <div className="w-40">
            <FourSportsIcon />
          </div>

          <p className="text-sm text-body max-w-1/2">
            En 4Sports conectamos jugadores, organizadores y equipos para construir experiencias
            competitivas y comunitarias con seguridad, estilo y estadísticas en tiempo real.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-bold font-bebas text-primary">¡Síguenos!</h2>

          <div className="flex gap-6">
            <div className="w-6 h-6 transition-colors duration-300 cursor-pointer min-w-6 min-h-6 fill-muted hover:fill-primary">
              <FacebookColorless />
            </div>
            <div className="w-6 h-6 transition-colors duration-300 cursor-pointer min-w-6 min-h-6 fill-muted hover:fill-primary">
              <InstagramColorless />
            </div>
            <div className="w-6 h-6 transition-colors duration-300 cursor-pointer min-w-6 min-h-6 fill-muted hover:fill-primary">
              <TwitterColorless />
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 text-xs font-medium text-center border-t border-line text-muted">
        <p>© 2026 4Sports. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
