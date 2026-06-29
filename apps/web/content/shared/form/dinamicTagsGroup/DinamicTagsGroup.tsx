'use client'

import { Plus, X } from 'lucide-react'
import { KeyboardEvent, useState } from 'react'
import { Controller, FieldValues, useFormContext } from 'react-hook-form'
/* TYPES */
import { DinamicTagsGroupProps } from './types/dinamicTagsGroupProps'

export function DinamicTagsGroup<T extends FieldValues>({
  name,
  label,
  placeholder = 'Agregar etiqueta',
  rules,
}: DinamicTagsGroupProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  const [inputValue, setInputValue] = useState('')

  const error = errors[name]

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        const tags = (field.value ?? []) as string[]

        const addTag = () => {
          const value = inputValue.trim()

          if (!value) return

          const alreadyExists = tags.some((tag) => tag.toLowerCase() === value.toLowerCase())

          if (alreadyExists) {
            setInputValue('')
            return
          }

          field.onChange([...tags, value])
          setInputValue('')
        }

        const removeTag = (tagToRemove: string) => {
          field.onChange(tags.filter((tag) => tag !== tagToRemove))
        }

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
          }
        }

        return (
          <div className="flex flex-col gap-4 mb-4">
            {label && <label>{label}</label>}

            <div className="flex gap-4 h-fit">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full text-sm h-fit px-4 py-2 bg-background outline-none border border-line rounded-xl hover:bg-surface transition-all duration-300 placeholder:text-faint focus:ring-2 focus:ring-lucide"
              />

              <button
                type="button"
                onClick={addTag}
                className="w-12 rounded-xl bg-primary flex items-center justify-center"
              >
                <Plus className="size-4 min-w-4 min-h-4 text-primary-text" />
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-4 ml-4">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 rounded-full border border-line px-4 py-2"
                  >
                    <span className="text-sm">{tag}</span>

                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-sm cursor-pointer"
                    >
                      <X className="size-4 min-h-4 min-w-4 text-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && <span className="text-sm text-secondary">{error.message as string}</span>}
          </div>
        )
      }}
    />
  )
}
