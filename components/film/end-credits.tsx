import type { InvitationConfig } from '@/lib/invitation/types'
import { FilmImage } from './film-image'
import { Fade, TitleLine } from './motion'

type Props = {
  closing: InvitationConfig['closing']
  presenter: string
  monogram: string
  dateLabel: string
  eventId: string
}

export function EndCredits({ closing, presenter, monogram, dateLabel, eventId }: Props) {
  return (
    <footer className="relative overflow-hidden bg-ink">
      <section aria-labelledby="generic-titlu" className="relative flex min-h-svh flex-col items-center justify-center px-5 py-28 text-center">
        <div aria-hidden="true" className="absolute inset-0">
          <FilmImage photo={closing.photo} sizes="100vw" />
          <div className="absolute inset-0 bg-ink/70" />
        </div>

        <div className="relative flex max-w-xl flex-col items-center gap-14">
          <Fade as="p" className="font-serif text-2xl italic leading-snug text-pretty text-paper md:text-3xl">
            {closing.message}
          </Fade>

          <h2 id="generic-titlu" className="sr-only">Genericul de final</h2>
          <dl className="flex flex-col gap-8">
            {closing.credits.map((c, i) => (
              <Fade key={c.role} delay={i * 0.08} className="flex flex-col gap-2">
                <dt className="text-[0.68rem] font-medium uppercase tracking-[0.38em] text-paper/70">{c.role}</dt>
                <dd className="font-serif text-2xl text-paper md:text-3xl">{c.name}</dd>
              </Fade>
            ))}
          </dl>

          <p className="font-serif text-[clamp(4rem,14vw,9rem)] italic leading-none text-paper">
            <TitleLine>Sfârșit</TitleLine>
            <span className="sr-only">.</span>
          </p>
          <Fade as="p" className="-mt-8 text-[0.7rem] uppercase tracking-[0.38em] text-paper/70">
            sau, mai degrabă, începutul
          </Fade>
        </div>
      </section>

      <div className="relative flex flex-col items-center justify-between gap-3 border-t border-paper/15 px-5 py-6 text-center text-xs text-paper/65 md:flex-row md:px-10 md:text-left">
        <p>
          <span className="font-serif text-sm italic text-paper/85">{monogram}</span>
          <span aria-hidden="true"> · </span>
          {dateLabel}
        </p>
        <p>
          Invitație digitală realizată de <span className="text-paper/90">{presenter}</span>
          <span className="sr-only">{`. Cod eveniment: ${eventId}`}</span>
        </p>
      </div>
    </footer>
  )
}
