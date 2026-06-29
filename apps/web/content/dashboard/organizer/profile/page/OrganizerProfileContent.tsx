"use client";

/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import Image from "next/image";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { ModalBodyUpdateProfilePhotoForm } from "./components/modalBodyUpdateProfilePhoto/ModalBodyUpdateProfilePhotoForm";
import { ModalBodyUpdateProfileInfoForm } from "./components/modalBodyUpdateProfileInfo/ModalBodyUpdateProfileInfoForm";

/* ICONS */
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  SquarePen,
  UserRound,
  VenusAndMars,
} from "lucide-react";

/* IMAGES */
import user1 from "./images/user1.jpg";
import banner1 from "./images/banner1.jpg";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

export function OrganizerProfileContent() {
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
                alt="Usuario"
                src={user1}
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
                      body: <ModalBodyUpdateProfilePhotoForm id="" />,
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
                  title: "Actualizar perfil",
                  body: <ModalBodyUpdateProfileInfoForm id="" />,
                })
              }
              type="filled"
              label="Actualizar perfil"
              icon={<SquarePen className="size-4 min-w-4 min-h-4" />}
              twClassName="w-fit text-sm py-1 absolute bottom-0 right-0 translate-y-[calc(100%+1.5rem)]"
            />

            <div className="flex flex-col gap-1 absolute bottom-0 left-60 translate-y-[calc(100%+1.5rem)]">
              <h2 className="text-3xl font-bold text-ink">Julián López</h2>
              <h3 className="text-primary text-sm font-semibold">
                Organizador
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full gap-6">
            <div className="flex flex-col gap-6 bg-surface rounded-xl p-6 text-sm">
              <p className="font-semibold text-lg">Información básica</p>

              <div className="grid grid-cols-2 text-muted">
                <div className="flex flex-col gap-6">
                  <div className="flex gap-2 items-center">
                    <UserRound className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Nombre completo</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Calendar className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Fecha de nacimiento</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <VenusAndMars className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Género</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <p>Julián López Garza</p>
                  <p>27 de Marzo del 2002</p>
                  <p>Masculino</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 bg-surface rounded-xl p-6 text-sm">
              <p className="font-semibold text-lg">Información de contacto</p>

              <div className="grid grid-cols-2 text-muted">
                <div className="flex flex-col gap-6">
                  <div className="flex gap-2 items-center">
                    <Phone className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Teléfono</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MapPin className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Ubicación</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Mail className="size-4 min-w-4 min-h-4 text-body" />
                    <p>Correo</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <p>+52 631 202 7089</p>
                  <p>Nogales, Sonora. México</p>
                  <p>julian@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
