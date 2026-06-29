/* TYPES */
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export type DinamicInputNumberProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  placeholder?: string
  rules?: RegisterOptions<T, Path<T>>
  min?: number
  max?: number
  disabled?: boolean
}
