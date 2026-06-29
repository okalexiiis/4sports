"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import Image from "next/image";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* IMAGES */
import team1 from "./images/team1.jpg";
import team2 from "./images/team2.jpg";
import team3 from "./images/team3.jpg";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
import { FinishTournamentFormType } from "./types/finishTournamentFormType";
import { AnimatePresence, motion } from "framer-motion";

export function ModalBodyFinishTournament() {
  const { setModal, modal } = useModal();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);
  const [finish, setFinish] = useState<"si" | "no">("no");

  const methods = useForm<FinishTournamentFormType>({
    defaultValues: {
      id: "",
    },
  });

  const onSubmit = async (data: FinishTournamentFormType) => {
    try {
      setSaving(true);

      console.log(data);

      setTimeout(() => {
        setSaving(false);
        setAnnouncement({
          isActivated: true,
          announceType: "ok",
          message: "Torneo finalizado correctamente",
        });
        setModal({
          isActivated: false,
          title: modal.title ?? "",
          body: modal.body,
        });
      }, 1000);
    } catch (error) {
      setSaving(false);
      console.log("Error", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <AnimatePresence mode="wait">
        <motion.div
          key={finish}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="p-6"
        >
          {finish === "no" ? (
            <>
              <div className="w-full h-fit flex gap-6 flex-col">
                <p className="text-center text-primary font-bold">
                  Ranking final
                </p>

                <div className="w-full h-fit flex gap-6 justify-center items-end">
                  <div className="flex flex-col gap-4 items-center w-24 min-w-0">
                    <Image
                      alt="Equipo"
                      src={team1}
                      loading="lazy"
                      className="w-12 h-12 min-w-12 min-h-12 rounded-full"
                      quality={70}
                    />

                    <p className="text-ink font-bold truncate w-full text-center">Los Grandes</p>

                    <div className="w-24 h-12 min-w-24 min-h-12 rounded-xl bg-surface flex items-center justify-center">
                      <p className="text-ink font-bold">2°</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 items-center min-w-0 w-24 justify-center">
                    <Image
                      alt="Equipo"
                      src={team2}
                      loading="lazy"
                      className="w-12 h-12 min-w-12 min-h-12 rounded-full"
                      quality={70}
                    />

                    <p className="text-ink font-bold truncate w-full text-center">Águilas</p>

                    <div className="w-24 h-24 min-w-24 min-h-24 rounded-xl bg-surface flex items-center justify-center">
                      <p className="text-ink font-bold">1°</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 items-center w-24 min-w-0 h-fit justify-center">
                    <Image
                      alt="Equipo"
                      src={team3}
                      loading="lazy"
                      className="w-12 h-12 min-w-12 min-h-12 rounded-full"
                      quality={70}
                    />

                    <p className="text-ink truncate font-bold w-full text-center">Toros Negros</p>

                    <div className="w-24 h-12 min-w-24 min-h-12 rounded-xl bg-surface flex items-center justify-center">
                      <p className="text-ink font-bold">3°</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <DinamicButton
                  action={() =>
                    setModal({
                      isActivated: false,
                      title: modal.title ?? "",
                      body: modal.body,
                    })
                  }
                  type="unfilled"
                  label="Cancelar"
                />
                <DinamicButton
                  action={() => setFinish("si")}
                  type={saving ? "disabled" : "filled"}
                  disabled={saving}
                  disabledSpinner={true}
                  spinFromText={true}
                  label="Siguiente"
                />
              </div>
            </>
          ) : (
            <div className="w-full h-fit flex flex-col gap-6">
              <div>
                <p>
                  Al dar clic en{" "}
                  <span className="text-primary font-bold">
                    Finalizar torneo
                  </span>
                  , el torneo será finalizado oficialmente
                </p>
                <p>¿Desea continuar?</p>
              </div>

              <div className="flex gap-6">
                <DinamicButton
                  action={() => setFinish("no")}
                  type="unfilled"
                  label="Atrás"
                />
                <DinamicButton
                  action={methods.handleSubmit(onSubmit)}
                  type={saving ? "disabled" : "filled"}
                  disabled={saving}
                  disabledSpinner={true}
                  spinFromText={true}
                  label="Finalizar torneo"
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </FormProvider>
  );
}
