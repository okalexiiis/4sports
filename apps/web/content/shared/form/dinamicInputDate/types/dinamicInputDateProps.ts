/* TYPES */
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export type DinamicInputDateProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  placeholder?: string
  rules?: RegisterOptions<T, Path<T>>
  mode?: 'single' | 'range'
  showTime?: boolean
}
