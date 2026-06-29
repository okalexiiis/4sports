/* TYPES */
import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'

export type NumberRangeValue = {
  min: number
  max: number
}

export interface DinamicNumberRangeSelectProps<T extends FieldValues> {
  name: FieldPath<T>
  label?: string

  min: number
  max: number
  step?: number

  rules?: Omit<RegisterOptions<T, FieldPath<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
}
