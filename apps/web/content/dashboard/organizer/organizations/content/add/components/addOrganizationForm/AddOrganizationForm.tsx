"use client";

/* COMPONENTS */
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicInputFile } from "@/content/shared/form/dinamicInputFile/DinamicInputFile";
import { DinamicTextArea } from "@/content/shared/form/dinamicTextArea/DinamicTextArea";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* ICONS */
import { ArrowLeft, Save } from "lucide-react";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* TYPES */
import { AddOrganizationFormType } from "../../types/addOrganizationFormType";

export function AddOrganizationForm({
  action,
  saving,
}: {
  action: (() => void) | ((e: React.MouseEvent) => void);
  saving: boolean;
}) {
  const router = useRouter();

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <DinamicButton
        action={() => router.push("/organizer/organizations")}
        type="unfilled"
        label="Regresar"
        twClassName="w-fit py-1 text-sm self-start absolute top-0 left-0"
        icon={<ArrowLeft className="size-4 min-h-4 min-w-4 text-primary" />}
      />

      <div className="w-1/2 h-fit flex flex-col gap-6">
        <p className="font-bebas text-5xl text-ink text-center">
          Nueva <span className="text-primary">Organización</span>
        </p>

        <div className="flex md:flex-row flex-col md:gap-6 gap-2 items-center">
          {/* FOTO */}
          <DinamicInputFile<AddOrganizationFormType>
            name="orgPicture"
            variant="avatar"
            rules={{
              validate: (file) => {
                if (!(file instanceof File)) return true;

                if (file.size > 5_000_000) {
                  return "El archivo debe pesar menos de 5MB";
                }

                return true;
              },
            }}
          />

          <div className="flex flex-col w-full h-fit">
            {/* NOMBRE */}
            <DinamicInputText<AddOrganizationFormType>
              name="orgName"
              label="Nombre de organización"
              type="text"
              placeholder="Ingresa el nombre de la organización"
              rules={{}}
            />

            {/* DESCRIPCIÓN */}
            <DinamicTextArea<AddOrganizationFormType>
              name="orgDescription"
              placeholder="Ingrese la descripción de la organización"
              label="Descripción"
              twHeight="h-20"
              rules={{}}
            />
          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <DinamicButton
          action={action}
          type={saving ? "disabled" : "filled"}
          label="Guardar"
          icon={<Save className="size-4 min-h-4 min-w-4" />}
          disabled={saving}
          disabledSpinner={true}
          spinFromText={true}
        />
      </div>
    </div>
  );
}
