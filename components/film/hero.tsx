'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { HeroVideo, Photo } from '@/lib/invitation/types'
import { FilmImage } from './film-image'
import { EASE } from './motion'

type Props = {
  presenter: string
  partnerOne: string
  partnerTwo: string
  filmTitle: string
  dateLabel: string
  weekdayLabel: string
  poster: Photo | null
  video: HeroVideo | null
  nextId: string
}

const FINAL_PHASE = 5
const CUES = [150, 900, 1600, 2500, 3200]

export function Hero(props: Props) {
  const { presenter, partnerOne, partnerTwo, filmTitle, dateLabel, weekdayLabel, poster, video, nextId } = props
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const [allowVideo, setAllowVideo] = useState(false)

  useEffect(() => {
    if (reduce) {
      setPhase(FINAL_PHASE)
      return
    }
    const timers = CUES.map((t, i) => setTimeout(() => setPhase((p) => Math.max(p, i + 1)), t))
    return () => timers.forEach(clearTimeout)
  }, [reduce])

  useEffect(() => {
    if (!video || reduce) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!conn?.saveData) setAllowVideo(true)
  }, [video, reduce])

  function skip() {
    setSkipped(true)
    setPhase(FINAL_PHASE)
  }

  const instant = reduce || skipped
  const t = (duration: number) => (instant ? { duration: 0.25 } : { duration, ease: EASE })
  const show = (n: number) => phase >= n

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  const videoSrc = video && isMobile && video.srcMobile ? video.srcMobile : video?.src

  return (
    <section id="inceput" aria-labelledby="titlu-film" className="relative h-svh min-h-[560px] overflow-hidden bg-ink">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: show(1) ? 1 : 0, scale: show(1) ? 1 : 1.08 }}
        transition={instant ? { duration: 0.25 } : { opacity: { duration: 1.6 }, scale: { duration: 9, ease: 'easeOut' } }}
      >
        <FilmImage photo={poster} priority sizes="100vw" />
        {allowVideo && videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            poster={poster?.src}
            aria-hidden="true"
            style={{ objectPosition: poster?.focus }}
          >
            <source src={videoSrc} type={video?.type ?? 'video/mp4'} />
          </video>
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/80 to-transparent" />
      </motion.div>

      {/* Letterbox bars: start closed (black frame), open to a cinematic aspect. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-1/2 origin-top bg-ink"
        initial={false}
        animate={{ scaleY: show(1) ? 0.2 : 1 }}
        transition={t(1.8)}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-1/2 origin-bottom bg-ink"
        initial={false}
        animate={{ scaleY: show(1) ? 0.2 : 1 }}
        transition={t(1.8)}
      />

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-5 pt-14 text-center">
        <motion.p
          className="text-[0.68rem] font-medium uppercase tracking-[0.42em] text-paper/80 md:text-xs"
          initial={false}
          animate={{ opacity: show(2) ? 1 : 0 }}
          transition={t(1.2)}
        >
          {presenter} prezintă
        </motion.p>

        <h1 id="titlu-film" className="mt-8 font-serif text-paper md:mt-10">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block text-[clamp(3.6rem,18vw,11.5rem)] leading-[0.86] tracking-[-0.01em]"
              initial={false}
              animate={{ y: show(3) ? '0%' : '105%' }}
              transition={t(1.3)}
            >
              {partnerOne}
            </motion.span>
          </span>
          <span className="flex items-center justify-center gap-4 overflow-hidden md:gap-6">
            <motion.span
              aria-hidden="true"
              className="h-px w-10 origin-right bg-paper/60 md:w-24"
              initial={false}
              animate={{ scaleX: show(3) ? 1 : 0 }}
              transition={t(1.4)}
            />
            <motion.span
              className="block text-[clamp(2rem,6vw,4.5rem)] italic leading-none"
              initial={false}
              animate={{ opacity: show(3) ? 1 : 0 }}
              transition={t(1.6)}
            >
              <span className="sr-only"> și </span>
              <span aria-hidden="true">&amp;</span>
            </motion.span>
            <motion.span
              aria-hidden="true"
              className="h-px w-10 origin-left bg-paper/60 md:w-24"
              initial={false}
              animate={{ scaleX: show(3) ? 1 : 0 }}
              transition={t(1.4)}
            />
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span
              className="block text-[clamp(3.6rem,18vw,11.5rem)] italic leading-[0.86] tracking-[-0.01em]"
              initial={false}
              animate={{ y: show(3) ? '0%' : '-105%' }}
              transition={t(1.3)}
            >
              {partnerTwo}
            </motion.span>
          </span>
        </h1>

        <motion.div
          className="mt-8 flex flex-col items-center gap-3 md:mt-10"
          initial={false}
          animate={{ opacity: show(4) ? 1 : 0, y: show(4) ? 0 : 8 }}
          transition={t(1.2)}
        >
          <p className="font-serif text-xl italic text-paper/90 md:text-2xl">{filmTitle}</p>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.38em] text-paper/80 md:text-xs">
            <span className="sr-only">{weekdayLabel}, </span>
            {dateLabel}
          </p>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 flex h-[10%] items-center justify-center px-5 md:justify-between md:px-10"
        initial={false}
        animate={{ opacity: show(5) ? 1 : 0 }}
        transition={t(1)}
      >
        <p aria-hidden="true" className="hidden text-[0.68rem] uppercase tracking-[0.3em] text-paper/70 md:block">
          {weekdayLabel}
        </p>
        <a
          href={`#${nextId}`}
className="group flex min-h-11 flex-col items-center justify-center gap-2 px-4 text-[0.72rem] font-medium uppercase tracking-[0.34em] text-paper"
                >
                  Descoperă povestea
                  <span aria-hidden="true" className="relative block h-4 w-px overflow-hidden bg-paper/25">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-paper transition-transform duration-700 group-hover:translate-y-full" />
          </span>
        </a>
        <p aria-hidden="true" className="hidden text-[0.68rem] uppercase tracking-[0.3em] text-paper/70 md:block">
          Durata: o viață
        </p>
      </motion.div>

      {phase < FINAL_PHASE ? (
        <button
          type="button"
          onClick={skip}
          className="absolute bottom-3 right-4 z-30 px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-paper/70 hover:text-paper md:right-8"
        >
          Sari peste intro
        </button>
      ) : null}
    </section>
  )
}
