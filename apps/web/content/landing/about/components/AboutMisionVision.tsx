/* COMPONENTS */
import Image from "next/image";

/* ICONS */
import { Goal, TrendingUp } from "lucide-react";

/* IMAGES */
import back from "./images/back.jpg";

export function AboutMisionVision() {
  return (
    <div>
      <div className="flex flex-col gap-4 w-full p-32 bg-surface relative">
        <div className="w-full h-full absolute top-0 left-0 z-10 bg-linear-to-r from-black/90 via-black/70 to-transparent" />

        <Image
          src={back}
          alt="Fondo deportivo"
          fill
          quality={70}
          priority
          className="object-cover object-top"
        />

        <div className="flex gap-4 items-center self-start relative z-20">
          <Goal className="size-10 text-secondary" />
          <h2 className="text-4xl font-black text-white">Misión</h2>
        </div>

        <p className="text-left text-lg max-w-1/2 relative z-20 text-white">
          Empoderar a las comunidades deportivas locales a través de
          estadísticas en tiempo real y herramientas automatizadas,
          democratizando la experiencia de un torneo profesional.
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full p-32 bg-background">
        <div className="flex gap-4 items-center self-end">
          <TrendingUp className="size-10 text-secondary" />
          <h2 className="text-4xl font-black text-ink">Visión</h2>
        </div>

        <p className="text-right text-lg max-w-1/2 self-end">
          Ser el ecosistema digital deportivo líder en Latinoamérica, uniendo a
          millones de jugadores y convirtiendo cada partido de barrio en un
          evento de alto impacto.
        </p>
      </div>
    </div>
  );
}
