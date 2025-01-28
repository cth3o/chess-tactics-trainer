'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const MotionCard = motion(Card)

export const AboutContent = () => {
  return (
    <MotionCard
      className={cn(
        'text-white bg-foreground border-l-4 border-r-0',
        'border-t-0 border-b-0 border-active rounded-none col-span-6 size-full'
      )}
      animate={{ x: 0, opacity: 1 }}
      initial={{ x: -50, opacity: 0 }}
    >
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardDescription className='h-40 p-4'>
        <p>
          Chess Tactics Manager is a web application that allows you to practice
          chess tactics. It is built with Next.js, Tailwind CSS, and TypeScript.
          The application is open-source and available on GitHub.
        </p>
        <br />
        <p>
          This application is built and maintained by{' '}
          <a
            href='https://www.speedrun.com/users/Zatonix'
            className='underline'
          >
            Zatonix
          </a>{' '}
          a french passionated developer.
        </p>
      </CardDescription>
    </MotionCard>
  )
}
