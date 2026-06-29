/* COMPONENTS */
import Image from 'next/image'

/* IMAGES */
import imagen from './images/banner.webp'

export function Farewell() {
  return (
    <div className="w-full h-[calc(50dvh)] relative py-4 flex justify-center items-center">
      <div className="absolute top-0 left-0 z-10 w-full h-full bg-lime-900/50" />

      <Image
        src={imagen}
        alt="Fondo deportivo"
        fill
        quality={70}
        priority
        className="object-cover object-center"
      />

      <h2 className="relative z-20 font-bold text-white font-bebas text-8xl">
        ¡Esperamos verte pronto!
      </h2>
    </div>
  )
}
