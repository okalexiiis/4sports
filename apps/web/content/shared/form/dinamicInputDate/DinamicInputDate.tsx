'use client'

/* COMPONENTS */
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'

/* ICONS */
import { Calendar as CalendarIcon } from 'lucide-react'

/* LIBS */
import { format, set } from 'date-fns'
import { es } from 'date-fns/locale'

/* TYPES */
import { DinamicInputDateProps } from './types/dinamicInputDateProps'
import { DateRange } from 'react-day-picker'

export function DinamicInputDate<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  mode = 'single',
  showTime = false, // 👈 nuevo prop
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

          // Toma el HH:mm del value actual (o vacío si no hay fecha)
          const timeValue = value && mode === 'single' ? format(value as Date, 'HH:mm') : ''

          // Combina el tiempo elegido con la fecha ya seleccionada (o "hoy" si aún no hay ninguna)
          const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value // "HH:mm"
            if (!raw) return
            const [hours, minutes] = raw.split(':').map(Number)
            const baseDate = value ? new Date(value as Date) : new Date()
            const newDate = set(baseDate, { hours, minutes, seconds: 0, milliseconds: 0 })
            onChange(newDate)
          }

          return (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="justify-between flex-1 px-4 py-4 font-normal text-left bg-transparent border cursor-pointer border-line rounded-xl hover:bg-surface">
                    {value ? (
                      <span className="text-body">{renderValue()}</span>
                    ) : (
                      <span className="text-faint">{placeholder}</span>
                    )}
                    <CalendarIcon className="size-4 min-w-4 min-h-4 text-faint" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-2 bg-background border-line z-100"
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

              {showTime && mode === 'single' && (
                <input
                  type="time"
                  value={timeValue}
                  onChange={handleTimeChange}
                  className="px-4 py-2 text-sm bg-transparent border appearance-none cursor-pointer border-line rounded-xl hover:bg-surface [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none outline-none"
                />
              )}
            </div>
          )
        }}
      />
      {error?.message && <p className="text-sm text-secondary">{String(error.message)}</p>}
    </div>
  )
}
