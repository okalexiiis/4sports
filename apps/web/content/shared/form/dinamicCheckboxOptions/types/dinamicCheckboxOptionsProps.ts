/* TYPES */
import { FieldValues, Path, RegisterOptions } from 'react-hook-form'

export type CheckboxOption = {
  label: string
  value: string
}

export type DinamicCheckboxOptionsProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  options: CheckboxOption[]
  rules?: RegisterOptions<T>
  multiple?: boolean
}
