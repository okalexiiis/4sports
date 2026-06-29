"use client";

/* COMPONENTS */
import Link from "next/link";
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* ICONS */
import { FourSportsIcon } from "@/content/shared/icons/fourSports/FourSportsIcon";
import { GoogleIcon } from "@/content/shared/icons/google/GoogleIcon";
import { FacebookIcon } from "@/content/shared/icons/facebook/FacebookIcon";

/* HOOKS */
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
import { RegisterForm } from "@/content/auth/register/types/RegisterForm";

export function RegisterContent() {
  const router = useRouter();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);

  const methods = useForm<RegisterForm>({
    defaultValues: {
      email: "",
      password: "",
      password_confirm: "",
    },
    shouldUnregister: false,
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setSaving(true);

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Sesión creada correctamente, siga los pasos para continuar",
      });
      router.push("/onboarding");

      setSaving(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-24 m-auto mb-4">
        <FourSportsIcon />
      </div>

      <h1 className="font-medium text-lg mb-2 text-center">
        Crear una cuenta nueva
      </h1>

      <DinamicInputText<RegisterForm>
        name="email"
        label="Correo"
        type="text"
        placeholder="tucorreo@email.com"
        rules={{}}
      />

      <div className="grid grid-cols-2 gap-4 w-full h-fit">
        <DinamicInputText<RegisterForm>
          name="password"
          label="Contraseña"
          type="password"
          placeholder="********"
          rules={{}}
        />
        <DinamicInputText<RegisterForm>
          name="password_confirm"
          label="Confirmar"
          type="password"
          placeholder="********"
          rules={{}}
        />
      </div>

      <DinamicButton
        action={methods.handleSubmit(onSubmit)}
        twClassName="w-full h-fit py-2 px-4 rounded-xl mb-4"
        disabled={saving}
        disabledSpinner={false}
        type={saving ? "disabled" : "filled"}
        label="Registrarse"
        spinFromText
      />

      <div className="w-full h-fit flex gap-2 mb-4 justify-center items-center">
        <div className="w-24 h-px rounded-full bg-line" />
        <p className="text-sm text-muted">O también</p>
        <div className="w-24 h-px rounded-full bg-line" />
      </div>

      <div className="flex gap-4 mb-6">
        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          twClassName="w-full h-fit py-2 px-4 rounded-xl"
          disabled={saving}
          disabledSpinner={false}
          type={saving ? "disabled" : "unfilled"}
          label="Google"
          spinFromText
          icon={
            <div className="w-4 h-4">
              <GoogleIcon />
            </div>
          }
        />

        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          twClassName="w-full h-fit py-2 px-4 rounded-xl"
          disabled={saving}
          disabledSpinner={true}
          type={saving ? "disabled" : "unfilled"}
          label="Ingresar"
          spinFromText
          icon={
            <div className="w-4 h-4">
              <FacebookIcon />
            </div>
          }
        />
      </div>

      <div className="w-full h-fit mb-4 flex gap-2 justify-center">
        <p>¿Ya tienes una cuenta?</p>
        <Link href={"/login"} className="text-primary underline">
          Ir a Ingresar
        </Link>
      </div>
    </FormProvider>
  );
}
