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

export function OrganizerTournamentsContent({ slug }: { slug: string }) {
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
      <div className="w-full h-fit p-6 flex flex-col gap-6">
        <div className="w-full h-54 rounded-xl bg-surface relative mb-22">
          <Image
            alt="Banner"
            src={banner1}
            quality={70}
            fill
            loading="eager"
            className="rounded-xl object-cover object-center"
          />

          <div className="w-48 h-48 min-w-48 min-h-48 absolute left-6 bottom-0 translate-y-1/2 rounded-full border-background border-8 bg-background">
            {/* FOTO */}
            <Image
              alt="Torneo"
              src={tournament1}
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
                      className="z-100 min-w-56 rounded-2xl border border-line p-2 shadow-md bg-background"
                    >
                      <DropdownMenu.Item
                        onClick={() =>
                          setModal({
                            isActivated: true,
                            title: "Actualizar torneo",
                            body: <ModalBodyUpdateTournament />,
                          })
                        }
                        className="rounded-xl p-2 text-sm outline-none cursor-pointer mb-2 transition-colors duration-300 hover:bg-surface"
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
                        className="rounded-xl p-2 text-sm outline-none cursor-pointer mb-2 transition-colors duration-300 hover:bg-surface"
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
                        className="rounded-xl p-2 text-sm outline-none cursor-pointer mb-2 transition-colors duration-300 hover:bg-surface"
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
                        className="rounded-xl p-2 text-sm outline-none cursor-pointer mb-2 transition-colors duration-300 hover:bg-surface text-secondary"
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

            <div className="flex gap-2 items-center">
              <Merge className="size-4 min-w-4 min-h-4" />

              <h3 className="text-primary text-sm font-semibold">
                Eliminación directa
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-10 rounded-xl p-10 bg-surface">
          <div className="grid grid-cols-3">
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex gap-2 items-center justify-center">
                <UserRound className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Rango de edad</p>
              </div>
              <p className="text-sm text-muted">17 a 20 años</p>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex gap-2 items-center justify-center">
                <ClockAlert className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Inscripciones</p>
              </div>
              <p className="text-sm text-muted">
                10 de junio de 2026 al 21 de junio de 2026
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex gap-2 items-center justify-center">
                <CalendarDays className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Duración</p>
              </div>
              <p className="text-sm text-muted">
                22 de junio de 2026 al 30 de junio de 2026
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex gap-2 items-center justify-center">
                <Venus className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Tipo</p>
              </div>
              <p className="text-sm text-muted">Femenino</p>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex gap-2 items-center justify-center">
                <LoaderPinwheel className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Deporte</p>
              </div>
              <p className="text-sm text-muted">Básketbol</p>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="flex gap-2 items-center justify-center">
                <MapPin className="size-4 min-w-4 min-h-4 text-ink" />
                <p>Ubicación</p>
              </div>
              <p className="text-sm text-muted">Nogales, Sonora. México</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 w-full">
          <div className="flex flex-col gap-2 bg-surface rounded-xl p-10 w-full">
            <p className="font-semibold text-lg">Descripción</p>
            <p className="text-muted">Torneo de verano en localidad la mesa</p>
          </div>

          <div className="p-10 bg-surface rounded-xl flex flex-col gap-4 w-full">
            <p className="font-semibold text-lg">Reglamento</p>

            <DinamicButton
              action={() => {}}
              type="filled"
              label="Descargar"
              twClassName="w-fit py-1 text-sm"
              icon={<Download className="size-4 min-w-4 min-h-4" />}
            />
          </div>

          <div className="flex flex-col gap-6 bg-surface rounded-xl p-10 w-full">
            <p className="font-semibold text-lg">Organización</p>

            <div className="flex gap-6 items-center">
              <Image
                alt="Organización"
                src={organization1}
                quality={70}
                loading="lazy"
                className="rounded-full object-cover object-center h-24 w-24 min-h-24 min-w-24"
              />

              <div className="min-w-0">
                <p className="text-lg text-ink font-bold">Sede Deportes</p>
                <p className="text-sm mb-2 line-clamp-2">
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

        <div className="bg-surface p-10 w-full flex flex-col gap-6 rounded-xl">
          <p className="font-semibold text-lg">Equipos</p>

          <CarouselManual
            slides={teams.map((t, i) => (
              <div key={i} className="flex flex-col gap-4 items-center">
                <Image
                  loading="lazy"
                  alt="Equipo"
                  src={t.image}
                  className="w-22 h-22 min-w-22 min-h-22 rounded-full"
                />

                <p className="line-clamp-1 text-center text-ink font-bold">
                  {t.name}
                </p>
              </div>
            ))}
            options={{ dragFree: true }}
          />
        </div>

        <div className="bg-surface p-10 w-full flex flex-col gap-6 rounded-xl">
          <p className="font-semibold text-lg">Hashtags</p>
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
