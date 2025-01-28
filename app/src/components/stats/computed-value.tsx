'use client'

import { ChessAccount } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useGameStore } from '@/stores/game.store'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { queryClient } from '@/app/providers'
import { GameFilters } from '@/lib/stats/filters'

interface ComputedNumberProps {
  computedKey: string
  initialValue: number
  chessAccounts: ChessAccount[]
  // eslint-disable-next-line no-unused-vars
  computedFunction: (chessAccounts: ChessAccount[], filters: GameFilters) => Promise<number>
}

export const ComputedNumber = ({ computedKey, initialValue, chessAccounts, computedFunction }: ComputedNumberProps) => {
  const selectedFilters = useGameStore((state) => state.filters)

  const { data: computedValue, isLoading, error } = useQuery({
    queryKey: ['filteredData', computedKey],
    queryFn: async () => await computedFunction(chessAccounts, selectedFilters),
    initialData: initialValue,
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['filteredData', computedKey] })
  }, [selectedFilters, chessAccounts, computedKey])

  if (isLoading) return <Loader2 className='size-6 animate-spin' />
  if (error) return <div>Error: {error.message}</div>

  return <>{computedValue.toLocaleString('en-US')}</>
}
