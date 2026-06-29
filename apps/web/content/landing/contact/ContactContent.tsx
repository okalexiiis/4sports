"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicTextArea } from "@/content/shared/form/dinamicTextArea/DinamicTextArea";
import { TitleWithDescription } from "@/content/shared/ui/titleWithDescription/TitleWithDescription";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* ICONS */
import { FourSportsIcon } from "@/content/shared/icons/fourSports/FourSportsIcon";

/* LIBS */
import { motion } from "framer-motion";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
type LoginForm = {
  email: string
  password: string
}

export function ContactContent() {
  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);

  const methods = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <motion.div
      className="flex flex-col justify-center w-full gap-4 py-32 min-h-dvh"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
    >
      <div className="relative z-10 px-6 mx-auto max-w-7xl">
        <div className="w-24 m-auto mb-4">
          <FourSportsIcon />
        </div>
        <TitleWithDescription
          title="Contacto"
          description="Si tienes dudas o comentarios no dudes en hablar con nosotros"
        />
      </div>

      <div className="w-1/2 m-auto h-fit">
        <FormProvider {...methods}>
          <DinamicInputText<LoginForm>
            name="email"
            label="Correo"
            placeholder="Tu correo"
          />
          <DinamicInputText<LoginForm>
            name="email"
            label="Asunto"
            placeholder="Tu asunto"
          />
          <DinamicTextArea<LoginForm>
            name="email"
            label="Mensaje"
            placeholder="Tu mensaje"
          />

          <DinamicButton
            action={() => {}}
            twClassName="w-full h-fit py-2 px-4 rounded-xl"
            disabled={false}
            disabledSpinner={false}
            type={"filled"}
            label="Envíar"
            spinFromText
          />
        </FormProvider>
      </div>
    </motion.div>
  );
}
