"use client";

/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import Image from "next/image";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { ModalBodyUpdateOrganizationPhotoForm } from "./components/modalBodyUpdateOrganizationPhoto/ModalBodyUpdateOrganizationPhotoForm";
import { ModalBodyUpdateOrganizationInfoForm } from "./components/modalBodyUpdateOrganizationInfo/ModalBodyUpdateOrganizationInfoForm";

import { TournamentCard } from "@/content/dashboard/organizer/tournaments/page/components/tournamentCard/TournamentCard";

/* ICONS */
import { SquarePen } from "lucide-react";

/* IMAGES */
import banner1 from "./images/banner3.jpg";
import banner2 from "./images/banner2.jpg";
import banner3 from "./images/banner3.jpg";
import organization1 from "./images/organization1.png";
import tournament1 from "./images/tournament1.png";
import tournament2 from "./images/tournament2.png";
import tournament3 from "./images/tournament3.png";
import team1 from "./images/team1.jpg";
import team2 from "./images/team2.jpg";
import team3 from "./images/team3.jpg";
import team4 from "./images/team4.jpg";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { TournamentCardType } from "@/content/dashboard/organizer/tournaments/page/components/tournamentCard/types/TournamentCardType";

const tournaments: TournamentCardType[] = [
  {
    slug: "torneo-verano-ii",
    name: "Torneo Verano II",
    description: "Pre Elecciones de Verano II",
    image: tournament1,
    state: "Inscribiendo",
    sex: "Femenino",
    sport: "Básquetbol",
    teams: [
      { image: team1 },
      { image: team2 },
      { image: team3 },
      { image: team4 },
    ],
    teamsQuantity: 20,
    type: "Eliminatoria directa",
    banner: banner3,
    location: "Nogales, Sonora. México",
  },
  {
    slug: "casa-de-plata",
    name: "Casa de Plata",
    description: "Reuniendo los mejores equipos 2026",
    image: tournament2,
    state: "Jugando",
    sex: "Femenino",
    sport: "Básquetbol",
    teams: [
      { image: team1 },
      { image: team2 },
      { image: team3 },
      { image: team4 },
    ],
    teamsQuantity: 9,
    type: "Todos contra todos",
    banner: banner2,
    location: "Nogales, Sonora. México",
  },
  {
    slug: "tronos",
    name: "Tronos",
    description: "Práctica de equipos Nogalenses",
    image: tournament3,
    state: "Finalizado",
    sex: "Femenino",
    sport: "Básquetbol",
    teams: [{ image: team1 }, { image: team2 }, { image: team3 }],
    teamsQuantity: 3,
    type: "Eliminatoria directa",
    banner: banner3,
    location: "Nogales, Sonora. México",
  },
];

export function OrganizerOrganizationContent({ slug }: { slug: string }) {
  const { setModal } = useModal();

  return (
    <SectionContainer>
      <div className="p-6 flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="w-full h-54 rounded-xl bg-surface relative mb-22">
            <Image
              alt="Banner"
              src={banner1}
              quality={70}
              fill
              loading="eager"
              className="rounded-xl object-cover object-center"
            />

            <div className="w-48 h-48 min-w-48 min-h-48 absolute left-6 bottom-0 translate-y-1/2 bg-background rounded-full border-8 border-background">
              <Image
                alt="Organización"
                src={organization1}
                quality={70}
                fill
                className="rounded-full object-cover object-center"
              />

              <div className="absolute bottom-1 right-1 w-14 h-14 rounded-full bg-primary text-primary-text flex items-center justify-center border-6 border-background">
                <DinamicButton
                  action={() =>
                    setModal({
                      isActivated: true,
                      title: "Cambiar foto",
                      body: (
                        <ModalBodyUpdateOrganizationPhotoForm slug={slug} />
                      ),
                    })
                  }
                  type="filled"
                  icon={<SquarePen className="size-5 min-w-5 min-h-5" />}
                  twClassName="w-full h-full p-0 rounded-full"
                />
              </div>
            </div>

            <DinamicButton
              action={() =>
                setModal({
                  isActivated: true,
                  title: "Actualizar información",
                  body: <ModalBodyUpdateOrganizationInfoForm slug={slug} />,
                })
              }
              type="filled"
              label="Actualizar información"
              icon={<SquarePen className="size-4 min-w-4 min-h-4" />}
              twClassName="w-fit text-sm py-1 absolute bottom-0 right-0 translate-y-[calc(100%+1.5rem)]"
            />

            <div className="flex flex-col gap-1 absolute bottom-0 left-60 translate-y-[calc(100%+1.5rem)]">
              <h2 className="text-3xl font-bold text-ink">Sede Deportes</h2>
              <h3 className="text-primary text-sm font-semibold">Dueño</h3>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-surface rounded-xl p-6">
            <p className="font-semibold text-lg">Descripción</p>
            <p className="text-muted">
              La mejor sede de deportes en todo Sonora, México
            </p>
          </div>

          <div className="flex flex-col gap-4 bg-surface rounded-xl p-6">
            <p className="font-semibold text-lg">Torneos populares</p>

            <div className="grid gap-6 grid-cols-3">
              {tournaments.map((t) => (
                <TournamentCard
                  key={t.slug}
                  slug={t.slug}
                  name={t.name}
                  description={t.description}
                  image={t.image}
                  state={t.state}
                  sex={t.sex}
                  sport={t.sport}
                  teams={t.teams}
                  teamsQuantity={t.teamsQuantity}
                  type={t.type}
                  banner={t.banner}
                  location={t.location}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
