'use client'

import { useEffect, useState } from 'react'

type Props = { start: string; end: string; dateLabel: string }

const pad = (n: number) => String(n).padStart(2, '0')

/** Countdown styled as a film timecode. Switches to live / past states around the event. */
export function Countdown({ start, end, dateLabel }: Props) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()

  if (now !== null && now >= endMs) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.34em] text-ink/70">Premiera a avut loc</p>
        <p className="font-serif text-3xl italic leading-tight text-ink md:text-4xl">
          Pe {dateLabel}. Vă mulțumim că ați fost alături de noi.
        </p>
      </div>
    )
  }

  if (now !== null && now >= startMs) {
    return (
      <div className="flex flex-col gap-2" role="status">
        <p className="flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.34em] text-wine">
          <span aria-hidden="true" className="size-2 rounded-full bg-wine" />
          În desfășurare
        </p>
        <p className="font-serif text-3xl italic leading-tight text-ink md:text-4xl">Filmul rulează chiar acum.</p>
      </div>
    )
  }

  const diff = now === null ? null : Math.max(0, startMs - now)
  const parts =
    diff === null
      ? null
      : {
          days: Math.floor(diff / 86_400_000),
          hours: Math.floor((diff / 3_600_000) % 24),
          minutes: Math.floor((diff / 60_000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        }

  const units: { label: string; value: string }[] = [
    { label: 'Zile', value: parts ? String(parts.days) : '—' },
    { label: 'Ore', value: parts ? pad(parts.hours) : '—' },
    { label: 'Minute', value: parts ? pad(parts.minutes) : '—' },
    { label: 'Secunde', value: parts ? pad(parts.seconds) : '—' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.34em] text-ink/70">Până la premieră</p>
      <p className="sr-only">
        {parts ? `${parts.days} zile, ${parts.hours} ore și ${parts.minutes} minute până la nuntă.` : 'Se calculează timpul rămas.'}
      </p>
      <dl aria-hidden="true" className="flex items-start gap-3 sm:gap-5">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-start gap-3 sm:gap-5">
            <div className="flex flex-col gap-1">
              <dt className="order-2 text-[0.65rem] uppercase tracking-[0.24em] text-ink/70">{u.label}</dt>
              <dd className="tabular order-1 font-sans text-[clamp(1.9rem,7vw,3.25rem)] font-light leading-none tracking-tight text-ink">
                {u.value}
              </dd>
            </div>
            {i < units.length - 1 ? (
              <span className="font-sans text-[clamp(1.9rem,7vw,3.25rem)] font-light leading-none text-ink/30">:</span>
            ) : null}
          </div>
        ))}
      </dl>
    </div>
  )
}
