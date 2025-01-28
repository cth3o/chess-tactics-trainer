import { Game } from '@prisma/client'
import { createColumnHelper } from '@tanstack/react-table'
import { GameCategoryIcon } from './game-category-icon'
import { TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { Crown, Skull, Minus, WandSparkles } from 'lucide-react'
import { Tooltip } from '@/components/ui/tooltip'
import { Badge } from '../ui/badge'

const columnHelper = createColumnHelper<Game>()

export const getLatestGamesColumns = (accountIds: string[]) => {
  const latestGamesColumns = [
    columnHelper.accessor('category', {
      size: 100,
      header: () => <span>Speed</span>,
      cell: (info) => {
        return (
          <div className='flex items-center justify-center'>
            <GameCategoryIcon category={info.getValue()} />
          </div>
        )
      }
    }),
    {
      id: 'players',
      accessor: 'players',
      cell: (props: any) => (
        <div className='flex flex-col gap-1'>
          <div>{props.row.original.whitePlayer}</div>
          <div>{props.row.original.blackPlayer}</div>
        </div>
      ),
      size: 100,
      header: () => <span>Players</span>
    },
    {
      id: 'result',
      accesor: 'result',
      size: 100,
      header: () => <span>Result</span>,
      cell: (props: any) => (
        <div className='flex flex-col gap-1'>
          <div className='flex justify-center align-baseline gap-1'>
            <div className='h-full m-auto mx-1'>
              {props.row.original.winner === 'white' ? (
                <Crown size={15} />
              ) : props.row.original.winner === 'black' ? (
                <Skull size={15} />
              ) : (
                <Minus size={15} />
              )}
            </div>
            <div className='h-full'>{props.row.original.whiteRating}</div>
          </div>
          <div className='flex justify-center align-baseline gap-1'>
            <div className='h-full m-auto mx-1'>
              {props.row.original.winner === 'black' ? (
                <Crown size={15} />
              ) : props.row.original.winner === 'white' ? (
                <Skull size={15} />
              ) : (
                <Minus size={15} />
              )}
            </div>
            <div className='h-full'>{props.row.original.blackRating}</div>
          </div>
        </div>
      )
    },
    columnHelper.accessor('status', {
      size: 100,
      header: () => <span>Status</span>,
      cell: (props) => {
        const isWin =
          (props.row.original.winner === 'white' &&
            props.row.original.whiteChessAccountId &&
            accountIds.includes(props.row.original.whiteChessAccountId)) ||
          (props.row.original.winner === 'black' &&
            props.row.original.blackChessAccountId &&
            accountIds.includes(props.row.original.blackChessAccountId))
        const isLoose =
          (props.row.original.winner === 'black' &&
            props.row.original.whiteChessAccountId &&
            accountIds.includes(props.row.original.whiteChessAccountId)) ||
          (props.row.original.winner === 'white' &&
            props.row.original.blackChessAccountId &&
            accountIds.includes(props.row.original.blackChessAccountId))
        return (
          <Badge
            className={clsx(
              'text-white rounded bg-white/20 hover:bg-white/20',
              {
                'bg-green-600/50 hover:bg-green-600/50': isWin,
                'bg-red-600/50 hover:bg-red-600/50': isLoose
              }
            )}
          >
            {props.row.original.status}
          </Badge>
        )
      }
    }),
    columnHelper.accessor('status', {
      size: 100,
      header: 'Analysis',
      cell: (props: any) => {
        return (
          <div className='flex items-center justify-center'>
            <WandSparkles
              size='20'
              className={
                isEmpty(props.row.original.analysis)
                  ? 'text-white/30'
                  : 'text-white'
              }
            />
          </div>
        )
      }
    }),
    columnHelper.accessor('date', {
      size: 150,
      header: 'Date',
      cell: (info) => (
        <Tooltip>
          <TooltipTrigger>
            {info.getValue().toLocaleDateString('en-EN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </TooltipTrigger>
          <TooltipContent className='p-2 text-white bg-black border-l-4 rounded-none shadow-xl border-primary'>
            {info.getValue().toLocaleString('en-EN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}
          </TooltipContent>
        </Tooltip>
      )
    })
  ]

  return latestGamesColumns
}
