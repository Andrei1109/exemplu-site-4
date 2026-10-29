import type { CSSProperties } from 'react'
import { preload } from 'react-dom'
import { ChapterDay } from '@/components/film/chapter-day'
import { ChapterNav, type ChapterLink } from '@/components/film/chapter-nav'
import { ChapterPlaces } from '@/components/film/chapter-places'
import { ChapterRSVP } from '@/components/film/chapter-rsvp'
import { ChapterStory } from '@/components/film/chapter-story'
import { EndCredits } from '@/components/film/end-credits'
import { Hero } from '@/components/film/hero'
import { formatDate, invitation } from '@/lib/invitation/config'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function readParam(value: string | string[] | undefined, maxLength: number) {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return null
  const clean = raw.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, maxLength)
  return clean.length > 0 ? clean : null
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const guestName = readParam(params.invitat, 60)
  const guestToken = readParam(params.cod, 80)
  const config = invitation

  if (config.hero.poster) {
    const { src, srcSmall } = config.hero.poster
    preload(src, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: srcSmall ? `${srcSmall} 900w, ${src} 1920w` : undefined,
      imageSizes: '100vw',
    })
  }

  const start = config.dates.ceremonyStart
  const dateLabel = formatDate(start, { day: 'numeric', month: 'long', year: 'numeric' }, config)
  const shortDate = formatDate(start, { day: 'numeric', month: 'long' }, config)
  const weekday = formatDate(start, { weekday: 'long' }, config)
  const deadlineLabel = formatDate(config.dates.rsvpDeadline, { day: 'numeric', month: 'long', year: 'numeric' }, config)
  const deadlinePassed = Date.now() > new Date(config.dates.rsvpDeadline).getTime()

  const chapters: ChapterLink[] = [
    ...(config.features.story ? [{ id: 'noi-doi', numeral: 'I', label: 'Noi doi' }] : []),
    { id: 'ziua-noastra', numeral: 'II', label: 'Ziua' },
    { id: 'locatii', numeral: 'III', label: 'Locul' },
    { id: 'confirmare', numeral: 'IV', label: 'Răspunde' },
  ]

  const { colors } = config.theme
  const themeVars = {
    '--film-ink': colors.ink,
    '--film-paper': colors.paper,
    '--film-grain': colors.grain,
    '--film-wine': colors.wine,
  } as CSSProperties

  return (
    <div className="film" style={themeVars}>
      <a
        href="#ziua-noastra"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-16 focus:z-70 focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Sari direct la invitație
      </a>
      <ChapterNav
        monogram={config.couple.monogram}
        chapters={chapters}
        audio={config.features.audio ? config.audio : null}
      />
      <main>
        <Hero
          presenter={config.presenter}
          partnerOne={config.couple.partnerOne}
          partnerTwo={config.couple.partnerTwo}
          filmTitle={config.filmTitle}
          dateLabel={dateLabel}
          weekdayLabel={weekday}
          poster={config.hero.poster}
          video={config.hero.video}
          nextId={chapters[0].id}
        />
        {config.features.story ? <ChapterStory id="noi-doi" story={config.story} /> : null}
        <ChapterDay id="ziua-noastra" config={config} guestName={guestName} />
        <ChapterPlaces id="locatii" venues={config.venues} />
        <ChapterRSVP
          id="confirmare"
          config={config}
          guestName={guestName}
          guestToken={guestToken}
          deadlineLabel={deadlineLabel}
          deadlinePassed={deadlinePassed}
          dateLabel={shortDate}
        />
      </main>
      <EndCredits
        closing={config.closing}
        presenter={config.presenter}
        monogram={config.couple.monogram}
        dateLabel={dateLabel}
        eventId={config.eventId}
      />
    </div>
  )
}
