export type Photo = {
  /** Full-size asset (used on larger screens). */
  src: string
  /** Optional smaller asset (~900px wide) for phones. */
  srcSmall?: string
  alt: string
  /** CSS object-position, e.g. "52% 60%". Controls meaningful cropping. */
  focus?: string
}

export type HeroVideo = {
  /** 5–8 second, muted, H.264/MP4 or WebM loop. */
  src: string
  /** Lighter encode for phones (≤ 720p). */
  srcMobile?: string
  type?: 'video/mp4' | 'video/webm'
}

export type ThemeColors = {
  ink: string
  paper: string
  grain: string
  wine: string
}

export type TimelineScene = {
  time: string
  title: string
  place?: string
  note?: string
}

export type Venue = {
  id: string
  /** Screenplay-style slug line, e.g. "INT. BISERICĂ — ZI". */
  slugLine: string
  label: string
  name: string
  time: string
  /** Leave null when no verified address exists — never invent one. */
  address: string | null
  /** Explicit Maps link. If null, a search link is built from mapsQuery. */
  mapsUrl: string | null
  mapsQuery: string
  description: string
  photo: Photo | null
}

export type CreditLine = { role: string; name: string }

export type InvitationConfig = {
  /** Palfi Events unique identifier for this event. */
  eventId: string
  locale: string
  timeZone: string
  presenter: string
  filmTitle: string
  tagline: string
  couple: {
    partnerOne: string
    partnerTwo: string
    monogram: string
  }
  dates: {
    /** ISO 8601 with offset. */
    ceremonyStart: string
    /** End of the celebration — after this the page switches to the past-event state. */
    celebrationEnd: string
    rsvpDeadline: string
  }
  theme: {
    colors: ThemeColors
  }
  hero: {
    poster: Photo | null
    video: HeroVideo | null
  }
  story: {
    subtitle: string
    paragraphs: string[]
    wide: Photo | null
    detail: Photo | null
    detailCaption: string
  }
  invitation: {
    greetingFallback: string
    message: string
    signature: string
  }
  timeline: TimelineScene[]
  venues: Venue[]
  rsvp: {
    /** Palfi Events RSVP endpoint. When null the form runs in an explicitly labeled demo mode. */
    endpoint: string | null
    maxAccompanyingGuests: number
    dietaryOptions: string[]
  }
  closing: {
    photo: Photo | null
    message: string
    credits: CreditLine[]
  }
  audio: {
    src: string
    title: string
  } | null
  features: {
    countdown: boolean
    story: boolean
    timeline: boolean
    audio: boolean
  }
}
