'use client'

import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { GameAnalysis } from '@prisma/client'
import {
  Ban,
  CircleHelp,
  Loader2,
  PartyPopper,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react'
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { createChessAnalysisTask } from '@/lib/cloudtask'
import { useGameStore } from '@/stores/game.store'
import { GameWithAnalysis } from '@/lib/games/games'
import { getAnalysisFromGame } from '@/lib/games/analysis'
import { BOARD_DARK_SQUARE_COLOR, BOARD_LIGHT_SQUARE_COLOR } from './chess-game'
import toast from 'react-hot-toast'

interface ChessAnalysisProps {
  game: GameWithAnalysis
  accountsIds: string[]
}

const REFRESH_INTERVAL = 2000

export const ChessAnalysis = ({ game, accountsIds }: ChessAnalysisProps) => {
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(
    game.analysis[0] || null
  )
  const [isLoading, setIsLoading] = useState(game.analysing)
  const setActiveMove = useGameStore((state) => state.setActiveMove)

  const getLastAnalysis = async () => {
    const currentAnalysis = await getAnalysisFromGame(game.id)
    setAnalysis(currentAnalysis)
    if (currentAnalysis !== null) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setAnalysis(game.analysis[0] || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id])

  // if loading polling analysis each 2 seconds
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(async () => {
        getLastAnalysis()
      }, REFRESH_INTERVAL)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  if (isLoading) {
    return (
      <Text as='h4'>
        <Loader2 className='ml-1 size-12 animate-spin' />
      </Text>
    )
  }

  if (analysis === null) {
    return (
      <div className='flex flex-col items-center justify-around p-8 gap-4 text-center'>
        <Text as='h4'>No analysis yet</Text>
        <Button
          onClick={async () => {
            setIsLoading(true)
            toast.success('Starting analysis, this may take a few seconds')
            createChessAnalysisTask(game.id)
          }}
        >
          Start analysis
        </Button>
      </div>
    )
  }

  const data = analysis.scores.map((item, index) => {
    const value = item.split(' ')[0]
    const type = item.split(' ')[1]
    if (type === 'mate') {
      return {
        move: index + 1,
        score: 1500,
        val: item
      }
    }

    const score = Number.parseInt(value, 10) * -1
    return {
      move: index + 1,
      score,
      val: item
    }
  })

  const maxValue = Math.max(...data.map((point) => Math.abs(point.score)))

  const getMoveQualityFromColor = (color: string) => {
    const moduleColor = color === 'white' ? 0 : 1
    const quality = analysis.movesQuality.filter(
      (item, index) => index % 2 === moduleColor
    )
    const movesQuality = quality.reduce(
      (acc, item) => {
        if (item === 'good') {
          acc.good += 1
        } else if (item === 'blunder') {
          acc.blunder += 1
        } else if (item === 'excellent') {
          acc.excellent += 1
        } else if (item === 'mistake') {
          acc.mistake += 1
        } else {
          acc.innacuracy += 1
        }
        return acc
      },
      { good: 0, blunder: 0, excellent: 0, innacuracy: 0, mistake: 0 }
    )
    return movesQuality
  }

  const movesQualityWhite = getMoveQualityFromColor('white')
  const movesQualityBlack = getMoveQualityFromColor('black')

  const processChartData = data.map((point) => ({
    move: point.move,
    evaluation: point.score + maxValue
  }))

  const getMoveColor = (cx: number) => {
    if (
      cx % 2 ===
      (game.whiteChessAccountId &&
      accountsIds.includes(game.whiteChessAccountId)
        ? 1
        : 0)
    ) {
      return ''
    }
    const category = analysis.movesQuality[cx]
    const mappingColors = {
      excellent: '#00FFFF',
      mistake: '#FFA500',
      blunder: '#FF0000',
      good: '',
      inaccuracy: ''
    }
    return mappingColors[category] || ''
  }

  const handleChartClick = (event: any) => {
    if (!event || !event.activeLabel) return
    const nearestPoint = data.find(
      (point) => point.move === Number(event.activeLabel)
    )
    if (nearestPoint) {
      setActiveMove(nearestPoint.move)
    }
  }

  return (
    <div className='size-full flex flex-col items-center gap-2 p-4 text-center'>
      <Text as='h4'>Game Analysis</Text>
      <div className='w-96 p-0 mt-2'>
        <ResponsiveContainer
          width='100%'
          height='35%'
          className='bg-foreground p-0'
        >
          <AreaChart data={processChartData} onClick={handleChartClick}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const sign =
                    payload &&
                    payload[0] &&
                    Number(payload[0].value) - maxValue >= 0
                      ? '+'
                      : '-'
                  const evaluation =
                    payload && payload[0] && Number(payload[0].value)
                  const content = `${sign} ${Math.abs((evaluation - maxValue) / 100).toFixed(2)}`
                  return (
                    <div className='bg-background text-white p-2 border-s-neutral-600 rounded-md'>
                      <p>{content}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type='monotone'
              dataKey='evaluation'
              stroke={BOARD_LIGHT_SQUARE_COLOR}
              fill={BOARD_LIGHT_SQUARE_COLOR}
              fillOpacity={1}
              isAnimationActive={false}
            />
            <ReferenceLine y={maxValue} stroke={BOARD_DARK_SQUARE_COLOR} />
            <Area
              type='monotone'
              dataKey='evaluation'
              stroke={BOARD_LIGHT_SQUARE_COLOR}
              fill={BOARD_LIGHT_SQUARE_COLOR}
              dot={(props) => {
                const { cx, cy, payload } = props
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={getMoveColor(payload.move) === '' ? 0 : 3}
                    fill={getMoveColor(payload.move)}
                    stroke='black'
                  />
                )
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className='flex flex-col mt-4 w-full text-sm text-center font-semibold pl-8'>
          <div className='flex'>
            <div className='w-2/12'> </div>
            <div className='w-5/12'> {game.whitePlayer} </div>
            <div className='w-1/12'> </div>
            <div className='w-4/12'> {game.blackPlayer} </div>
          </div>
          <div className='flex text-cyan-400'>
            <div className='w-2/12 text-left'> Excellent </div>
            <div className='w-5/12'> {movesQualityWhite.excellent} </div>
            <div className='w-2/12'>
              {' '}
              <PartyPopper width={18} />{' '}
            </div>
            <div className='w-2/12'> {movesQualityBlack.excellent} </div>
          </div>
          <div className='flex text-green-400'>
            <div className='w-2/12 text-left'> Good </div>
            <div className='w-5/12'> {movesQualityWhite.good} </div>
            <div className='w-2/12'>
              {' '}
              <ThumbsUp width={18} />{' '}
            </div>
            <div className='w-2/12'> {movesQualityBlack.good} </div>
          </div>
          <div className='flex text-yellow-400'>
            <div className='w-2/12 text-left'> Inaccuracy </div>
            <div className='w-5/12'> {movesQualityWhite.innacuracy} </div>
            <div className='w-2/12'>
              {' '}
              <ThumbsDown width={18} />{' '}
            </div>
            <div className='w-2/12'> {movesQualityBlack.innacuracy} </div>
          </div>
          <div className='flex text-orange-400'>
            <div className='w-2/12 text-left'> Mistake </div>
            <div className='w-5/12'> {movesQualityWhite.mistake} </div>
            <div className='w-2/12'>
              {' '}
              <Ban width={18} />{' '}
            </div>
            <div className='w-2/12'> {movesQualityBlack.mistake} </div>
          </div>
          <div className='flex text-red-400'>
            <div className='w-2/12 text-left'> Blunder </div>
            <div className='w-5/12'> {movesQualityWhite.blunder} </div>
            <div className='w-2/12'>
              {' '}
              <CircleHelp width={18} />{' '}
            </div>
            <div className='w-2/12'> {movesQualityBlack.blunder} </div>
          </div>
        </div>
      </div>
    </div>
  )
}
