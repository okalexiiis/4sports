'use client'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
/* COMPONENTS */
import { Checkbox } from '@/components/ui/checkbox'

/* TYPES */
import { DinamicCheckboxOptionsProps } from '@/content/shared/form/dinamicCheckboxOptions/types/dinamicCheckboxOptionsProps'

export function DinamicCheckboxOptions<T extends FieldValues>({
  name,
  label,
  options,
  rules,
  multiple = true,
}: DinamicCheckboxOptionsProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div className="flex flex-col gap-3 mb-4">
      {label && <p>{label}</p>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange } }) => {
          const selectedValues = multiple ? ((value ?? []) as string[]) : []

          const handleCheckedChange = (checked: boolean, optionValue: string) => {
            if (multiple) {
              if (checked) {
                onChange([...selectedValues, optionValue])
              } else {
                onChange(selectedValues.filter((item) => item !== optionValue))
              }
            } else {
              onChange(checked ? optionValue : '')
            }
          }

          return (
            <div className="flex flex-row gap-4">
              {options.map((option) => {
                const checked = multiple
                  ? selectedValues.includes(option.value)
                  : value === option.value

                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 text-sm rounded-full px-4 py-2 cursor-pointer border transition-all duration-300 w-full ${
                      checked
                        ? 'bg-primary-background border-primary'
                        : 'bg-background border-line hover:bg-surface'
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(checked) =>
                        handleCheckedChange(Boolean(checked), option.value)
                      }
                      hidden
                    />

                    <span>{option.label}</span>
                  </label>
                )
              })}
            </div>
          )
        }}
      />

      {error?.message && <p className="text-red-500 text-sm">{String(error.message)}</p>}
    </div>
  )
}
