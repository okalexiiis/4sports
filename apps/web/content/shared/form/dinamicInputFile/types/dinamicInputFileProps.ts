/* TYPES */
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export type DinamicInputFileProps<T extends FieldValues> = {
  label?: string
  variant?: 'avatar' | 'select-photo' | 'default'
  accept?: string
  rules?: RegisterOptions<T, Path<T>>
  name: Path<T>
  placeholder?: string
}
