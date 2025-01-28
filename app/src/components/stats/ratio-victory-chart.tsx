'use client'

import { queryClient } from '@/app/providers'
import { getWinPercentageLastSixMonths } from '@/lib/stats/insights-data'
import { ChessAccount } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useGameStore } from '../../stores/game.store'

interface RatioVictoryChartProps {
  initialData: { month: string, precision: number }[]
  chessAccounts: ChessAccount[]
}

export const RatioVictoryChart = ({ initialData, chessAccounts }: RatioVictoryChartProps) => {
  const selectedFilters = useGameStore((state) => state.filters)

  const { data, isLoading, error } = useQuery({
    queryKey: ['ratioVictory'],
    queryFn: async () => await getWinPercentageLastSixMonths(chessAccounts, selectedFilters),
    initialData: initialData,
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['ratioVictory'] })
  }, [selectedFilters, chessAccounts])

  if (isLoading) return <Loader2 className='size-6 animate-spin' />
  if (error) return <div>Error: {error.message}</div>

  return (
    <ResponsiveContainer width='100%' height={230}>
      <AreaChart
        data={data}
        margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
      >
        <defs>
          <linearGradient id='colorPrecision' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#A36624' stopOpacity={0.3} />
            <stop offset='95%' stopColor='#A36624' stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey='month'
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#F7EFE4', fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#F7EFE4', fontSize: 11 }}
          domain={[0, 100]}
        />
        <CartesianGrid vertical={false} strokeDasharray='5 5' opacity={0.2} />
        <Tooltip
          contentStyle={{
            background: '#261F27',
            border: 'none',
            color: '#F7EFE4',
            fontSize: 11
          }}
        />
        <Area
          type='monotone'
          dataKey='precision'
          stroke='hsl(var(--primary))'
          strokeWidth={2.2}
          fillOpacity={1}
          fill='url(#colorPrecision)'
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
