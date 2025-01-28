'use client'

import { queryClient } from '@/app/providers'
import { getGamesLastSixMonths } from '@/lib/stats/insights-data'
import { ChessAccount } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useGameStore } from '../../stores/game.store'

interface BarWithBorderProps {
  fill: string
  x: number
  y: number
  width: number
  height: number
}

const BarWithBorder = () => {
  const ShapeComponent = ({
    fill,
    x,
    y,
    width,
    height
  }: BarWithBorderProps) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          stroke='none'
          fill={fill}
        />
        <rect
          x={x}
          y={y}
          width={width}
          height={2.2}
          stroke='none'
          fill={'hsl(var(--primary))'}
        />
      </g>
    )
  }
  return ShapeComponent
}

interface CountGameChartProps {
  initialData: {
    month: string
    games: number
  }[]
  chessAccounts: ChessAccount[]
}

export const CountGameChart = ({ initialData, chessAccounts }: CountGameChartProps) => {
  const selectedFilters = useGameStore((state) => state.filters)

  const { data, isLoading, error } = useQuery({
    queryKey: ['lastSixMonths'],
    queryFn: async () => await getGamesLastSixMonths(chessAccounts, selectedFilters),
    initialData: initialData,
  })

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['lastSixMonths'] })
  }, [selectedFilters, chessAccounts])

  if (isLoading) return <Loader2 className='size-6 animate-spin' />
  if (error) return <div>Error: {error.message}</div>

  return (
    <ResponsiveContainer width='100%' height={230}>
      <BarChart
        data={data}
        barGap={0}
        barCategoryGap={0}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id='colorGames' x1='0' y1='0' x2='0' y2='1'>
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
        <YAxis hide={true} />
        <CartesianGrid vertical={false} strokeDasharray='5 5' opacity={0.2} />
        <Tooltip
          cursor={false}
          contentStyle={{
            background: '#261F27',
            border: 'none',
            color: '#F7EFE4',
            fontSize: 11
          }}
        />
        <Bar
          dataKey='games'
          // @ts-ignore
          shape={BarWithBorder()}
          fillOpacity={1}
          background={false}
          activeColor='red'
          activeBar={false}
          fill='url(#colorGames)'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
