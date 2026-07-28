"use client";

/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import Image from "next/image";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { CarouselManual } from "@/content/shared/ui/carousel/carouselManual/CarouselManual";
import { ModalBodyUpdateTournamentPhotoForm } from "./components/modalBodyUpdateTournamentPhoto/ModalBodyUpdateTournamentPhotoForm";
import { ModalBodyCreateTeam } from "./components/modalBodyCreateTeam/ModalBodyCreateTeam";
import { ModalBodyFinishTournament } from "./components/modalBodyFinishTournament/ModalBodyFinishTournament";
import { ModalBodyDeleteTournament } from "./components/modalBodyDeleteTournament/ModalBodyDeleteTournament";
import { ModalBodyUpdateTournament } from "./components/modalBodyUpdateTournament/ModalBodyUpdateTournament";

/* HOOKS */
import { useState } from "react";

/* ICONS */
import {
  CalendarDays,
  ClockAlert,
  Download,
  LoaderPinwheel,
  MapPin,
  Merge,
  SlidersHorizontal,
  SquarePen,
  UserRound,
  Venus,
} from "lucide-react";

/* IMAGES */
import banner1 from "./image/banner1.jpg";
import organization1 from "./image/organization1.png";
import team1 from "./image/team1.jpg";
import team2 from "./image/team2.jpg";
import team3 from "./image/team3.jpg";
import team4 from "./image/team4.jpg";
import tournament1 from "./image/tournament1.png";

