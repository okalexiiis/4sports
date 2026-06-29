/* TYPES */
import { TitleProps } from '@/content/shared/ui/titleWithDescription/types/titleProps'

export function TitleWithDescription({
  title,
  subtitle,
  description,
  position = 'center',
}: TitleProps) {
  return (
    <div
      className={`space-y-3 ${position === 'left' ? 'text-left' : position === 'right' ? 'text-right' : 'text-center mx-auto max-w-3xl'}`}
    >
      {subtitle && (
        <h3 className="text-sm font-black uppercase tracking-widest text-primary">{subtitle}</h3>
      )}
      <h2 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">{title}</h2>
      {description && (
        <p className="text-base font-medium leading-relaxed text-muted">{description}</p>
      )}
    </div>
  )
}
