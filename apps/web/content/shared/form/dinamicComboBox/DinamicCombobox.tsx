'use client'

/* LIBS */
import * as Popover from '@radix-ui/react-popover'
/* ICONS */
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
/* HOOKS */
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
import { ComboboxItem } from './types/comboboxItem'
import { DinamicComboboxInternalProps } from './types/dinamicComboboxInternalProps'
/* TYPES */
import { DinamicComboboxProps } from './types/dinamicComboboxProps'

export function DinamicCombobox<T extends FieldValues>({
  name,
  items,
  label,
  placeholder,
  rules,
  twMarginBottom,
}: DinamicComboboxProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]

  return (
    <div
      className={`flex flex-col gap-2 ${twMarginBottom !== undefined ? twMarginBottom : 'mb-2 md:mb-4'}`}
    >
      {label && <p>{label}</p>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <ComboboxInternal
            items={items}
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        )}
      />

      {error?.message && <p className="text-danger text-sm">{String(error.message)}</p>}
    </div>
  )
}

function ComboboxInternal({ items, value, onChange, placeholder }: DinamicComboboxInternalProps) {
  const [open, setOpen] = useState(false)

  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  const listRef = useRef<HTMLDivElement>(null)

  const selectedIndex = items.findIndex((item) => item.value === value)

  const selectedItem = items.find((item) => item.value === value)

  const selectItem = (item: ComboboxItem) => {
    onChange(item.value)

    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)

        e.preventDefault()
      }

      return
    }

    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev + 1) % items.length)

      e.preventDefault()
    }

    if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1))

      e.preventDefault()
    }

    if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        selectItem(items[highlightedIndex])
      }

      e.preventDefault()
    }

    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (open) {
      const setHighlighted = () => {
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
      }

      setHighlighted()
    }
  }, [open, selectedIndex])

  useEffect(() => {
    if (!listRef.current || highlightedIndex < 0) return

    const element = listRef.current.children[highlightedIndex] as HTMLElement

    element?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [highlightedIndex])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          onKeyDown={handleKeyDown}
          className="w-full py-2 pl-4 pr-1 border border-line rounded-xl cursor-pointer flex items-center justify-between outline-none focus:ring-2 focus:ring-lucide text-sm transition-all duration-300 bg-background hover:bg-surface"
        >
          <span className={`truncate ${selectedItem ? 'text-ink' : 'text-faint'}`}>
            {selectedItem?.label || placeholder || 'Seleccionar'}
          </span>

          <div className="px-1 rounded-md hover:bg-surface">
            <ChevronDown className="size-4 text-faint" />
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-99 w-(--radix-popover-trigger-width) rounded-xl border border-line bg-surface p-2 shadow-lg"
        >
          <div ref={listRef} className="max-h-60 overflow-y-auto scrollbar-none">
            {items.map((item, index) => {
              const isSelected = item.value === value

              const isHighlighted = index === highlightedIndex

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => selectItem(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-4 py-2 flex rounded-lg items-center justify-between text-left cursor-pointer text-sm transition-colors
                  ${isHighlighted ? 'bg-lucide' : ''}
                `}
                >
                  <span className="truncate">{item.label}</span>

                  {isSelected && <Check className="size-3 shrink-0" />}
                </button>
              )
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
