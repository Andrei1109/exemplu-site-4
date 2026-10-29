import { cn } from '@/lib/utils'
import { Fade, TitleLine } from './motion'

type Props = {
  id: string
  numeral: string
  title: string
  kicker?: string
  tone?: 'dark' | 'light' | 'wine'
  className?: string
}

const TONES = {
  dark: { muted: 'text-muted-foreground', rule: 'bg-paper/25' },
  light: { muted: 'text-ink/70', rule: 'bg-ink/25' },
  wine: { muted: 'text-paper/80', rule: 'bg-paper/40' },
}

/** Chapter title card: a quiet chapter credit followed by a large italic title. */
export function ChapterHeading({ id, numeral, title, kicker, tone = 'dark', className }: Props) {
  const { muted, rule } = TONES[tone]
  return (
    <header className={cn('flex flex-col gap-6', className)}>
      <Fade className={cn('flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.38em]', muted)}>
        <span>Capitolul {numeral}</span>
        <span aria-hidden="true" className={cn('h-px w-12', rule)} />
        {kicker ? <span className="truncate">{kicker}</span> : null}
      </Fade>
      <h2 id={id} className="font-serif text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.9] text-balance">
        <span className="sr-only">{`Capitolul ${numeral} — `}</span>
        <TitleLine className="italic">{title}</TitleLine>
      </h2>
    </header>
  )
}
