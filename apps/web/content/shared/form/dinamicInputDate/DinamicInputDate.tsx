'use client'

/* LIBS */
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
/* ICONS */
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
/* COMPONENTS */
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
/* TYPES */
import { DinamicInputDateProps } from './types/dinamicInputDateProps'

export function DinamicInputDate<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  mode = 'single',
}: DinamicInputDateProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div className="flex flex-col gap-2 mb-4">
      {label && <p>{label}</p>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => {
          const renderValue = () => {
            if (!value) return null

            if (mode === 'single') {
              return format(value as Date, 'PPP', { locale: es })
            }

            const range = value as DateRange

            if (range?.from && range?.to) {
              return `${format(range.from, 'PPP', { locale: es })} - ${format(range.to, 'PPP', {
                locale: es,
              })}`
            }

            if (range?.from) {
              return format(range.from, 'PPP', { locale: es })
            }

            return null
          }

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full px-4 py-4 bg-transparent justify-between border border-linr text-left rounded-xl hover:bg-surface cursor-pointer font-normal">
                  {value ? (
                    <span className="text-body">{renderValue()}</span>
                  ) : (
                    <span className="text-faint">{placeholder}</span>
                  )}
                  <CalendarIcon className="size-4 min-w-4 min-h-4 text-faint" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0 bg-background border-2 border-line z-100"
                align="start"
              >
                {mode === 'single' ? (
                  <Calendar
                    mode="single"
                    selected={value as Date | undefined}
                    onSelect={onChange}
                    locale={es}

                    /* disabled={(date) => date < today} */
                  />
                ) : (
                  <Calendar
                    mode="range"
                    selected={value as DateRange | undefined}
                    onSelect={onChange}
                    locale={es}
                    numberOfMonths={2}
                  />
                )}
              </PopoverContent>
            </Popover>
          )
        }}
      />

      {error?.message && <p className="text-secondary text-sm">{String(error.message)}</p>}
    </div>
  )
}
