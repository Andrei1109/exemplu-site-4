'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import type { Photo } from '@/lib/invitation/types'
import { cn } from '@/lib/utils'
import { FilmImage } from './film-image'

export const EASE = [0.22, 1, 0.36, 1] as const

/** Text that rises out of a hidden line, like a title card. */
export function TitleLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  // The observer sits on the unclipped wrapper: the inner line starts hidden by
  // overflow, so observing it directly would never register as in view.
  return (
    <motion.span
      className={cn('block overflow-hidden pb-[0.08em]', className)}
      initial={reduce ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

/** Soft fade for supporting copy. */
export function Fade({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'p' | 'li'
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Comp>
  )
}

/**
 * Photograph revealed through a letterbox mask that opens from the centre,
 * with a restrained parallax drift inside the frame.
 */
export function LetterboxImage({
  photo,
  sizes,
  className,
  parallax = 6,
}: {
  photo: Photo | null
  sizes?: string
  className?: string
  parallax?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden bg-ink', className)}
      initial={reduce ? false : { clipPath: 'inset(50% 0% 50% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.div
        className="absolute inset-x-0 -inset-y-[8%]"
        style={reduce ? undefined : { y }}
      >
        <FilmImage photo={photo} sizes={sizes} />
      </motion.div>
    </motion.div>
  )
}
