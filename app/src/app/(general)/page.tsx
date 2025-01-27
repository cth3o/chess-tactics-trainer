import { ChessGame } from '@/components/game/chess-game'
import { FilterButton } from '@/components/game/filter-button'
import { LatestGamesTable } from '@/components/game/latest-games-table'
import { ComputedNumber } from '@/components/stats/computed-value'
import { CountGameChart } from '@/components/stats/count-game-chart'
import { RatioVictoryChart } from '@/components/stats/ratio-victory-chart'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionCard } from '@/components/ui/motion-card'
import { Text } from '@/components/ui/text'
import { checkServerSessionOrRedirect, getChessAccountFromUser } from '@/lib/authentication'
import { getGamesFromAccounts } from '@/lib/games/games'
import { GameFilters } from '@/lib/stats/filters'
import { 
  countTotalGames, 
  getGamesLastSixMonths, 
  getWinPercentageAverage, 
  getWinPercentageLastSixMonths 
} from '@/lib/stats/insights-data'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const EMPTY_FILTERS: GameFilters = {
  providers: [],
  categories: [],
  winner: [],
  tags: [],
  adversary: [],
  analysed: []
}

export default async function DashboardPage() {
  const user = await checkServerSessionOrRedirect()
  const chessAccounts = getChessAccountFromUser(user)
  const games = await getGamesFromAccounts(chessAccounts)

  const victoryRatioData = await getWinPercentageLastSixMonths(chessAccounts, EMPTY_FILTERS)
  const victoryRatioAverage =
    victoryRatioData.reduce((acc, curr) => acc + curr.precision, 0) /
    victoryRatioData.length

  return (
    <div className='grid size-full grid-flow-row-dense grid-cols-12 gap-4'>
      <MotionCard
        className={cn(
          'col-span-12 bg-foreground xl:col-span-6 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle className='flex w-full justify-between items-center'>
              <Link href='/games' className='hover:underline'>
                Latest Games
              </Link>
            <FilterButton />
          </CardTitle>
        </CardHeader>
        <CardContent className='h-72 block'>
          <LatestGamesTable 
            initialGames={games} 
            chessAccounts={chessAccounts} 
            pagination={false}
          />
        </CardContent>
      </MotionCard>

      <MotionCard
        className={cn(
          'col-span-12 h-full bg-foreground lg:col-span-6 xl:col-span-3 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle>Number of games</CardTitle>
          <Text as='h4'>
            <ComputedNumber
              computedKey='totalGames'
              initialValue={await countTotalGames(chessAccounts, EMPTY_FILTERS)}
              chessAccounts={chessAccounts}
              computedFunction={countTotalGames}
            />
          </Text>
        </CardHeader>
        <CardContent className='flex flex-col pt-8'>
          <CountGameChart 
            initialData={await getGamesLastSixMonths(chessAccounts, EMPTY_FILTERS)} 
            chessAccounts={chessAccounts} 
            />
        </CardContent>
      </MotionCard>

      <MotionCard
        className={cn(
          'col-span-12 h-full bg-foreground lg:col-span-6 xl:col-span-3 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle>Victory Ratio</CardTitle>
          <Text as='h4'>
            <ComputedNumber 
              computedKey='victoryRatio'
              initialValue={victoryRatioAverage} 
              chessAccounts={chessAccounts} 
              computedFunction={getWinPercentageAverage}
            />
            %
            </Text>
        </CardHeader>
        <CardContent className='flex flex-col pt-8'>
          <RatioVictoryChart 
            initialData={victoryRatioData} 
            chessAccounts={chessAccounts}
          />
        </CardContent>
      </MotionCard>

      <ChessGame accountIds={chessAccounts.map((account) => account.id)}/>
    </div>
  )
}
