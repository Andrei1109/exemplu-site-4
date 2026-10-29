import type { InvitationConfig } from './types'

export type Attendance = 'da' | 'nu'

export type RSVPInput = {
  name: string
  attendance: Attendance | ''
  accompanyingGuests: number
  dietary: string[]
  dietaryNotes: string
  message: string
}

export type RSVPPayload = {
  eventId: string
  submissionId: string
  guestToken: string | null
  name: string
  attending: boolean
  accompanyingGuests: number
  dietary: string[]
  dietaryNotes: string
  message: string
}

export type RSVPErrors = Partial<Record<'name' | 'attendance' | 'accompanyingGuests' | 'dietaryNotes' | 'message', string>>

export type RSVPResult =
  | { status: 'saved' }
  | { status: 'demo' }
  | { status: 'error'; message: string }

export const LIMITS = { name: 80, dietaryNotes: 200, message: 500 }

export function validateRSVP(input: RSVPInput, config: InvitationConfig): RSVPErrors {
  const errors: RSVPErrors = {}
  const name = input.name.trim()
  if (name.length < 2) errors.name = 'Te rugăm să ne spui numele tău.'
  else if (name.length > LIMITS.name) errors.name = `Numele poate avea cel mult ${LIMITS.name} de caractere.`

  if (input.attendance !== 'da' && input.attendance !== 'nu') {
    errors.attendance = 'Alege dacă vei fi alături de noi.'
  }

  if (input.attendance === 'da') {
    const max = config.rsvp.maxAccompanyingGuests
    const n = input.accompanyingGuests
    if (!Number.isInteger(n) || n < 0 || n > max) {
      errors.accompanyingGuests = max === 0
        ? 'Această invitație este nominală.'
        : `Poți veni cu cel mult ${max} ${max === 1 ? 'însoțitor' : 'însoțitori'}.`
    }
    if (input.dietaryNotes.length > LIMITS.dietaryNotes) {
      errors.dietaryNotes = `Mențiunile pot avea cel mult ${LIMITS.dietaryNotes} de caractere.`
    }
  }

  if (input.message.length > LIMITS.message) {
    errors.message = `Mesajul poate avea cel mult ${LIMITS.message} de caractere.`
  }
  return errors
}

export function toPayload(input: RSVPInput, config: InvitationConfig, submissionId: string, guestToken: string | null): RSVPPayload {
  const attending = input.attendance === 'da'
  const allowedDietary = new Set(config.rsvp.dietaryOptions)
  return {
    eventId: config.eventId,
    submissionId,
    guestToken,
    name: input.name.trim(),
    attending,
    accompanyingGuests: attending ? input.accompanyingGuests : 0,
    dietary: attending ? input.dietary.filter((d) => allowedDietary.has(d)) : [],
    dietaryNotes: attending ? input.dietaryNotes.trim() : '',
    message: input.message.trim(),
  }
}

/**
 * Palfi Events integration point.
 * POSTs the RSVP to the configured endpoint. `submissionId` acts as an
 * idempotency key so the backend can de-duplicate retries.
 * Without an endpoint nothing is stored or sent and `demo` is returned.
 */
export async function submitRSVP(payload: RSVPPayload, config: InvitationConfig): Promise<RSVPResult> {
  if (!config.rsvp.endpoint) return { status: 'demo' }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(config.rsvp.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': payload.submissionId },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!res.ok) {
      return { status: 'error', message: 'Nu am putut înregistra răspunsul. Te rugăm să încerci din nou.' }
    }
    return { status: 'saved' }
  } catch {
    return {
      status: 'error',
      message: controller.signal.aborted
        ? 'Conexiunea a durat prea mult. Verifică internetul și încearcă din nou.'
        : 'A apărut o problemă de conexiune. Te rugăm să încerci din nou.',
    }
  } finally {
    clearTimeout(timeout)
  }
}
