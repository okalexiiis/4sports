/* TYPES */
import { ButtonType } from './buttonType'

export type DinamicButtontype = {
  action: (() => void) | ((e: React.MouseEvent) => void)
  type: ButtonType
  twClassName?: string
  disabled?: boolean
  disabledSpinner?: boolean
  label?: string
  icon?: React.ReactNode
  spinFromText?: boolean
}
