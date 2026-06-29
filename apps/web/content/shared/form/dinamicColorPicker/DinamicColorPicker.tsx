'use client'

/* ICONS */
import { Palette } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
/* COMPONENTS */
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

/* TYPES */
import { DinamicInputColorProps } from './types/dinamicColorPickerProps'

/* UTILS */
import { getContrastColor } from './utils/getContrastColor'

export function DinamicColorPicker<T extends FieldValues>({
  name,
  label,
  placeholder = 'Seleccione un color',
  rules,
}: DinamicInputColorProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => {
        const value = field.value ?? ''

        const isColor = /^#([A-Fa-f0-9]{6})$/.test(value)

        const backgroundColor = isColor ? value : 'transparent'

        const textColor = isColor ? getContrastColor(value) : 'inherit'

        return (
          <div className="flex flex-col gap-2">
            {label && <label>{label}</label>}

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between w-full gap-4 px-4 py-2 text-sm border cursor-pointer h-fit rounded-xl border-line"
                  style={{
                    backgroundColor,
                    color: textColor,
                  }}
                >
                  {value === '' || value === undefined ? (
                    <p className="truncate">{placeholder}</p>
                  ) : (
                    <p className="truncate">{backgroundColor}</p>
                  )}

                  <Palette className="w-4 h-4 min-h-4 min-w-4" />
                </button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-auto p-3 z-100">
                <HexColorPicker
                  color={value || '#FFFFFF'}
                  onChange={(color) => field.onChange(color.toUpperCase())}
                />
              </PopoverContent>
            </Popover>

            {error && <p className="text-sm text-destructive">{String(error.message)}</p>}
          </div>
        )
      }}
    />
  )
}
