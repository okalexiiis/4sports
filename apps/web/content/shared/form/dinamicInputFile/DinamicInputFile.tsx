'use client'

/* ICONS */
import { Image as Imagen, Plus, Upload } from 'lucide-react'
/* COMPONENTS */
import Image from 'next/image'
/* HOOKS */
import { ChangeEvent, useEffect, useMemo } from 'react'
import { Controller, FieldValues, useFormContext, useWatch } from 'react-hook-form'

/* TYPES */
import { DinamicInputFileProps } from '@/content/shared/form/dinamicInputFile/types/dinamicInputFileProps'

export function DinamicInputFile<T extends FieldValues>({
  label,
  variant = 'default',
  accept = 'image/*',
  name,
  rules,
  placeholder,
}: DinamicInputFileProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  const file = useWatch({
    control,
    name,
  }) as File | undefined

  const preview = useMemo(() => {
    if (!file) return null

    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  if (variant === 'avatar') {
    return (
      <div className="flex flex-col items-center gap-2 p-1">
        {label && <label className="text-sm text-faint">{label}</label>}

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
                placeholder={placeholder}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  onChange(file)
                }}
              />

              <div className="w-48 h-48 rounded-full overflow-hidden border border-line bg-background hover:bg-surface flex items-center justify-center relative transition-all duration-300 group-hover:scale-[1.03]">
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                ) : (
                  <Imagen className="text-lucide size-24" />
                )}
              </div>

              <div className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-primary text-primary-text flex items-center justify-center border-4 border-background">
                <Plus className="size-5" />
              </div>
            </label>
          )}
        />

        {error?.message && <p className="text-danger text-sm">{String(error.message)}</p>}
      </div>
    )
  }

  if (variant === 'select-photo') {
    return (
      <div className="flex flex-col items-center gap-2 p-1">
        {label && <label className="text-sm text-faint">{label}</label>}

        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, ref } }) => (
            <label className="group cursor-pointer">
              <input
                ref={ref}
                id={name}
                type="file"
                accept={accept}
                className="hidden"
                placeholder={placeholder}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  onChange(file)
                }}
              />

              <div className="w-48 h-48 rounded-xl overflow-hidden border border-line bg-background hover:bg-surface flex items-center justify-center relative transition-all duration-300 group-hover:scale-[1.03]">
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex gap-2 items-center text-muted">
                    <Upload className="size-3 min-h-3 min-w-3" />
                    <p className="text-sm">Subir foto</p>
                  </div>
                )}
              </div>
            </label>
          )}
        />

        {error?.message && <p className="text-danger text-sm">{String(error.message)}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      {label && <label>{label}</label>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref } }) => (
          <input
            ref={ref}
            id={name}
            type="file"
            accept={accept}
            placeholder={placeholder}
            className="w-full text-sm h-fit px-4 py-2 bg-background outline-none border border-line rounded-xl hover:bg-surface transition-all duration-300 placeholder:text-faint focus:ring-2 focus:ring-lucide cursor-pointer"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0]
              onChange(file)
            }}
          />
        )}
      />

      {error?.message && <p className="text-danger text-sm">{String(error.message)}</p>}
    </div>
  )
}
