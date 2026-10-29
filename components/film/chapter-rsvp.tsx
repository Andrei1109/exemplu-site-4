'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Minus, Plus } from 'lucide-react'
import { useId, useRef, useState, type FormEvent } from 'react'
import {
  LIMITS,
  submitRSVP,
  toPayload,
  validateRSVP,
  type RSVPErrors,
  type RSVPInput,
} from '@/lib/invitation/rsvp'
import type { InvitationConfig } from '@/lib/invitation/types'
import { cn } from '@/lib/utils'
import { ChapterHeading } from './chapter-heading'
import { EASE, Fade } from './motion'

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'demo' }
  | { kind: 'error'; message: string }
  | { kind: 'saved'; attending: boolean; name: string }

type Props = {
  id: string
  config: InvitationConfig
  guestName: string | null
  guestToken: string | null
  deadlineLabel: string
  deadlinePassed: boolean
  dateLabel: string
}

const fieldLabel = 'text-[0.7rem] font-medium uppercase tracking-[0.28em] text-paper/80'
const textInput =
  'w-full border-0 border-b border-paper/40 bg-transparent px-0 py-3 text-lg text-paper placeholder:text-paper/45 transition-colors focus:border-paper focus:outline-none focus-visible:outline-none aria-invalid:border-destructive'

