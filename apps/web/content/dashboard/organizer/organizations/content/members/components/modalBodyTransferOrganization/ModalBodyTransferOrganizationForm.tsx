"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* HOOKS */
import { useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

/* LIBS */
import { AnimatePresence, motion } from "framer-motion";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { TransferOrganizationFormType } from "./types/transferOrganizationFormType";
import { DinamicCheckboxOptions } from "@/content/shared/form/dinamicCheckboxOptions/DinamicCheckboxOptions";

type Step = {
  title: string;
  description?: string;
  fields: (keyof TransferOrganizationFormType)[];
  component: React.ReactNode;
};

export function ModalBodyTransferOrganization() {
  const router = useRouter();

  const { setAnnouncement } = useAnnouncement();
  const { setModal, modal } = useModal();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const methods = useForm<TransferOrganizationFormType>({
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      id: "",
    },
  });

  const { trigger, handleSubmit } = methods;

  const steps: Step[] = useMemo(() => {
    const commonSteps: Step[] = [
      {
        title: "Paso 1 de 4: Advertencia",
        fields: [],
        component: (
          <p>
            Si desea designarle el rol de propietario a otro miembro de su
            organización y pasar a ser administrador, dar clic en{" "}
            <span className="text-secondary font-bold">Siguiente</span>
          </p>
        ),
      },
      {
        title: "Paso 2 de 4: Seleccionar nuevo propietario",
        fields: ["id"],
        component: (
          <div className="w-full">
            <DinamicCheckboxOptions<TransferOrganizationFormType>
              name="id"
              options={[
                { label: "Pirita D", value: "111" },
                { label: "Cornalina D", value: "222" },
                { label: "Nau D", value: "333" },
              ]}
              multiple={false}
              label=""
            />
            <DinamicButton
              action={() => {}}
              type="unfilled"
              label="Ver más"
              twClassName="w-fit py-1 text-sm"
            />
          </div>
        ),
      },
      {
        title: "Paso 3 de 4: Confirmación",
        fields: [],
        component: (
          <div>
            <p>
              Al dar clic en{" "}
              <span className="text-secondary font-bold">Siguiente</span> el
              miembro Nombres Apellidos, será el nuevo propietario de la
              organización Nombre. Por lo tanto, usted pasará a ser
              administrador
            </p>
            <p>¿Desea continuar?</p>
          </div>
        ),
      },
      {
        title: "Paso 4 de 4: Transferir",
        fields: [],
        component: (
          <div>
            <p>
              No podrá volver a ser propetario al menos que el propetiario
              actúal le vuelva a dar el rol
            </p>
            <p>
              ¿Está completamente seguro de su desición? De clic en{" "}
              <span className="text-secondary font-bold">Transferir</span> si lo
              está (será redireccionado a sus organizaciones)
            </p>
          </div>
        ),
      },
    ];

    return commonSteps;
  }, []);

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const nextStep = async () => {
    const isValid = await trigger(currentStep.fields);

    if (!isValid) return;

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step === 0) return;

    setStep((prev) => prev - 1);
  };

  const onSubmit: SubmitHandler<TransferOrganizationFormType> = async (
    data,
  ) => {
    setSaving(true);

    const cleanData = { ...data };

    setTimeout(() => {
      console.log(cleanData);
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Organización transferida correctamente",
      });
      setSaving(false);
      setModal({
        isActivated: false,
        title: modal.title ?? "",
        body: <></>,
      });
      router.push(`/organizer/organizations`);
    }, 1000);
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full h-full flex flex-col p-6 overflow-y-auto max-h-96">
        {/* TITLE */}
        <h2 className="text-lg font-bold mb-2 shrink-0">{currentStep.title}</h2>

        {/* ANIMATED CONTENT */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <div className="w-full h-fit overflow-y-auto overflow-x-hidden p-1 md:flex md: items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  x: 40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -40,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="w-full min-h-full md:min-h-fit flex items-center"
              >
                {currentStep.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-center gap-6 w-full h-fit mt-4 shrink-0">
          <DinamicButton
            action={prevStep}
            disabled={step === 0}
            disabledSpinner={false}
            label="Anterior"
            spinFromText={false}
            twClassName="w-fit h-fit py-1"
            type={step === 0 ? "disabled" : "destructive"}
          />

          {/* DOTS */}
          <div className="flex items-center justify-center gap-3">
            {steps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setStep(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === step ? "bg-secondary scale-150" : "bg-faint"
                }`}
              />
            ))}
          </div>

          {!isLastStep ? (
            <DinamicButton
              action={nextStep}
              disabled={false}
              disabledSpinner={false}
              label="Siguiente"
              spinFromText={false}
              twClassName="w-fit h-fit py-1"
              type="destructive"
            />
          ) : (
            <DinamicButton
              action={handleSubmit(onSubmit)}
              disabled={saving}
              disabledSpinner={true}
              label="Transferir"
              spinFromText={false}
              twClassName="w-fit h-fit py-1"
              type={saving ? "disabled" : "destructive"}
            />
          )}
        </div>
      </div>
    </FormProvider>
  );
}