/* LIBS */
import { AnimatePresence, motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type Team = {
  id: number;
  image: StaticImport;
  name: string;
};

export function OrganizerTournamentsContent({ id }: { id: string }) {
  const { setModal } = useModal();

  const [open, setOpen] = useState(false);

  const teams: Team[] = [
    { id: 1, image: team1, name: "Super Team 1" },
    { id: 2, image: team2, name: "Super Team 2" },
    { id: 3, image: team3, name: "Super Team 3" },
    { id: 4, image: team4, name: "Super Team 4" },
    { id: 5, image: team1, name: "Super Team 5" },
    { id: 6, image: team2, name: "Super Team 6" },
    { id: 7, image: team3, name: "Super Team 7" },
    { id: 8, image: team4, name: "Super Team 8" },
  ];

  return (
    <SectionContainer>
      <div className="flex flex-col w-full gap-6 p-6 h-fit">
        <div className="relative w-full h-54 rounded-xl bg-surface mb-22">
          <Image
            alt="Banner"
            src={banner1}
            quality={70}
            fill
            loading="eager"
            className="object-cover object-center rounded-xl"
          />

          <div className="absolute bottom-0 w-48 h-48 translate-y-1/2 border-8 rounded-full min-w-48 min-h-48 left-6 border-background bg-background">
            {/* FOTO */}
            <Image
              alt="Torneo"
              src={tournament1}
              quality={70}
              fill
              className="object-cover object-center rounded-full"
            />

            <div className="absolute flex items-center justify-center rounded-full bottom-1 right-1 w-14 h-14 bg-primary text-primary-text border-6 border-background">
              <DinamicButton
                action={() =>
                  setModal({
                    isActivated: true,
                    title: "Cambiar foto",
                    body: <ModalBodyUpdateTournamentPhotoForm id="" />,
                  })
                }
                type="filled"
                icon={<SquarePen className="size-5 min-w-5 min-h-5" />}
                twClassName="w-full h-full p-0 rounded-full"
              />
            </div>
          </div>

          <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="w-fit h-fit flex items-center justify-center gap-2 text-sm py-1 absolute bottom-0 right-0 translate-y-[calc(100%+1.5rem)] bg-primary border-transparent border-2 text-primary-text font-semibold px-4 rounded-lg cursor-pointer hover:bg-primary-hover">
                <SlidersHorizontal className="size-4 min-w-4 min-h-4" />
                Acciones
              </button>
            </DropdownMenu.Trigger>

            <AnimatePresence>
              {open && (
                <DropdownMenu.Portal forceMount>
                  <DropdownMenu.Content
                    sideOffset={24}
                    align="end"
                    avoidCollisions
                    side={"bottom"}
                    asChild
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: -12 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="p-2 border shadow-md z-100 min-w-56 rounded-2xl border-line bg-background"
                    >
                      <DropdownMenu.Item
                        onClick={() =>
                          setModal({
                            isActivated: true,
                            title: "Actualizar torneo",
                            body: <ModalBodyUpdateTournament />,
                          })
                        }
                        className="p-2 mb-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl hover:bg-surface"
                      >
                        Actualizar torneo
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        onClick={() =>
                          setModal({
                            isActivated: true,
                            title: "Crear equipo interno",
                            body: <ModalBodyCreateTeam />,
                          })
                        }
                        className="p-2 mb-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl hover:bg-surface"
                      >
                        Crear equipo interno
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        onClick={() =>
                          setModal({
                            isActivated: true,
                            title: "Finalizar torneo",
                            body: <ModalBodyFinishTournament />,
                          })
                        }
                        className="p-2 mb-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl hover:bg-surface"
                      >
                        Finalizar torneo
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        onClick={() =>
                          setModal({
                            isActivated: true,
                            title: "Finalizar torneo",
                            body: <ModalBodyDeleteTournament id={0} />,
                          })
                        }
                        className="p-2 mb-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl hover:bg-surface text-secondary"
                      >
                        Eliminar torneo
                      </DropdownMenu.Item>
                    </motion.div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              )}
            </AnimatePresence>
          </DropdownMenu.Root>

          <div className="flex flex-col gap-1 absolute bottom-0 left-60 translate-y-[calc(100%+1.5rem)]">
            <h2 className="text-3xl font-bold text-ink">Torneo Verano II</h2>

            <div className="flex items-center gap-2">
              <Merge className="size-4 min-w-4 min-h-4" />

              <h3 className="text-sm font-semibold text-primary">
                Eliminación directa
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-10 p-10 rounded-xl bg-surface">
          <div className="grid grid-cols-3">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <UserRound className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Rango de edad</p>
              </div>
              <p className="text-sm text-muted">17 a 20 años</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <ClockAlert className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Inscripciones</p>
              </div>
              <p className="text-sm text-muted">
                10 de junio de 2026 al 21 de junio de 2026
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <CalendarDays className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Duración</p>
              </div>
              <p className="text-sm text-muted">
                22 de junio de 2026 al 30 de junio de 2026
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <Venus className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Tipo</p>
              </div>
              <p className="text-sm text-muted">Femenino</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <LoaderPinwheel className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Deporte</p>
              </div>
              <p className="text-sm text-muted">Básketbol</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Ubicación</p>
              </div>
              <p className="text-sm text-muted">Nogales, Sonora. México</p>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-6">
          <div className="flex flex-col w-full gap-2 p-10 bg-surface rounded-xl">
            <p className="text-lg font-semibold">Descripción</p>
            <p className="text-muted">Torneo de verano en localidad la mesa</p>
          </div>

          <div className="flex flex-col w-full gap-4 p-10 bg-surface rounded-xl">
            <p className="text-lg font-semibold">Reglamento</p>

            <DinamicButton
              action={() => {}}
              type="filled"
              label="Descargar"
              twClassName="w-fit py-1 text-sm"
              icon={<Download className="size-4 min-w-4 min-h-4" />}
            />
          </div>

          <div className="flex flex-col w-full gap-6 p-10 bg-surface rounded-xl">
            <p className="text-lg font-semibold">Organización</p>

            <div className="flex items-center gap-6">
              <Image
                alt="Organización"
                src={organization1}
                quality={70}
                loading="lazy"
                className="object-cover object-center w-24 h-24 rounded-full min-h-24 min-w-24"
              />

              <div className="min-w-0">
                <p className="text-lg font-bold text-ink">Sede Deportes</p>
                <p className="mb-2 text-sm line-clamp-2">
                  La mejor sede de deportes en todo Sonora, México
                </p>
                <DinamicButton
                  action={() => {}}
                  type="filled"
                  label="Ver más"
                  twClassName="w-fit text-sm py-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-6 p-10 bg-surface rounded-xl">
          <p className="text-lg font-semibold">Equipos</p>

          <CarouselManual
            slides={teams.map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <Image
                  loading="lazy"
                  alt="Equipo"
                  src={t.image}
                  className="rounded-full w-22 h-22 min-w-22 min-h-22"
                />

                <p className="font-bold text-center line-clamp-1 text-ink">
                  {t.name}
                </p>
              </div>
            ))}
            options={{ dragFree: true }}
          />
        </div>

        <div className="flex flex-col w-full gap-6 p-10 bg-surface rounded-xl">
          <p className="text-lg font-semibold">Hashtags</p>
          <div className="flex flex-wrap gap-6">
            {[
              "El mejor torneo",
              "Lo mejores",
              "Compañerismo",
              "Camaradería",
              "Nogales",
            ].map((t, i) => (
              <p key={i}>#{t}</p>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
