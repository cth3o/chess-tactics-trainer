'use client'

import { getFilteredGames } from '@/lib/stats/insights-data'
import { cn } from '@/lib/utils'
import { ChessAccount } from '@prisma/client'
import {
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useGameStore } from '@/stores/game.store'
import { NoGameFound } from './no-game-found'
import { getLatestGamesColumns } from './latest-games-columns'
import { GameWithAnalysis } from '@/lib/games/games'

interface LatestGamesTableProps {
  chessAccounts: ChessAccount[]
  initialGames: GameWithAnalysis[]
  pagination?: boolean
  page?: number
  maxPage?: number
  gamesPerPage?: number
  enabledPreview?: boolean
}

export const LatestGamesTable = ({
  chessAccounts,
  initialGames,
  pagination = true,
  page = 1,
  maxPage = 1,
  gamesPerPage = 10,
  enabledPreview = true
}: LatestGamesTableProps) => {
  const [latestGames, setLatestGames] = useState(() => [...initialGames])
  const [lastPage, setLastPage] = useState(maxPage)
  const [selected, setSelected, selectedFilters] = useGameStore((state) => [
    state.game,
    state.setGame,
    state.filters
  ])

  useEffect(() => {
    const fetchFilteredGames = async () => {
      const offset = (page - 1) * gamesPerPage
      const games = await getFilteredGames(
        chessAccounts,
        selectedFilters,
        gamesPerPage,
        offset
      )
      const totalGames = await getFilteredGames(chessAccounts, selectedFilters)
      setLastPage(Math.ceil(totalGames.length / gamesPerPage))
      setLatestGames(games as GameWithAnalysis[])
    }
    fetchFilteredGames()
  }, [selectedFilters, chessAccounts, page, gamesPerPage])

  const table = useReactTable({
    data: latestGames,
    getCoreRowModel: getCoreRowModel(),
    columns: getLatestGamesColumns(chessAccounts.map((account) => account.id))
  })

  const handleClickGame = (game: GameWithAnalysis) => {
    if (!enabledPreview) return
    if (selected === game) {
      setSelected(null)
    } else {
      setSelected(game)
    }
  }

  if (latestGames.length === 0) {
    return <NoGameFound marginTop={24} />
  }

  return (
    <div className='overflow-y-auto h-full border-background/50 border-2'>
      <table className='table-auto w-full'>
        <thead className='w-full text-white bg-foreground h-8 sticky top-0'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className='text-center'>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                'h-16 text-center even:bg-foreground odd:bg-background cursor-pointer',
                ' hover:bg-active/20 border-active',
                {
                  'bg-active/50 border-l-4': selected === row.original,
                  'odd:bg-active/50 border-l-4': selected === row.original,
                  'even:bg-active/50 border-l-4': selected === row.original
                }
              )}
              onClick={() => handleClickGame(row.original as GameWithAnalysis)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className='flex justify-center w-full pt-4 gap-1'>
          <Link href={`/games?page=${page - 1}`}>
            <Button disabled={page <= 1}>
              <ChevronsLeft />
            </Button>
          </Link>
          <Button className='bg-white/85' variant='secondary' disabled>
            Page {page}
          </Button>
          <Link href={`/games?page=${page + 1}`}>
            <Button disabled={page >= lastPage}>
              <ChevronsRight />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
