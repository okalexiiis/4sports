/* TYPES */
import type { ComboboxItem } from '@/content/shared/form/dinamicComboBox/types/comboboxItem'

export type DinamicComboboxInternalProps = {
  items: ComboboxItem[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}
