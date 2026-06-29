/* COMPONENTS */
import Image from 'next/image'
import Link from 'next/link'

/* IMAGES */
import cancha from './images/banner.webp'

export function Hero() {
  return (
    <div className="relative w-full h-dvh">
      <div className="absolute top-0 left-0 z-10 w-full h-full bg-linear-to-r from-black/60 via-black/30 to-transparent" />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={cancha}
          alt="Fondo deportivo"
          fill
          quality={70}
          priority
          className="object-cover object-top"
        />
      </div>

      <div className="absolute z-20 flex flex-col items-center translate-y-1/2 left-24 bottom-1/2">
        <h1 className="rounded-full px-4 py-1 text-xs font-bold w-fit bg-[#ff4b1f] text-[#f7f6f2] mb-6">
          UNIVERSO DEPORTIVO
        </h1>

        <h2 className="text-5xl text-[#f7f6f2] mb-2">Haz del deporte tu próximo</h2>
        <h3 className="text-[#d4f233] text-8xl font-bebas font-bold">gran logro</h3>

        <p className="max-w-2xl text-lg text-[#f0efe9] text-center">
          4Sports une jugadores, equipos y organizadores con torneos, estadísticas y planes pensados
          para hacer simple cada partido y cada evento
        </p>

        <div className="flex gap-4 mt-6">
          <Link
            href={'/login'}
            className="w-full h-fit py-2 px-4 text-sm rounded-xl bg-[#f0efe9] text-[#0d0f0c] font-semibold whitespace-nowrap"
          >
            Comenzar ahora
          </Link>
          <Link
            href={'/plans'}
            className="w-full h-fit py-2 px-4 text-sm rounded-xl bg-[#d4f233] text-[#0d0f0c] font-semibold whitespace-nowrap"
          >
            Conoce los planes
          </Link>
        </div>
      </div>
    </div>
  )
}
