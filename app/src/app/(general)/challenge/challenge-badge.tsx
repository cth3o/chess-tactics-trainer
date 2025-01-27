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

export const ChallengeBadge = ({
  name,
  progress,
  total
}: ChallengeBadgeProps) => {
  const level =
    progress < total[0]
      ? 1
      : progress < total[1]
        ? 2
        : progress < total[2]
          ? 3
          : 4
  const levelImage = {
    1: '/badges/bronze.webp',
    2: '/badges/silver.webp',
    3: '/badges/gold.webp',
    4: '/badges/diamant.webp'
  }

  return (
    <MotionCard
      className={cn(
        'flex flex-col justify-center items-center rounded-none bg-background border-background border-4'
      )}
    >
      <div className='text-white text-center bg-foreground size-full mb-1 flex justify-around items-center'>
        <div className='block' />
        <span className='text-sm'>{name}</span>
        <Tooltip>
          <TooltipTrigger>
            <BadgeInfo size={15} className='mr-1' />
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      </div>
      <Image
        src={levelImage[level]}
        alt='sicilian gold'
        width={200}
        height={200}
      />
      <Progress
        value={min([(progress * 100) / total[level - 1], 100])}
        className='rounded-none'
      />
      <div className='text-sm text-muted-foreground bg-foreground w-full text-center mt-1'>
        {progress >= total[level - 1] ? (
          <CircleCheckBig size={20} className='mx-auto' color='white' />
        ) : (
          <span>
            {progress} / {total[level - 1]}
          </span>
        )}
      </div>
    </MotionCard>
  )
}
