/* ICONS */
import { Loader } from 'lucide-react'

/* LIBS */
import { twMerge } from 'tailwind-merge'

/* TYPES */
import { ButtonType } from '@/content/shared/form/dinamicButton/types/buttonType'
import { DinamicButtontype } from './types/dinamicButtonType'

export function DinamicButton({
  action,
  type,
  twClassName,
  disabled,
  disabledSpinner,
  label,
  icon,
  spinFromText,
}: DinamicButtontype) {
  const getBackground = (type: ButtonType) => {
    switch (type) {
      case 'filled':
        return 'bg-primary text-primary-text border-transparent hover:bg-primary-hover'

      case 'ghost':
        return 'bg-background text-primary border-primary hover:bg-surface'

      case 'unfilled':
        return 'bg-surface text-ink border-transparent hover:bg-surface-hover'

      case 'destructive':
        return 'bg-secondary text-secondary-text border-transparent hover:bg-secondary-hover'

      case 'success':
        return 'bg-success text-white border-transparent hover:bg-success-hover'

      case 'disabled':
        return 'bg-disabled text-disabled-text border-disabled-border'
    }
  }

  return (
    <button
      className={twMerge(
        `w-full h-fit flex items-center justify-center border-2 transition-all duration-300 rounded-lg pt-2 pb-2 pr-4 pl-4 ${disabled ? 'cursor-default' : 'cursor-pointer'} ${label && 'gap-2'} ${getBackground(type)}`,
        twClassName,
      )}
      onClick={disabled ? undefined : action}
      disabled={disabled}
    >
      {disabled ? (
        disabledSpinner ? (
          <>
            {spinFromText && <span className="font-semibold text-transparent">E</span>}

            <Loader className="size-4 animate-spin" />

            {spinFromText && <span className="font-semibold text-transparent">E</span>}
          </>
        ) : (
          <>
            {icon && icon}
            <span className="font-semibold">{label}</span>
          </>
        )
      ) : (
        <>
          {icon && icon}
          <span className="font-semibold">{label}</span>
        </>
      )}
    </button>
  )
}
