"use client";

/* COMPONENTS */
import Image from "next/image";

/* HOOKS */
import { ChangeEvent } from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

/* ICONS */
import { Image as Imagen, Plus } from "lucide-react";

/* LIBS */
import { twMerge } from "tailwind-merge";

/* TYPES */
import { SpecificInputFileProps } from "./types/specificInputFileImageProps";

export function SpecificInputFileImage<T extends FieldValues>({
  accept = "image/*",
  name,
  rules,
  preview,
  twClassNameContainer,
  twClassNameButton,
}: SpecificInputFileProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <div className="flex flex-col items-center gap-2">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref } }) => (
          <label className="relative group cursor-pointer">
            <input
              ref={ref}
              id={name}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                onChange(file);
              }}
            />

            <div
              className={twMerge(
                "w-48 h-48 rounded-full overflow-hidden border border-line bg-background hover:bg-surface flex items-center justify-center relative transition-all duration-300 group-hover:scale-[1.03]",
                twClassNameContainer,
              )}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <Imagen className="text-lucide size-24" />
              )}
            </div>

            <div
              className={twMerge(
                "absolute bottom-1 right-1 w-12 h-12 rounded-full bg-primary text-primary-text flex items-center justify-center border-4 border-background",
                twClassNameButton,
              )}
            >
              <Plus className="size-5" />
            </div>
          </label>
        )}
      />

      {error?.message && (
        <p className="text-danger text-sm">{String(error.message)}</p>
      )}
    </div>
  );
}