export function ChapterRSVP({ id, config, guestName, guestToken, deadlineLabel, deadlinePassed, dateLabel }: Props) {
  const uid = useId()
  const reduce = useReducedMotion()
  const isDemo = !config.rsvp.endpoint
  const max = config.rsvp.maxAccompanyingGuests

  const [input, setInput] = useState<RSVPInput>({
    name: guestName ?? '',
    attendance: '',
    accompanyingGuests: 0,
    dietary: [],
    dietaryNotes: '',
    message: '',
  })
  const [errors, setErrors] = useState<RSVPErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const submissionId = useRef<string | null>(null)
  const pending = useRef(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  const attending = input.attendance === 'da'
  const ids = {
    name: `${uid}-name`,
    attendance: `${uid}-attendance`,
    guests: `${uid}-guests`,
    notes: `${uid}-notes`,
    message: `${uid}-message`,
  }

  function update<K extends keyof RSVPInput>(key: K, value: RSVPInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }))
    if (status.kind === 'demo' || status.kind === 'error') setStatus({ kind: 'idle' })
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function toggleDietary(option: string) {
    update(
      'dietary',
      input.dietary.includes(option) ? input.dietary.filter((d) => d !== option) : [...input.dietary, option],
    )
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending.current) return

    const found = validateRSVP(input, config)
    setErrors(found)
    if (Object.values(found).some(Boolean)) {
      setStatus({ kind: 'idle' })
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    pending.current = true
    setStatus({ kind: 'submitting' })
    submissionId.current ??= crypto.randomUUID()
    const payload = toPayload(input, config, submissionId.current, guestToken)
    const result = await submitRSVP(payload, config)
    pending.current = false

    if (result.status === 'saved') setStatus({ kind: 'saved', attending: payload.attending, name: payload.name })
    else if (result.status === 'demo') setStatus({ kind: 'demo' })
    else setStatus({ kind: 'error', message: result.message })
  }

  const errorList = Object.entries(errors).filter(([, v]) => Boolean(v)) as [keyof RSVPErrors, string][]
  const errorTarget: Record<keyof RSVPErrors, string> = {
    name: ids.name,
    attendance: `${ids.attendance}-da`,
    accompanyingGuests: ids.guests,
    dietaryNotes: ids.notes,
    message: ids.message,
  }

  return (
    <section
      id={id}
      aria-labelledby={`${id}-titlu`}
      className="relative flex min-h-svh scroll-mt-14 flex-col bg-wine py-24 text-paper md:py-32"
    >
      <div className="mx-auto grid w-full max-w-screen-2xl flex-1 gap-16 px-5 md:grid-cols-12 md:gap-10 md:px-10">
        <div className="flex flex-col gap-8 md:col-span-5">
          <ChapterHeading id={`${id}-titlu`} numeral="IV" title="Ne vedem acolo?" kicker="Confirmarea" tone="wine" />
          <Fade as="p" className="max-w-sm text-base leading-relaxed text-pretty text-paper/85 md:text-lg">
            {deadlinePassed
              ? `Termenul de confirmare a trecut pe ${deadlineLabel}. Dacă nu ai apucat să ne răspunzi, scrie-ne direct.`
              : `Te rugăm să ne lași răspunsul tău până pe ${deadlineLabel}, ca să-ți putem păstra locul.`}
          </Fade>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <AnimatePresence mode="wait" initial={false}>
            {status.kind === 'saved' ? (
              <FinalTitle key="final" status={status} dateLabel={dateLabel} couple={config.invitation.signature} reduce={!!reduce} onEdit={() => setStatus({ kind: 'idle' })} />
            ) : deadlinePassed ? (
              <motion.p key="closed" className="border-t border-paper/30 pt-6 text-sm uppercase tracking-[0.24em] text-paper/80">
                Formularul de confirmare s-a închis.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                aria-describedby={isDemo ? `${uid}-demo` : undefined}
                className="flex flex-col gap-10"
                exit={reduce ? undefined : { opacity: 0, y: -12, transition: { duration: 0.4 } }}
              >
                {isDemo ? (
                  <p id={`${uid}-demo`} className="border border-paper/40 px-4 py-3 text-sm leading-relaxed text-paper">
                    <strong className="font-semibold uppercase tracking-[0.18em]">Mod demonstrativ.</strong>{' '}
                    Formularul nu este conectat la Palfi Events. Răspunsurile sunt doar verificate, nu sunt salvate și nu sunt trimise nimănui.
                  </p>
                ) : null}

                {errorList.length > 0 ? (
                  <div
                    ref={summaryRef}
                    tabIndex={-1}
                    role="alert"
                    className="flex flex-col gap-2 border-l-2 border-destructive bg-ink/25 px-4 py-3 focus:outline-none"
                  >
                    <p className="text-sm font-semibold">Mai avem nevoie de câteva detalii:</p>
                    <ul className="flex flex-col gap-1 text-sm">
                      {errorList.map(([key, msg]) => (
                        <li key={key}>
                          <a href={`#${errorTarget[key]}`} className="underline underline-offset-4">{msg}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="flex flex-col gap-2">
                  <label htmlFor={ids.name} className={fieldLabel}>Numele tău</label>
                  <input
                    id={ids.name}
                    name="name"
                    autoComplete="name"
                    maxLength={LIMITS.name}
                    value={input.name}
                    onChange={(e) => update('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${ids.name}-err` : undefined}
                    placeholder="Prenume și nume"
                    className={textInput}
                    required
                  />
                  <FieldError id={`${ids.name}-err`} message={errors.name} />
                </div>

                <fieldset
                  className="flex flex-col gap-3"
                  aria-invalid={!!errors.attendance}
                  aria-describedby={errors.attendance ? `${ids.attendance}-err` : undefined}
                >
                  <legend className={cn(fieldLabel, 'mb-3')}>Vei fi alături de noi?</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([
                      { value: 'da', title: 'Da, cu drag', hint: 'Ne vedem acolo.' },
                      { value: 'nu', title: 'Din păcate, nu', hint: 'Vă vom fi alături cu gândul.' },
                    ] as const).map((opt) => (
                      <label key={opt.value} htmlFor={`${ids.attendance}-${opt.value}`} className="relative cursor-pointer">
                        <input
                          id={`${ids.attendance}-${opt.value}`}
                          type="radio"
                          name="attendance"
                          value={opt.value}
                          checked={input.attendance === opt.value}
                          onChange={() => update('attendance', opt.value)}
                          className="peer sr-only"
                        />
                        <span className="flex min-h-20 flex-col justify-center gap-1 border border-paper/35 px-5 py-4 transition-colors peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-paper hover:border-paper">
                          <span className="font-serif text-2xl italic leading-none">{opt.title}</span>
                          <span className="text-sm opacity-80">{opt.hint}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <FieldError id={`${ids.attendance}-err`} message={errors.attendance} />
                </fieldset>

                <AnimatePresence initial={false}>
                  {attending ? (
                    <motion.div
                      key="attending-details"
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={reduce ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-10 pb-1">
                        {max > 0 ? (
                          <div className="flex flex-col gap-3">
                            <label htmlFor={ids.guests} className={fieldLabel}>Însoțitori</label>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => update('accompanyingGuests', Math.max(0, input.accompanyingGuests - 1))}
                                disabled={input.accompanyingGuests <= 0}
                                aria-label="Mai puțini însoțitori"
                                aria-controls={ids.guests}
                                className="flex size-12 items-center justify-center border border-paper/40 transition-colors hover:border-paper disabled:opacity-35"
                              >
                                <Minus aria-hidden="true" className="size-4" />
                              </button>
                              <input
                                id={ids.guests}
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={max}
                                step={1}
                                value={Number.isNaN(input.accompanyingGuests) ? '' : input.accompanyingGuests}
                                onChange={(e) => update('accompanyingGuests', e.target.value === '' ? Number.NaN : Number(e.target.value))}
                                aria-invalid={!!errors.accompanyingGuests}
                                aria-describedby={`${ids.guests}-hint${errors.accompanyingGuests ? ` ${ids.guests}-err` : ''}`}
                                className="tabular w-16 border-0 border-b border-paper/40 bg-transparent py-2 text-center font-sans text-3xl font-light text-paper focus:border-paper focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              />
                              <button
                                type="button"
                                onClick={() => update('accompanyingGuests', Math.min(max, (input.accompanyingGuests || 0) + 1))}
                                disabled={input.accompanyingGuests >= max}
                                aria-label="Mai mulți însoțitori"
                                aria-controls={ids.guests}
                                className="flex size-12 items-center justify-center border border-paper/40 transition-colors hover:border-paper disabled:opacity-35"
                              >
                                <Plus aria-hidden="true" className="size-4" />
                              </button>
                            </div>
                            <p id={`${ids.guests}-hint`} className="text-sm text-paper/75">
                              {`Invitația ta este valabilă pentru tine și până la ${max} ${max === 1 ? 'însoțitor' : 'însoțitori'}.`}
                            </p>
                            <FieldError id={`${ids.guests}-err`} message={errors.accompanyingGuests} />
                          </div>
                        ) : null}

                        <fieldset className="flex flex-col gap-3">
                          <legend className={cn(fieldLabel, 'mb-3')}>Preferințe alimentare <span className="normal-case tracking-normal opacity-75">(opțional)</span></legend>
                          <div className="flex flex-wrap gap-2">
                            {config.rsvp.dietaryOptions.map((opt) => {
                              const checked = input.dietary.includes(opt)
                              const optId = `${uid}-diet-${opt}`
                              return (
                                <label key={opt} htmlFor={optId} className="cursor-pointer">
                                  <input id={optId} type="checkbox" checked={checked} onChange={() => toggleDietary(opt)} className="peer sr-only" />
                                  <span className="flex min-h-11 items-center border border-paper/35 px-4 text-sm transition-colors peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-paper hover:border-paper">
                                    {opt}
                                  </span>
                                </label>
                              )
                            })}
                          </div>
                          <label htmlFor={ids.notes} className="sr-only">Alergii sau alte mențiuni</label>
                          <input
                            id={ids.notes}
                            maxLength={LIMITS.dietaryNotes}
                            value={input.dietaryNotes}
                            onChange={(e) => update('dietaryNotes', e.target.value)}
                            aria-invalid={!!errors.dietaryNotes}
                            aria-describedby={errors.dietaryNotes ? `${ids.notes}-err` : undefined}
                            placeholder="Alergii sau alte mențiuni"
                            className={cn(textInput, 'text-base')}
                          />
                          <FieldError id={`${ids.notes}-err`} message={errors.dietaryNotes} />
                        </fieldset>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="flex flex-col gap-2">
                  <label htmlFor={ids.message} className={fieldLabel}>
                    Un gând pentru noi <span className="normal-case tracking-normal opacity-75">(opțional)</span>
                  </label>
                  <textarea
                    id={ids.message}
                    rows={3}
                    maxLength={LIMITS.message}
                    value={input.message}
                    onChange={(e) => update('message', e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={`${ids.message}-count${errors.message ? ` ${ids.message}-err` : ''}`}
                    className={cn(textInput, 'resize-none text-base leading-relaxed')}
                  />
                  <p id={`${ids.message}-count`} className="tabular self-end text-xs text-paper/70">
                    {input.message.length}/{LIMITS.message}
                  </p>
                  <FieldError id={`${ids.message}-err`} message={errors.message} />
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={status.kind === 'submitting'}
                    aria-disabled={status.kind === 'submitting'}
                    className="flex min-h-14 items-center justify-center gap-3 bg-paper px-8 text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-ink transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70 sm:self-start"
                  >
                    {status.kind === 'submitting' ? (
                      <>
                        <span aria-hidden="true" className="size-3 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                        Se trimite…
                      </>
                    ) : (
                      'Trimite răspunsul'
                    )}
                  </button>

                  <div aria-live="polite" role="status">
                    {status.kind === 'demo' ? (
                      <p className="border-l-2 border-paper px-4 py-2 text-sm leading-relaxed">
                        Formularul este completat corect. Fiind în mod demonstrativ, răspunsul <strong>nu a fost salvat și nu a fost trimis</strong>.
                      </p>
                    ) : null}
                    {status.kind === 'error' ? (
                      <p className="border-l-2 border-destructive px-4 py-2 text-sm leading-relaxed">{status.message}</p>
                    ) : null}
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  )
}

function FinalTitle({
  status,
  dateLabel,
  couple,
  reduce,
  onEdit,
}: {
  status: { attending: boolean; name: string }
  dateLabel: string
  couple: string
  reduce: boolean
  onEdit: () => void
}) {
  const first = status.name.split(' ')[0]
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="flex min-h-[60svh] flex-col justify-center gap-8 border-t border-paper/30 pt-10"
      initial={reduce ? false : { clipPath: 'inset(50% 0% 50% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.34em] text-paper/80">Răspuns confirmat</p>
      <p className="font-serif text-[clamp(2.75rem,8vw,5.5rem)] italic leading-[0.95] text-balance">
        {status.attending ? `Ne vedem pe ${dateLabel}, ${first}.` : `Mulțumim, ${first}. Ne vei lipsi.`}
      </p>
      <p className="text-[0.72rem] uppercase tracking-[0.3em] text-paper/80">{couple}</p>
      <button type="button" onClick={onEdit} className="self-start text-sm underline underline-offset-4 hover:no-underline">
        Modifică răspunsul
      </button>
    </motion.div>
  )
}
