"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import Image from "next/image";
import { ModalBodyUpdateOrganizationContext } from "../modalBodyUpdateOrganizationContext/ModalBodyUpdateOrganizationContext";

/* ICONS */
import { Pointer, SquarePen } from "lucide-react";

/* LIBS */
import { motion } from "framer-motion";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { OrganizationCardType } from "./types/OrganizationCardType";

export function OrganizationCard({
  isSelected,
  image,
  name,
  description,
  slug,
  role,
  banner,
}: OrganizationCardType) {
  const router = useRouter();

  const { setModal } = useModal();

  const getRole = (role: "owner" | "admin" | "viewer" | "organizer") => {
    switch (role) {
      case "owner":
        return "Dueño";

      case "admin":
        return "Administrador";

      case "viewer":
        return "Solo ver";

      case "organizer":
        return "Organizador";
    }
  };

  return (
    <motion.div
      className="flex flex-col relative rounded-xl border-2 justify-between w-full items-center gap-6"
      style={
        isSelected
          ? {
              backgroundColor: "var(--primary-background)",
              borderColor: "var(--primary)",
            }
          : {
              backgroundColor: "var(--background)",
              borderColor: "var(--line)",
            }
      }
      whileHover={
        isSelected
          ? { scale: 1.03 }
          : {
              scale: 1.03,
              borderColor: "var(--primary)",
            }
      }
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        scale: { duration: 0.3 },
        backgroundColor: { duration: 0.3 },
        borderColor: { duration: 0.3 },
      }}
    >
      <div className="w-full h-fit flex flex-col gap-6">
        <div className="w-full h-28 min-h-28 relative">
          <div className="absolute inset-0 bg-linear-to-b from-black/50 to-transparent rounded-t-xl z-10" />

          {isSelected && (
            <div
              className={`py-1 px-3 rounded-full absolute top-4 right-4 shadow-md bg-primary z-10`}
            >
              <p className="font-bold text-black text-sm">Seleccionada</p>
            </div>
          )}

          <Image
            alt="Organización"
            src={banner}
            quality={70}
            fill
            className="rounded-t-xl object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-6 items-center min-w-0 w-full px-6">
          <div className="min-w-0 flex items-center w-full gap-6">
            <Image
              alt="Organización"
              src={image}
              quality={70}
              className="w-16 h-16 min-w-16 min-h-16 rounded-xl object-cover object-center border border-line"
            />
            <div>
              <p className="font-bold text-lg text-left text-ink line-clamp-1">{name}</p>
              <p className="text-sm font-semibold mb-2 text-primary">
                {getRole(role)}
              </p>
            </div>
          </div>
          <p className="text-sm line-clamp-2 text-muted">{description}</p>
        </div>
      </div>

      <div className="flex gap-6 w-full px-6 pb-6">
        {!isSelected && (
          <DinamicButton
            action={() =>
              setModal({
                isActivated: true,
                title: "Seleccionar Organización",
                body: (
                  <ModalBodyUpdateOrganizationContext
                    slug={slug}
                    orgName={name}
                  />
                ),
              })
            }
            type="unfilled"
            twClassName="py-1 text-sm"
            icon={<Pointer className="size-4 min-h-4 min-w-4" />}
            label="Seleccionar"
          />
        )}

        <DinamicButton
          action={() => router.push(`/organizer/organizations/${slug}`)}
          type="unfilled"
          twClassName="py-1 text-sm"
          icon={<SquarePen className="size-4 min-h-4 min-w-4" />}
          label="Gestionar"
        />
      </div>
    </motion.div>
  );
}
