'use client'

/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
/* COMPONENTS */
import { Slider } from '@/components/ui/slider'

/* TYPES */
import {
  DinamicNumberRangeSelectProps,
  NumberRangeValue,
} from './types/dinamicNumberRangeSelectProps'

export function DinamicNumberRangeSelect<T extends FieldValues>({
  name,
  label,
  min,
  max,
  step = 1,
  rules,
}: DinamicNumberRangeSelectProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div className="flex flex-col gap-3 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          const value: NumberRangeValue = field.value ?? {
            min,
            max,
          }

          const sliderValues = [value.min, value.max]

          return (
            <div className="relative py-8">
              <Slider
                min={min}
                max={max}
                step={step}
                value={sliderValues}
                onValueChange={(values) => {
                  field.onChange({
                    min: values[0],
                    max: values[1],
                  })
                }}
              />

              <ThumbLabels
                currentMin={value.min}
                currentMax={value.max}
                rangeMin={min}
                rangeMax={max}
              />
            </div>
          )
        }}
      />

      {error && <p className="text-sm text-secondary">{String(error.message)}</p>}
    </div>
  )
}

function ThumbLabels({
  currentMin,
  currentMax,
  rangeMin,
  rangeMax,
}: {
  currentMin: number
  currentMax: number
  rangeMin: number
  rangeMax: number
}) {
  const minPercent = ((currentMin - rangeMin) / (rangeMax - rangeMin)) * 100

  const maxPercent = ((currentMax - rangeMin) / (rangeMax - rangeMin)) * 100

  return (
    <>
      <span
        className="absolute top-10 -translate-x-1/4 translate-y-1 text-sm"
        style={{
          left: `${minPercent}%`,
        }}
      >
        {currentMin}
      </span>

      <span
        className="absolute top-10 -translate-x-1/4 translate-y-1 text-sm"
        style={{
          left: `${maxPercent}%`,
        }}
      >
        {currentMax}
      </span>
    </>
  )
}
