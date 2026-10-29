'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { AudioControl } from './audio-control'

export type ChapterLink = { id: string; numeral: string; label: string }

type Props = {
  monogram: string
  chapters: ChapterLink[]
  audio: { src: string; title: string } | null
}

export function ChapterNav({ monogram, chapters, audio }: Props) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [chapters])

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink/90 backdrop-blur-sm">
      <nav aria-label="Capitole" className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-4 px-4 md:px-8">
        <a href="#inceput" className="font-serif text-lg italic tracking-wide text-paper">
          <span className="sr-only">Înapoi la început — </span>
          {monogram}
        </a>
        <div className="flex items-center gap-1 md:gap-2">
          <ol className="flex items-center">
            {chapters.map((c) => {
              const isActive = active === c.id
              return (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={cn(
                      'flex h-10 min-w-10 items-center justify-center gap-2 px-2 text-[0.7rem] font-medium uppercase tracking-[0.22em] transition-colors',
                      isActive ? 'text-paper' : 'text-paper/55 hover:text-paper',
                    )}
                  >
                    <span className="font-serif text-base normal-case tracking-normal">{c.numeral}</span>
                    <span className="sr-only lg:not-sr-only">{c.label}</span>
                    <span
                      aria-hidden="true"
                      className={cn('hidden h-px w-3 bg-paper transition-opacity lg:block', isActive ? 'opacity-100' : 'opacity-0')}
                    />
                  </a>
                </li>
              )
            })}
          </ol>
          {audio ? <AudioControl src={audio.src} title={audio.title} /> : null}
        </div>
      </nav>
    </header>
  )
}
