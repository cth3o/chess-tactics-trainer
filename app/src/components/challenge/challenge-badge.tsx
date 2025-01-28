'use client'

import { MotionCard } from '@/components/ui/motion-card'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { min } from 'lodash'
import { BadgeInfo, CircleCheckBig } from 'lucide-react'
import Image from 'next/image'

interface ChallengeBadgeProps {
  name: string
  progress: number
  total: number[]
}

const PROGRESSION_BADGE_IMAGES = [
  '/badges/bronze.webp',
  '/badges/silver.webp',
  '/badges/gold.webp',
  '/badges/diamant.webp'
]

export const ChallengeBadge = ({
  name,
  progress,
  total
}: ChallengeBadgeProps) => {
  const firstIndex = total.findIndex((t) => progress < t)
  const level = firstIndex === -1 ? total.length : firstIndex + 1
  const totalForLevel = total[level - 1]
  const progression = min([(progress * 100) / totalForLevel, 100])
  const isFinished = progress >= totalForLevel

  return (
    <MotionCard
      className={cn(
        'flex flex-col justify-center items-center rounded-none bg-background/50 border-primary border-2'
      )}
    >
      <div className='text-white text-center bg-background/50 size-full mb-1 flex justify-around items-center'>
        <div className='block' />
        <span className='text-xs'>{name}</span>
        <Tooltip>
          <TooltipTrigger>
            <BadgeInfo size={15} className='mr-1' />
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      </div>
      <Image src={PROGRESSION_BADGE_IMAGES[level - 1]} alt='badge' width={200} height={200} />
      <Progress
        value={progression}
        className='rounded-none h-8'
      />
      <div className='text-sm text-muted-foreground bg-background/50 w-full text-center mt-1'>
        {isFinished ? (
          <CircleCheckBig size={20} className='mx-auto' color='white' />
        ) : (
          <span>
            {progress} / {totalForLevel}
          </span>
        )}
      </div>
    </MotionCard>
  )
}
