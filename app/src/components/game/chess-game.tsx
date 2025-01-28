'use client'

import { Chessboard } from 'react-chessboard'
import { useGameStore } from '../../stores/game.store'
import { Chess } from 'chess.js'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import { MotionCard } from '@/components/ui/motion-card'
import { chunk, isNil } from 'lodash'
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { GameCategory } from '@prisma/client'
import { GameCategoryIcon } from './game-category-icon'
import { ChessAnalysis } from './chess-analysis'

export const PREVIOUS_MOVE_COLOR = 'rgba(255, 255, 0, 0.3)'
export const NEXT_MOVE_COLOR = 'rgba(0, 255, 0, 0.3)'
export const BOARD_DARK_SQUARE_COLOR = '#283762'
export const BOARD_LIGHT_SQUARE_COLOR = '#BAC3E4'

interface ChessGameProps {
  accountIds: string[]
}

export const ChessGame = ({
  accountIds
}: ChessGameProps) => {
  const moveRefs = useRef<HTMLElement[]>([])
  const [game, activeMove] = useGameStore((state) => [
    state.game,
    state.activeMove
  ])
  const [moveIndex, setMoveIndex] = useState(0)
  const [currentGame, setCurrentGame] = useState(new Chess())
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null
  )

  const scrollToMove = (index: number) => {
    moveRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const goToMove = (index: number) => {
    if (isNil(game)) {
      return
    }
    setLastMove(null)
    const gameCopy = new Chess()
    for (const move of game.pgn.split(' ').slice(0, index)) {
      const result = gameCopy.move(move, { strict: true })
      setLastMove({
        from: result.from,
        to: result.to
      })
    }
    setCurrentGame(gameCopy)
    setMoveIndex(index)
    scrollToMove(Math.floor(index / 2))
  }

  useEffect(() => {
    goToMove(activeMove)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMove])

  const goToNextMove = () => {
    goToMove(moveIndex + 1)
  }

  const goToPreviousMove = () => {
    goToMove(moveIndex - 1)
  }

  const goToFirstMove = () => {
    goToMove(0)
  }

  const goTolastMove = () => {
    if (!isNil(game)) {
      goToMove(game.pgn.split(' ').length)
    }
  }

  useEffect(() => {
    setCurrentGame(new Chess())
    setMoveIndex(0)
    scrollToMove(0)
    setLastMove(null)
  }, [game])

  if (isNil(game)) {
    return null
  }

  const customSquareStyles = () => {
    if (!lastMove) return {}
    return {
      [lastMove.from]: { backgroundColor: PREVIOUS_MOVE_COLOR },
      [lastMove.to]: { backgroundColor: NEXT_MOVE_COLOR }
    }
  }

  return (
    <MotionCard
      className={cn(
        'col-span-12 h-96 bg-foreground',
        'border-active border-l-4 border-r-0 border-t-0 border-b-0 text-white rounded-none'
      )}
    >
      <div className='flex p-4 px-8 size-full'>
        <div className='flex items-center size-full xl:w-2/3'>
          <div className=''>
            <Chessboard
              id='BasicBoard'
              boardWidth={350}
              arePiecesDraggable={false}
              boardOrientation={
                game.whiteChessAccountId && accountIds.includes(game.whiteChessAccountId)  ? 'white' : 'black'
              }
              position={currentGame.fen()}
              customSquareStyles={customSquareStyles()}
              customDarkSquareStyle={{ backgroundColor: BOARD_DARK_SQUARE_COLOR }}
              customLightSquareStyle={{ backgroundColor: BOARD_LIGHT_SQUARE_COLOR }}
            />
          </div>
          <div className='flex flex-col items-start justify-start text-sm px-8 size-full min-w-72 gap-2'>
            <div className='flex justify-center gap-10 align-baseline w-full'>
              <div className='flex align-baseline justify-center gap-1 pt-2'>
                <div>
                  <GameCategoryIcon category={game.category as GameCategory} />
                </div>
                {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
              </div>
              <div className='flex flex-col'>
                <span>
                  {game.whitePlayer} ({game.whiteRating})
                </span>
                <span>
                  {game.blackPlayer} ({game.blackRating})
                </span>
              </div>
              <div className='flex justify-center pt-2'>
                {formatDistanceToNow(game.date, { addSuffix: true })}
              </div>
            </div>

            <div className='w-full overflow-x-auto border-collapse border border-gray-900 max-h-60'>
              <table className='table-auto w-full'>
                <thead className='sticky top-0 text-center bg-foreground'>
                  <i className='flex items-center justify-start gap-2 text-base'>
                    <BookOpenText size={14} className='ml-4' />
                    {game.opening}
                  </i>
                </thead>
                {chunk(game.pgn.split(' '), 2).map(
                  // @ts-ignore
                  (moves: string[], index: number) => {
                    return (
                      <tr
                        className='flex justify-start gap-8 text-base odd:bg-foreground even:bg-background'
                        key={`move-${index}`}
                        // @ts-ignore
                        ref={(el: HTMLTableRowElement | null) =>
                          (moveRefs.current[index] = el!)
                        }
                      >
                        <td className='w-14 ml-16'>{index + 1}.</td>
                        <td
                          onClick={() => goToMove(index * 2 + 1)}
                          className={cn('w-14 cursor-pointer', {
                            'font-bold text-active':
                              Math.floor((moveIndex - 1) / 2) === index &&
                              moveIndex % 2 === 1
                          })}
                        >
                          {moves[0]}
                        </td>
                        <td
                          onClick={() => goToMove(index * 2 + 2)}
                          className={cn('w-14 cursor-pointer', {
                            'font-bold text-active':
                              Math.floor((moveIndex - 1) / 2) === index &&
                              moveIndex % 2 === 0
                          })}
                        >
                          {moves[1]}
                        </td>
                      </tr>
                    )
                  }
                )}
              </table>
            </div>
            <div className='flex justify-center gap-4 w-full mt-4'>
              <Button
                size='sm'
                onClick={goToFirstMove}
                disabled={moveIndex <= 0}
              >
                <ChevronsLeft />
              </Button>
              <Button
                size='sm'
                onClick={goToPreviousMove}
                disabled={moveIndex <= 0}
              >
                <ChevronLeft />
              </Button>
              <Button
                size='sm'
                onClick={goToNextMove}
                disabled={moveIndex >= game.pgn.split(' ').length}
              >
                <ChevronRight />
              </Button>
              <Button
                size='sm'
                onClick={goTolastMove}
                disabled={moveIndex >= game.pgn.split(' ').length}
              >
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
        <div className='items-center justify-center hidden w-1/3 h-full bg-background xl:flex'>
          <ChessAnalysis game={game} />
        </div>
      </div>
    </MotionCard>
  )
}
