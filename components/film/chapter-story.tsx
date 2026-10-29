import type { InvitationConfig } from '@/lib/invitation/types'
import { ChapterHeading } from './chapter-heading'
import { Fade, LetterboxImage } from './motion'

export function ChapterStory({ id, story }: { id: string; story: InvitationConfig['story'] }) {
  return (
    <section id={id} aria-labelledby={`${id}-titlu`} className="scroll-mt-14 bg-ink pt-28 pb-24 md:pt-40 md:pb-36">
      <div className="mx-auto max-w-screen-2xl px-5 md:px-10">
        <ChapterHeading id={`${id}-titlu`} numeral="I" title="Noi doi" kicker="Unde începe totul" />
      </div>

      <figure className="relative mt-14 md:mt-20">
        <LetterboxImage
          photo={story.wide}
          sizes="100vw"
          className="aspect-4/5 w-full sm:aspect-video lg:aspect-[2.39/1]"
        />
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-6 md:bottom-12">
          <Fade className="max-w-2xl text-center font-sans text-base leading-relaxed text-paper [text-shadow:0_1px_12px_rgb(0_0_0/0.85)] md:text-xl">
            {story.subtitle}
          </Fade>
        </figcaption>
      </figure>

      <div className="mx-auto mt-20 grid max-w-screen-xl gap-16 px-5 md:mt-32 md:grid-cols-12 md:gap-10 md:px-10">
        <div className="flex flex-col gap-8 md:col-span-6 md:col-start-2 md:pt-16">
          {story.paragraphs.map((p, i) => (
            <Fade
              key={i}
              as="p"
              delay={i * 0.08}
              className={
                i === 0
                  ? 'font-serif text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.2] text-pretty text-paper'
                  : 'max-w-prose text-base leading-relaxed text-pretty text-muted-foreground md:text-lg'
              }
            >
              {p}
            </Fade>
          ))}
        </div>

        <figure className="flex flex-col gap-4 md:col-span-4 md:col-start-9">
          <LetterboxImage photo={story.detail} sizes="(min-width: 768px) 33vw, 80vw" className="aspect-3/4 w-4/5 self-end md:w-full" parallax={4} />
          <figcaption className="self-end text-right text-[0.7rem] uppercase leading-relaxed tracking-[0.28em] text-muted-foreground md:self-stretch md:text-left">
            {story.detailCaption}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
