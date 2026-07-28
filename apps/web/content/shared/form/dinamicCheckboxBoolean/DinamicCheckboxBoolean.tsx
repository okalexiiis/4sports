'use client'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
/* COMPONENTS */
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

/* TYPES */
import { DinamicCheckboxBooleanProps } from './types/dinamicCheckboxBooleanProps'

export function DinamicCheckboxBoolean<T extends FieldValues>({
  name,
  label,
  description,
  rules,
  wantCustomCheck,
  twClassName,
}: DinamicCheckboxBooleanProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div
      className={`flex flex-col gap-2 lg:mb-4 mb-0 justify-center w-fit ${twClassName !== undefined && twClassName}`}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange } }) => (
          <label
            className={`flex items-center cursor-pointer ${label !== undefined && 'gap-3'}`}
          >
            {wantCustomCheck ? (
              <Switch checked={value} onCheckedChange={(checked) => onChange(Boolean(checked))} />
            ) : (
              <Checkbox checked={value} onCheckedChange={(checked) => onChange(Boolean(checked))} />
            )}

            <div className="flex flex-col items-center justify-center select-none">
              {label && <span className="text-sm">{label}</span>}

              {description && <span className="text-sm text-muted">{description}</span>}
            </div>
          </label>
        )}
      />

      {error?.message && <p className="text-sm text-danger">{String(error.message)}</p>}
    </div>
  )
}
