'use client'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'

/* TYPES */
import { DinamicInputTextProps } from './types/dinamicInputTextProps'

export function DinamicInputText<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  type = 'text',
  twMarginBottom,
}: DinamicInputTextProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div className={`flex flex-col gap-2 ${twMarginBottom ? twMarginBottom : 'mb-4'}`}>
      {label && <p>{label}</p>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            className="w-full px-4 py-2 text-sm transition-all duration-300 border outline-none h-fit bg-background border-line rounded-xl hover:bg-surface placeholder:text-faint focus:ring-2 focus:ring-lucide"
          />
        )}
      />

      {error?.message && <p className="text-sm text-danger">{String(error.message)}</p>}
    </div>
  )
}
