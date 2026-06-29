'use client'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'

/* TYPES */
import { DinamicInputTextAreaProps } from '@/content/shared/form/dinamicTextArea/types/dinamicTextAreaProps'

export function DinamicTextArea<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  twHeight,
  twMarginBottom,
}: DinamicInputTextAreaProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div
      className={`flex flex-col gap-2 ${twMarginBottom !== undefined ? twMarginBottom : 'mb-4'}`}
    >
      {label && <p>{label}</p>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <textarea
            {...field}
            id={name}
            placeholder={placeholder}
            className={`w-full text-sm resize-none px-4 py-2 bg-background outline-none border border-line rounded-xl hover:bg-surface transition-all duration-300 placeholder:text-faint focus:ring-2 focus:ring-lucide ${twHeight !== undefined ? twHeight : 'h-40'}`}
          />
        )}
      />

      {error?.message && <p className="text-danger text-sm">{String(error.message)}</p>}
    </div>
  )
}
