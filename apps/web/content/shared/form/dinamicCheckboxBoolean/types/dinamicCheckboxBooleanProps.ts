/* TYPES */
import { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export type DinamicCheckboxBooleanProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  description?: string
  rules?: RegisterOptions<T>
  wantCustomCheck?: boolean
  twClassName?: string
}
