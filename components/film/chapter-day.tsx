import { formatDate } from '@/lib/invitation/config'
import type { InvitationConfig } from '@/lib/invitation/types'
import { ChapterHeading } from './chapter-heading'
import { Countdown } from './countdown'
import { Fade, TitleLine } from './motion'

type Props = { id: string; config: InvitationConfig; guestName: string | null }

export function ChapterDay({ id, config, guestName }: Props) {
  const start = config.dates.ceremonyStart
  const day = formatDate(start, { day: 'numeric' }, config)
  const month = formatDate(start, { month: 'long' }, config)
  const year = formatDate(start, { year: 'numeric' }, config)
  const weekday = formatDate(start, { weekday: 'long' }, config)
  const fullDate = formatDate(start, { day: 'numeric', month: 'long', year: 'numeric' }, config)
  const greeting = guestName ? `Dragă ${guestName},` : config.invitation.greetingFallback

  return (
    <section id={id} aria-labelledby={`${id}-titlu`} className="scroll-mt-14 bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-screen-2xl px-5 md:px-10">
        <ChapterHeading id={`${id}-titlu`} numeral="II" title="Ziua noastră" kicker="Invitația" tone="light" />

        <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-10">
          <div className="flex flex-col gap-6 md:col-span-5">
            <Fade as="p" className="font-serif text-2xl italic md:text-3xl">{greeting}</Fade>
            <Fade as="p" delay={0.1} className="max-w-md text-base leading-relaxed text-pretty text-ink/80 md:text-lg">
              {config.invitation.message}
            </Fade>
            <Fade as="p" delay={0.2} className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-wine">
              {config.invitation.signature}
            </Fade>
          </div>

          <div className="flex flex-col gap-12 md:col-span-6 md:col-start-7">
            <p className="font-serif leading-[0.82] text-ink">
              <span className="sr-only">{`${weekday}, ${fullDate}`}</span>
              <span aria-hidden="true" className="flex items-end gap-4 md:gap-6">
                <TitleLine className="text-[clamp(7rem,30vw,16rem)] tracking-[-0.03em]">{day}</TitleLine>
                <span className="flex flex-col gap-2 pb-[0.6em]">
                  <TitleLine delay={0.1} className="text-[clamp(2.25rem,8vw,4.5rem)] italic capitalize">{month}</TitleLine>
                  <TitleLine delay={0.2} className="font-sans text-xs font-medium uppercase tracking-[0.34em] text-ink/70 md:text-sm">
                    {`${weekday} · ${year}`}
                  </TitleLine>
                </span>
              </span>
            </p>
            {config.features.countdown ? (
              <Countdown start={start} end={config.dates.celebrationEnd} dateLabel={fullDate} />
            ) : null}
          </div>
        </div>

        {config.features.timeline ? (
          <div className="mt-24 md:mt-36">
            <Fade className="flex items-baseline justify-between gap-4 border-b border-ink/20 pb-4">
              <h3 className="font-serif text-3xl italic md:text-4xl">Decupajul serii</h3>
              <span className="text-[0.7rem] uppercase tracking-[0.3em] text-ink/70">{config.timeline.length} scene</span>
            </Fade>
            <ol className="flex flex-col">
              {config.timeline.map((scene, i) => (
                <Fade
                  as="li"
                  key={`${scene.time}-${scene.title}`}
                  delay={i * 0.05}
                  className="grid grid-cols-[4.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-ink/15 py-6 sm:grid-cols-[6rem_8rem_1fr_auto] md:py-8"
                >
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-ink/70">
                    Scena {String(i + 1).padStart(2, '0')}
                  </span>
                  <time className="tabular font-sans text-2xl font-light text-ink sm:order-none md:text-3xl">{scene.time}</time>
                  <span className="col-start-2 flex flex-col gap-1 sm:col-start-auto">
                    <span className="font-serif text-2xl leading-tight md:text-3xl">{scene.title}</span>
                    {scene.note ? <span className="text-sm leading-relaxed text-ink/70">{scene.note}</span> : null}
                  </span>
                  {scene.place ? (
                    <span className="col-start-2 text-[0.7rem] uppercase tracking-[0.24em] text-wine sm:col-start-auto sm:text-right">
                      {scene.place}
                    </span>
                  ) : null}
                </Fade>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  )
}
