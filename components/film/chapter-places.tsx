import { ArrowUpRight } from 'lucide-react'
import { mapsHref } from '@/lib/invitation/config'
import type { Venue } from '@/lib/invitation/types'
import { cn } from '@/lib/utils'
import { ChapterHeading } from './chapter-heading'
import { Fade, LetterboxImage, TitleLine } from './motion'

export function ChapterPlaces({ id, venues }: { id: string; venues: Venue[] }) {
  return (
    <section id={id} aria-labelledby={`${id}-titlu`} className="scroll-mt-14 bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-screen-2xl px-5 md:px-10">
        <ChapterHeading id={`${id}-titlu`} numeral="III" title="Locul în care ne vedem" kicker="Locațiile" />
      </div>

      <div className="mt-16 flex flex-col gap-24 md:mt-28 md:gap-40">
        {venues.map((venue, i) => (
          <VenueScene key={venue.id} venue={venue} index={i} />
        ))}
      </div>
    </section>
  )
}

function VenueScene({ venue, index }: { venue: Venue; index: number }) {
  const flipped = index % 2 === 1
  return (
    <article aria-labelledby={`${venue.id}-nume`} className="mx-auto grid w-full max-w-screen-2xl gap-10 md:grid-cols-12 md:items-end md:gap-10 md:px-10">
      <LetterboxImage
        photo={venue.photo}
        sizes="(min-width: 768px) 58vw, 100vw"
        className={cn('aspect-4/3 w-full md:col-span-7 md:aspect-[16/10]', flipped && 'md:order-2 md:col-start-6')}
      />

      <div className={cn('flex flex-col gap-6 px-5 md:col-span-5 md:px-0 md:pb-4', flipped ? 'md:order-1 md:col-start-1 md:row-start-1' : 'md:col-start-8 md:pl-6')}>
        <Fade as="p" className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {venue.slugLine}
        </Fade>
        <div className="flex flex-col gap-3">
          <Fade className="flex items-baseline gap-4">
            <span className="tabular font-sans text-4xl font-light text-paper md:text-5xl">{venue.time}</span>
            <span className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">{venue.label}</span>
          </Fade>
          <h3 id={`${venue.id}-nume`} className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] text-balance">
            <TitleLine>{venue.name}</TitleLine>
          </h3>
          {venue.address ? (
            <Fade as="p" className="text-sm leading-relaxed text-muted-foreground">
              <span className="sr-only">Adresa: </span>
              {venue.address}
            </Fade>
          ) : null}
        </div>
        <Fade as="p" className="max-w-md text-base leading-relaxed text-pretty text-paper/80">
          {venue.description}
        </Fade>
        <Fade>
          <a
            href={mapsHref(venue)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 items-center gap-3 border border-paper/40 px-5 text-[0.72rem] font-medium uppercase tracking-[0.26em] text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Indicații de orientare
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="sr-only">{` către ${venue.name} (se deschide într-o filă nouă)`}</span>
          </a>
        </Fade>
      </div>
    </article>
  )
}
