'use client'

import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'

/** Music only starts after an explicit tap; it never autoplays. */
export function AudioControl({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  async function toggle() {
    const audio = ref.current
    if (!audio) return
    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setFailed(true)
      }
    } else {
      audio.pause()
    }
  }

  if (failed) return null

  return (
    <>
      <audio
        ref={ref}
        src={src}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className="ml-1 flex h-10 items-center gap-2 border border-paper/30 px-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-paper transition-colors hover:border-paper"
      >
        {playing ? <Pause aria-hidden="true" className="size-3.5" /> : <Play aria-hidden="true" className="size-3.5" />}
        <span className="hidden sm:inline">{playing ? 'Pauză' : 'Muzică'}</span>
        <span className="sr-only">{playing ? `Oprește melodia ${title}` : `Pornește melodia ${title}`}</span>
      </button>
    </>
  )
}
