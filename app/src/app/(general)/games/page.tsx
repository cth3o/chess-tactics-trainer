import { FilterButton } from '@/components/game/filter-button'
import { LatestGamesTable } from '@/components/game/latest-games-table'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionCard } from '@/components/ui/motion-card'
import { checkServerSessionOrRedirect, getChessAccountFromUser } from '@/lib/authentication'
import { getGamesCount, getGamesFromAccounts } from '@/lib/games/games'
import { cn } from '@/lib/utils'

const GAMES_PER_PAGE = 10

interface GameSearchParams {
  page: string
}

interface GamesPageProps {
  searchParams: GameSearchParams
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const user = await checkServerSessionOrRedirect()
  const chessAccounts = getChessAccountFromUser(user)

  const { page } = searchParams
  let pageNumber = parseInt(page, 10) || 1
  if (pageNumber < 1) {
    pageNumber = 1
  }

  const games = await getGamesFromAccounts(chessAccounts, GAMES_PER_PAGE, pageNumber)
  const totalGames = await getGamesCount(chessAccounts)
  const maxPage = Math.ceil(totalGames / GAMES_PER_PAGE)

  return (
    <>
      <MotionCard
        className={cn(
          'col-span-12 h-[calc(100vh-2rem)] bg-foreground xl:col-span-6 p-2 text-white rounded-none border-none'
        )}
      >
        <CardHeader>
          <CardTitle className='flex w-full justify-between items-center'>
            Games
            <FilterButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LatestGamesTable
            initialGames={games}
            chessAccounts={chessAccounts}
            page={pageNumber}
            gamesPerPage={GAMES_PER_PAGE}
            enabledPreview={false}
            maxPage={maxPage}
          />
        </CardContent>
      </MotionCard>
    </>
  )
}
