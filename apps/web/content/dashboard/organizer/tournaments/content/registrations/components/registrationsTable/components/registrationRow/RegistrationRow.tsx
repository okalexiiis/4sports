"use client";

/* COMPONENTS */
import { DinamicRow } from "@/content/shared/ui/dinamicTable/components/dinamicRow/DinamicRow";
import { DinamicTd } from "@/content/shared/ui/dinamicTable/components/dinamicTd/DinamicTd";
import Image from "next/image";
import { ModalBodyAcceptDeclineRegistration } from "../../../modalBodyAcceptDeclineRegistration/ModalBodyAcceptDeclineRegistration";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* ICONS */
import { Check, X } from "lucide-react";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { RegistrationType } from "../../types/registrationType";

/* UTILS */
import { formatDate } from "@/content/shared/utils/formatDate";

export function RegistrationRow({
  registration,
  twBgColor,
}: {
  registration: RegistrationType;
  twBgColor: string;
}) {
  const { setModal } = useModal();

  return (
    <DinamicRow twBgColor={twBgColor}>
      <DinamicTd twClassName="text-nowrap">
        <div className="flex items-center gap-4">
          <Image
            alt="Equipo"
            src={registration.teamPhoto}
            quality={70}
            loading="lazy"
            className="w-10 h-10 min-w-10 min-h-10 rounded-full"
          />

          <p>{registration.teamName}</p>
        </div>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{formatDate(registration.date)}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <div className="flex gap-6">
          <DinamicButton
            action={() =>
              setModal({
                isActivated: true,
                title: "Rechazar equipo",
                body: (
                  <ModalBodyAcceptDeclineRegistration
                    id=""
                    teamName={registration.teamName}
                    wantTo="decline"
                  />
                ),
              })
            }
            type={"destructive"}
            icon={<X className="size-4 min-w-4 min-h-4" />}
            twClassName="w-fit text-sm py-1"
            label="Rechazar"
          />

          <DinamicButton
            action={() =>
              setModal({
                isActivated: true,
                title: "Aceptar equipo",
                body: (
                  <ModalBodyAcceptDeclineRegistration
                    id=""
                    teamName={registration.teamName}
                    wantTo="accept"
                  />
                ),
              })
            }
            type={"filled"}
            icon={<Check className="size-4 min-w-4 min-h-4" />}
            twClassName="w-fit text-sm py-1"
            label="Aceptar"
          />
        </div>
      </DinamicTd>
    </DinamicRow>
  );
}
