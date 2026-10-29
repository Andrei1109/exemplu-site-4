'use client'

import { useEffect, useRef, useState } from 'react'
import type { Photo } from '@/lib/invitation/types'
import { cn } from '@/lib/utils'

type Props = {
  photo: Photo | null
  sizes?: string
  priority?: boolean
  className?: string
}

/** Responsive photo that degrades to a tonal frame instead of a broken-image icon. */
export function FilmImage({ photo, sizes = '100vw', priority = false, className }: Props) {
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  if (!photo || failed) {
    return <div aria-hidden="true" className={cn('film-fallback h-full w-full', className)} />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={photo.src}
      srcSet={photo.srcSmall ? `${photo.srcSmall} 900w, ${photo.src} 1920w` : undefined}
      sizes={sizes}
      alt={photo.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
      style={{ objectPosition: photo.focus ?? '50% 50%' }}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
