import type { InvitationConfig } from './types'

/**
 * Single source of truth for every personalised value on the invitation.
 * Venue names, times, photos and copy are editable demo data.
 */
export const invitation: InvitationConfig = {
  eventId: 'palfi-demo-alexandra-matei-2027',
  locale: 'ro-RO',
  timeZone: 'Europe/Bucharest',
  presenter: 'Palfi Events',
  filmTitle: 'Un film despre noi',
  tagline: 'O poveste de dragoste în patru capitole',
  couple: {
    partnerOne: 'Alexandra',
    partnerTwo: 'Matei',
    monogram: 'A & M',
  },
  dates: {
    ceremonyStart: '2027-06-12T15:00:00+03:00',
    celebrationEnd: '2027-06-13T04:00:00+03:00',
    rsvpDeadline: '2027-05-15T23:59:59+03:00',
  },
  theme: {
    colors: {
      ink: '#101010',
      paper: '#F3F0EB',
      grain: '#777674',
      wine: '#6D3542',
    },
  },
  hero: {
    poster: {
      src: '/images/hero.webp',
      srcSmall: '/images/hero-sm.webp',
      alt: 'Alexandra și Matei, văzuți din spate, se plimbă ținându-se de mână pe un drum de țară, la ora albastră.',
      focus: '48% 60%',
    },
    video: null,
  },
  story: {
    subtitle: '„Am plecat înainte de final. Și am vorbit până s-au aprins luminile orașului.”',
    paragraphs: [
      'Ne-am cunoscut într-o seară ploioasă de octombrie, la o proiecție de film la care niciunul dintre noi nu voia, de fapt, să meargă.',
      'Au urmat șapte ani de drumuri lungi, cafele uitate pe masă, prieteni care au devenit familie și o mulțime de începuturi mărunte, pe care abia acum le înțelegem ca fiind o singură poveste.',
      'Acum ne pregătim pentru scena noastră preferată — și n-am vrea s-o trăim fără voi.',
    ],
    wide: {
      src: '/images/story.webp',
      srcSmall: '/images/story-sm.webp',
      alt: 'Alexandra și Matei râd, cu frunțile lipite, lângă o fereastră înaltă cu perdele subțiri.',
      focus: '50% 45%',
    },
    detail: {
      src: '/images/detail.webp',
      srcSmall: '/images/detail-sm.webp',
      alt: 'Prim-plan cu mâinile lor împreunate și o verighetă subțire.',
      focus: '50% 50%',
    },
    detailCaption: 'Prim-plan. Ziua în care am spus „da” pentru prima dată.',
  },
  invitation: {
    greetingFallback: 'Dragii noștri,',
    message:
      'Cu inimile pline de emoție, vă invităm să fiți alături de noi în ziua în care ne unim destinele. Vă păstrăm un loc în primul rând.',
    signature: 'Cu drag, Alexandra & Matei',
  },
  timeline: [
    { time: '15:00', title: 'Cununia religioasă', place: 'Biserica Sfântul Nicolae' },
    { time: '19:00', title: 'Primirea invitaților', place: 'The Garden Estate', note: 'Cocktail în grădină, la apus.' },
    { time: '20:00', title: 'Cina', place: 'The Garden Estate' },
    { time: '21:30', title: 'Primul dans', place: 'The Garden Estate' },
    { time: '23:30', title: 'Tortul miresei', place: 'The Garden Estate', note: 'Apoi, dans până în zori.' },
  ],
  venues: [
    {
      id: 'ceremonie',
      slugLine: 'INT. BISERICA SFÂNTUL NICOLAE — ZI',
      label: 'Cununia religioasă',
      name: 'Biserica Sfântul Nicolae',
      time: '15:00',
      address: null,
      mapsUrl: null,
      mapsQuery: 'Biserica Sfântul Nicolae',
      description: 'Lumina lumânărilor, liniștea dinaintea primului „da”. Vă rugăm să ajungeți cu un sfert de oră mai devreme.',
      photo: {
        src: '/images/ceremony.webp',
        srcSmall: '/images/ceremony-sm.webp',
        alt: 'Lumânări aprinse într-o biserică veche, în lumină caldă.',
        focus: '35% 50%',
      },
    },
    {
      id: 'receptie',
      slugLine: 'EXT. THE GARDEN ESTATE — SEARĂ',
      label: 'Recepția',
      name: 'The Garden Estate',
      time: '19:00',
      address: null,
      mapsUrl: null,
      mapsQuery: 'The Garden Estate',
      description: 'O masă lungă sub copaci bătrâni, cina, dansul și toată noaptea înainte.',
      photo: {
        src: '/images/reception.webp',
        srcSmall: '/images/reception-sm.webp',
        alt: 'O masă lungă așezată în grădină la apus, cu lumânări și ghirlande de lumini în copaci.',
        focus: '50% 55%',
      },
    },
  ],
  rsvp: {
    endpoint: null,
    maxAccompanyingGuests: 3,
    dietaryOptions: ['Vegetarian', 'Vegan', 'Fără gluten', 'Fără lactoză'],
  },
  closing: {
    photo: {
      src: '/images/finale.webp',
      srcSmall: '/images/finale-sm.webp',
      alt: 'Siluetele unui cuplu care dansează noaptea, sub câteva lumini calde.',
      focus: '50% 50%',
    },
    message: 'Orice film frumos are nevoie de oameni dragi în sală. Vă așteptăm.',
    credits: [
      { role: 'În rolurile principale', name: 'Alexandra & Matei' },
      { role: 'Scenariul', name: 'Șapte ani de povești' },
      { role: 'Coloana sonoră', name: 'Râsetele voastre' },
      { role: 'Distribuția', name: 'Familia și prietenii noștri' },
    ],
  },
  audio: null,
  features: {
    countdown: true,
    story: true,
    timeline: false,
    audio: true,
  },
}

export function mapsHref(venue: InvitationConfig['venues'][number]) {
  if (venue.mapsUrl) return venue.mapsUrl
  const query = venue.address ? `${venue.name}, ${venue.address}` : venue.mapsQuery
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions, config = invitation) {
  return new Intl.DateTimeFormat(config.locale, { timeZone: config.timeZone, ...options }).format(new Date(iso))
}
