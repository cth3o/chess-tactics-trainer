import { GameCategory } from '@prisma/client'
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Tooltip } from '@/components/ui/tooltip'
import {
  CalendarClock,
  RabbitIcon,
  TrainFront,
  TurtleIcon,
  Zap
} from 'lucide-react'
import { toTitleCase } from '@/lib/strings'

interface GameCategoryIconProps {
  category: GameCategory
}

export const GameCategoryIcon = ({ category }: GameCategoryIconProps) => {
  const getIcon = () => {
    const icons = {
      blitz: <Zap size={20} />,
      rapid: <RabbitIcon size={20} />,
      bullet: <TrainFront size={20} />,
      classical: <TurtleIcon size={20} />,
      daily: <CalendarClock size={20} />
    }
    return icons[category] || null
  }

  return <Tooltip>
    <TooltipTrigger>
    {getIcon()}
    </TooltipTrigger>
    <TooltipContent className='p-2 text-white bg-black rounded-none'>
      {toTitleCase(category)}
    </TooltipContent>
    </Tooltip>
}
