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
import { LoginForm } from "@/content/auth/login/types/LoginForm";

export function LoginContent() {
  const router = useRouter();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);

  const methods = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setSaving(true);

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Sesión iniciada correctamente",
      });
      router.push("/organizer/home");
      /* router.push("/player/home"); */

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Sesión iniciada correctamente",
      });

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
        Ingresa a tu cuenta
      </h1>

      <DinamicInputText<LoginForm>
        name="email"
        label="Correo"
        type="text"
        placeholder="tucorreo@email.com"
        rules={{}}
      />

      <DinamicInputText<LoginForm>
        name="password"
        label="Contraseña"
        type="password"
        placeholder="********"
        rules={{}}
      />

      <div className="w-full h-fit mb-4">
        <Link href={"/login/#"} className="text-primary underline text-sm">
          Olvidé mi contraseña
        </Link>
      </div>

      <DinamicButton
        action={methods.handleSubmit(onSubmit)}
        twClassName="mb-4"
        disabled={saving}
        disabledSpinner={true}
        type={saving ? "disabled" : "filled"}
        label="Ingresar"
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
          disabled={saving}
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
          disabled={saving}
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
        <p>¿No tienes una cuenta?</p>
        <Link href={"/register"} className="text-primary underline">
          Ir a Registrarse
        </Link>
      </div>
    </FormProvider>
  );
}
