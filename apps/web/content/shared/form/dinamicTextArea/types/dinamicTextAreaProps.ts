/* TYPES */
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export type DinamicInputTextAreaProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  placeholder?: string
  rules?: RegisterOptions<T, Path<T>>
  twHeight?: string
  twMarginBottom?: string
}
