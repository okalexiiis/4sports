"use client";

/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import { AddOrganizationForm } from "../components/addOrganizationForm/AddOrganizationForm";
import { Plans } from "@/content/shared/ui/plans/Plans";

/* HOOKS */
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

/* LIBS */
import { AnimatePresence, motion } from "framer-motion";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
import { AddOrganizationFormType } from "../types/addOrganizationFormType";

export function OrganizerAddOrganizationContent() {
  const router = useRouter();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);
  const [finished, setFinished] = useState(false);

  const methods = useForm<AddOrganizationFormType>({
    defaultValues: {
      orgName: "",
      orgDescription: "",
    },
  });

  const onSubmit = async (data: AddOrganizationFormType) => {
    try {
      setSaving(true);

      console.log(data);

      setTimeout(() => {
        setAnnouncement({
          isActivated: true,
          announceType: "ok",
          message: "Organización guardada correctamente, seleccione un plan",
        });
        setFinished(true);
      }, 1000);
    } catch (error) {
      setSaving(false);
      console.log("Error", error);
    }
  };

  const onSelectArray: (() => void)[] = [
    () => {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Pago guardado correctamente",
      });
      router.push("/organizer/organizations");
    },
    () => {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Pago guardado correctamente",
      });
      router.push("/organizer/organizations");
    },
    () => {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Pago guardado correctamente",
      });
      router.push("/organizer/organizations");
    },
    () => {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Pago guardado correctamente",
      });
      router.push("/organizer/organizations");
    },
  ];

  return (
    <SectionContainer>
      <div className="p-6 flex flex-col h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={finished ? "plans" : "form"}
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
            className="w-full h-full flex items-center"
          >
            {!finished ? (
              <FormProvider {...methods}>
                <AddOrganizationForm
                  action={methods.handleSubmit(onSubmit)}
                  saving={saving}
                />
              </FormProvider>
            ) : (
              <Plans wantWait={false} onSelectArray={onSelectArray} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionContainer>
  );
}
