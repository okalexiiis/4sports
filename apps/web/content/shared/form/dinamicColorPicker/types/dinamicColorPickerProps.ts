/* TYPES */
import { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export type DinamicInputColorProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  placeholder?: string
  rules?: RegisterOptions<T, Path<T>>
}
