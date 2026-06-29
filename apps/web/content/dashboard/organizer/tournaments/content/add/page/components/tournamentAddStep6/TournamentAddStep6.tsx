"use client";

/* COMPONENTS */
import Image from "next/image";
import { SpecificInputFileImage } from "../specificInputFileImage/SpecificInputFileImage";

/* HOOKS */
import { useFormContext, useWatch } from "react-hook-form";

/* ICONS */
import {
  CalendarDays,
  CircleQuestionMark,
  ClockAlert,
  Download,
  Grid2x2,
  LoaderPinwheel,
  MapPin,
  Mars,
  Merge,
  UserRound,
  Venus,
  VenusAndMars,
} from "lucide-react";

/* IMAGES */
import banner1 from "../../images/banner1.jpg";
import banner2 from "../../images/banner2.jpg";
import banner3 from "../../images/banner3.jpg";
import organization1 from "../../images/organization1.png";

/* LIBS */
import { format } from "date-fns";
import { es } from "date-fns/locale";

/* TYPES */
import { TournamentAddFormType } from "../../types/tournamentAddFormType";
import { DateRange } from "react-day-picker";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

export function TournamentAddStep6({ preview }: { preview: string | null }) {
  const { control } = useFormContext();

  const name = useWatch({
    control: control,
    name: "name",
  });

  const type = useWatch({
    control: control,
    name: "type",
  });

  const sport = useWatch({
    control: control,
    name: "sport",
  });

  const description = useWatch({
    control: control,
    name: "description",
  });

  const ageGap: { min: number; max: number } | undefined = useWatch({
    control: control,
    name: "ageGap",
  });

  const registrationInterval: DateRange | undefined = useWatch({
    control: control,
    name: "registrationInterval",
  });

  const gameInterval: DateRange | undefined = useWatch({
    control: control,
    name: "gameInterval",
  });

  const sex = useWatch({
    control: control,
    name: "sex",
  });

  const tags: string[] | undefined = useWatch({
    control: control,
    name: "tags",
  });

  const bgColors = [
    "bg-muted/0",
    "bg-muted/20",
    "bg-muted/40",
    "bg-muted/60",
    "bg-muted/80",
  ];

  return (
    <div className="w-full h-fit p-6 flex flex-col gap-6">
      <div className="w-full h-54 rounded-xl bg-surface relative mb-22">
        {sport === undefined || sport === "" ? (
          <div className="w-full h-full bg-surface rounded-xl" />
        ) : (
          <Image
            alt="Banner"
            src={
              sport === "futball"
                ? banner1
                : sport === "basketball"
                  ? banner2
                  : banner3
            }
            quality={70}
            fill
            loading="eager"
            className="rounded-xl object-cover object-center"
          />
        )}

        <div className="w-48 h-48 min-w-48 min-h-48 absolute left-6 bottom-0 translate-y-1/2 rounded-full border-background">
          {/* FOTO */}
          <SpecificInputFileImage<TournamentAddFormType>
            name="image"
            preview={preview}
            rules={{
              validate: (file) => {
                if (!(file instanceof File)) return true;

                if (file.size > 5_000_000) {
                  return "El archivo debe pesar menos de 5MB";
                }

                return true;
              },
            }}
            twClassNameContainer={`border-8 border-background ${preview === null ? "bg-surface" : "bg-background"}`}
            twClassNameButton="border-6"
          />
        </div>

        <div className="flex flex-col gap-1 absolute bottom-0 left-60 translate-y-[calc(100%+1.5rem)]">
          <h2 className="text-3xl font-bold text-ink">
            {name !== undefined && name !== "" ? name : "Nombre Vacío"}
          </h2>

          <div className="flex gap-2 items-center">
            {type === "Eliminatoria directa" ? (
              <Merge className="size-4 min-w-4 min-h-4" />
            ) : (
              <Grid2x2 className="size-4 min-w-4 min-h-4" />
            )}

            <h3 className="text-primary text-sm font-semibold">
              {type !== undefined
                ? type === "round-robin"
                  ? "Todos contra todos"
                  : type === "direct-elimination"
                    ? "Eliminación directa"
                    : "Tipo Vacío"
                : "Tipo Vacío"}
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
            <p className="text-sm text-muted">
              {ageGap === undefined
                ? "Sin rango"
                : ageGap.min.toString() +
                  " a " +
                  ageGap.max.toString() +
                  " años"}
            </p>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex gap-2 items-center justify-center">
              <ClockAlert className="size-4 min-w-4 min-h-4 text-ink" />
              <p>Inscripciones</p>
            </div>
            <p className="text-sm text-muted">
              {registrationInterval === undefined
                ? "Fechas no establecidas"
                : renderValue(registrationInterval) === null
                  ? "Fechas vacías"
                  : renderValue(registrationInterval)}
            </p>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex gap-2 items-center justify-center">
              <CalendarDays className="size-4 min-w-4 min-h-4 text-ink" />
              <p>Duración</p>
            </div>
            <p className="text-sm text-muted">
              {gameInterval === undefined
                ? "Fechas no establecidas"
                : renderValue(gameInterval) === null
                  ? "Fechas vacías"
                  : renderValue(gameInterval)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3">
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex gap-2 items-center justify-center">
              {sex !== undefined && sex !== "" ? (
                sex === "m" ? (
                  <Mars className="size-4 min-w-4 min-h-4 text-ink" />
                ) : sex === "f" ? (
                  <Venus className="size-4 min-w-4 min-h-4 text-ink" />
                ) : (
                  <VenusAndMars className="size-4 min-w-4 min-h-4 text-ink" />
                )
              ) : (
                <CircleQuestionMark className="size-4 min-w-4 min-h-4 text-ink" />
              )}
              <p>Tipo</p>
            </div>
            <p className="text-sm text-muted">
              {sex !== undefined && sex !== ""
                ? sex === "m"
                  ? "Masculino"
                  : sex === "f"
                    ? "Femenino"
                    : "Mixto"
                : "Sin tipo"}
            </p>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="flex gap-2 items-center justify-center">
              <LoaderPinwheel className="size-4 min-w-4 min-h-4 text-ink" />
              <p>Deporte</p>
            </div>
            <p className="text-sm text-muted">
              {sport !== undefined && sport !== ""
                ? sport === "futball"
                  ? "Fútbol"
                  : sport === "basketball"
                    ? "Básketbol"
                    : "Tochito"
                : "Sin deporte"}
            </p>
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
          <p className="text-muted">
            {description !== undefined && description !== ""
              ? description
              : "Sin descripción"}
          </p>
        </div>

        <div className="p-10 bg-surface rounded-xl flex flex-col gap-4 w-1/3 min-w-1/3">
          <p className="font-semibold text-lg">Reglamento</p>

          <DinamicButton
            action={() => {}}
            type="filled"
            label="Descargar"
            twClassName="w-fit py-1 text-sm"
            icon={<Download className="size-4 min-w-4 min-h-4" />}
          />
        </div>

        <div className="flex flex-col gap-6 bg-surface rounded-xl p-10 w-1/3 min-w-1/3">
          <p className="font-semibold text-lg">Organización</p>

          <div className="flex gap-6">
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
        <p className="text-muted">El torneo no cuenta con equipos</p>
      </div>

      <div className="bg-surface p-10 w-full flex flex-col gap-6 rounded-xl">
        <p className="font-semibold text-lg">Hashtags</p>
        <div className="flex flex-wrap gap-6">
          {tags === undefined ? (
            <p>Hashtags vacío</p>
          ) : tags.length === 0 ? (
            <p>No se encontraron hashtags</p>
          ) : (
            tags.map((t, i) => <p key={i}>#{t}</p>)
          )}
        </div>
      </div>
    </div>
  );
}

const renderValue = (value: DateRange) => {
  const range = value as DateRange;

  if (range?.from && range?.to) {
    return `${format(range.from, "PPP", { locale: es })} al ${format(
      range.to,
      "PPP",
      { locale: es },
    )}`;
  }

  if (range?.from) {
    return format(range.from, "PPP", { locale: es });
  }

  return null;
};
