"use client";

/* COMPONENTS */
import { OnboardingGeneralFormStep1 } from "@/content/auth/onboarding/components/steps/general/OnboardingGeneralFormStep1";
import { OnboardingGeneralFormStep2 } from "@/content/auth/onboarding/components/steps/general/OnboardingGeneralFormStep2";
import { OnboardingGeneralFormStep3 } from "@/content/auth/onboarding/components/steps/general/OnboardingGeneralFormStep3";
import { OnboardingPlayerStep1 } from "@/content/auth/onboarding/components/steps/player/OnboardingPlayerFormStep1";
import { OnboardingOrganizerFormStep1 } from "@/content/auth/onboarding/components/steps/organizer/OnboardingOrganizerStep1";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* HOOKS */
import { useMemo, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";

/* ICONS */
import { FourSportsIcon } from "@/content/shared/icons/fourSports/FourSportsIcon";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

/* LIBS */
import { AnimatePresence, motion } from "framer-motion";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* TYPES */
import { OnboardingForm } from "@/content/auth/onboarding/types/onboardingForm";
import { Step } from "@/content/auth/onboarding/types/step";

export function OnboardingContent() {
  const router = useRouter();

  const { setAnnouncement } = useAnnouncement();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [finish, setFinish] = useState(false);

  const methods = useForm<OnboardingForm>({
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      username: "",
      nombres: "",
      apellidos: "",

      lada: "",
      pais: "",
      estado: "",
      ciudad: "",

      role: "player",

      deportes: [],
      posicion: "",
      buscandoEquipo: false,

      nombreOrganizacion: "",
      descripcionOrganizacion: "",
    },
  });

  const { trigger, handleSubmit, resetField } = methods;

  const role = useWatch({
    control: methods.control,
    name: "role",
  });

  const steps: Step[] = useMemo(() => {
    const commonSteps: Step[] = [
      {
        title: "¿Quién eres?",
        fields: ["fotoPerfil", "username", "nombres", "apellidos"],
        component: <OnboardingGeneralFormStep1 />,
      },
      {
        title: "Contacto",
        fields: ["lada", "telefono", "pais", "estado", "ciudad"],
        component: <OnboardingGeneralFormStep2 />,
      },
      {
        title: "Elige tu rol",
        description: "¿Para que deseas utilizar 4Sports?",
        fields: ["role"],
        component: <OnboardingGeneralFormStep3 />,
      },
    ];

    const playerSteps: Step[] = [
      {
        title: "Tu pasión",
        fields: ["deportes", "posicion", "buscandoEquipo"],
        component: <OnboardingPlayerStep1 />,
      },
    ];

    const organizerSteps: Step[] = [
      {
        title: "Tu organización",
        fields: [
          "fotoOrganizacion",
          "nombreOrganizacion",
          "descripcionOrganizacion",
        ],
        component: <OnboardingOrganizerFormStep1 />,
      },
    ];

    if (role === "player") {
      resetField("fotoOrganizacion");
      resetField("nombreOrganizacion");
      resetField("descripcionOrganizacion");
    }

    if (role === "organizer") {
      resetField("deportes");
      resetField("posicion");
      resetField("buscandoEquipo");
    }

    return [
      ...commonSteps,
      ...(role === "player" ? playerSteps : organizerSteps),
    ];
  }, [role, resetField]);

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

  const onSubmit: SubmitHandler<OnboardingForm> = async (data) => {
    setSaving(true);

    const cleanData = { ...data };

    if (cleanData.role === "player") {
      delete cleanData.fotoOrganizacion;
      delete cleanData.nombreOrganizacion;
      delete cleanData.descripcionOrganizacion;
    }

    if (cleanData.role === "organizer") {
      delete cleanData.deportes;
      delete cleanData.posicion;
      delete cleanData.buscandoEquipo;
    }

    setTimeout(() => {
      console.log(cleanData);
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Datos guardados correctamente",
      });
      setSaving(false);
      setFinish(true);

      setTimeout(() => {
        if (cleanData.role === "organizer") {
          router.push("/organizer-plans");
        } else {
          router.push("/player/home");
        }
      }, 1000);
    }, 2000);
  };

  return (
    <FormProvider {...methods}>
      <motion.div
        className="w-full h-full flex flex-col"
        animate={{
          opacity: finish ? 0 : 1,
          transition: {
            duration: 0.7,
            ease: "easeInOut",
          },
        }}
      >
        <div className="w-24 m-auto mb-4">
          <FourSportsIcon />
        </div>

        <h1 className="font-medium text-lg mb-3 text-center shrink-0">
          Sigue los pasos para completar tu registro
        </h1>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-2 shrink-0">
          {currentStep.title}
        </h2>

        {/* ANIMATED CONTENT */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <div className="w-full h-full md:h-64 overflow-y-auto overflow-x-hidden p-1 md:flex md: items-center">
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
            label=""
            spinFromText={false}
            icon={<ChevronLeft className="size-4" />}
            twClassName="w-fit h-fit p-2 rounded-full"
            type={step === 0 ? "disabled" : "filled"}
          />

          {/* DOTS */}
          <div className="flex items-center justify-center gap-3">
            {steps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setStep(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === step ? "bg-primary scale-150" : "bg-faint"
                }`}
              />
            ))}
          </div>

          {!isLastStep ? (
            <DinamicButton
              action={nextStep}
              disabled={false}
              disabledSpinner={false}
              label=""
              spinFromText={false}
              icon={<ChevronRight className="size-4" />}
              twClassName="w-fit h-fit p-2 rounded-full"
              type="filled"
            />
          ) : (
            <DinamicButton
              action={handleSubmit(onSubmit)}
              disabled={saving}
              disabledSpinner={true}
              label=""
              spinFromText={false}
              icon={<Check className="size-4" />}
              twClassName="w-fit h-fit p-2 rounded-full"
              type={saving ? "disabled" : "filled"}
            />
          )}
        </div>
      </motion.div>
    </FormProvider>
  );
}
