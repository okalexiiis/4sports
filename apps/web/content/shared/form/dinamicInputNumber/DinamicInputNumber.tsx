'use client'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'

/* TYPES */
import { DinamicInputNumberProps } from './types/dinamicInputNumberProps'

export function DinamicInputNumber<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  min,
  max,
  disabled,
}: DinamicInputNumberProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div className="flex flex-col gap-2 lg:mb-4 mb-0">
      {label && <p>{label}</p>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            onBlur={onBlur}
            value={value ?? ''}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '')
              onChange(val)
            }}
            onKeyDown={(e) => {
              if (['e', '-', '+'].includes(e.key)) {
                e.preventDefault()
              }
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id={name}
            placeholder={placeholder}
            min={min}
            max={max}
            disabled={disabled}
            className={`w-full text-sm h-fit px-4 py-2 outline-none border border-line rounded-xl transition-all duration-300 placeholder:text-faint  ${disabled ? 'bg-disabled pointer-events-none text-disabled-text' : 'hover:bg-surface focus:ring-2 focus:ring-lucide bg-background'}`}
          />
        )}
      />

      {error?.message && <p className="text-danger text-sm">{String(error.message)}</p>}
    </div>
  )
}
