import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionCard } from '@/components/ui/motion-card'
import { checkServerSessionOrRedirect, getChessAccountFromUser } from '@/lib/authentication'
import { cn } from '@/lib/utils'
import { StatsCharts } from './stats'
import { getCountGamesPerDay } from '@/lib/stats/stats'

const NUM_DAYS = 365

export default async function StatsPage() {
  const user = await checkServerSessionOrRedirect()
  const chessAccounts = getChessAccountFromUser(user)
  const chessAccountIds = chessAccounts.map((account) => account.id)
  const countGamePerDay = await getCountGamesPerDay(chessAccountIds)

  const maxCount = Math.max(
    ...countGamePerDay.map((entry) => Number(entry.count))
  )

  const level = (count: number) => {
    if (count === 0) return 1
    if (count < maxCount / 4) return 2
    if (count < maxCount / 2) return 3
    return 4
  }

  const getDate = (date: Date) => {
    return String(date.toISOString()).slice(0, 10)
  }

  const activityData = countGamePerDay.map((entry) => ({
    date: String(getDate(entry.date)),
    count: Number(entry.count),
    level: level(Number(entry.count))
  }))

  const today = new Date()
  const firstDay = new Date()
  firstDay.setDate(today.getDate() - NUM_DAYS)

  const findFirstDay = activityData.find(
    (entry) => entry.date === getDate(firstDay)
  )

  if (!findFirstDay) {
    activityData.unshift({
      date: getDate(firstDay),
      count: 0,
      level: 0
    })
  }

  const findToday = activityData.find(
    (entry) => entry.date === getDate(today)
  )

  if (!findToday) {
    activityData.push({
      date: getDate(today),
      count: 0,
      level: 0
    })
  }

  return (
    <MotionCard
      className={cn(
        'w-full h-full bg-foreground xl:col-span-12 p-2 text-white rounded-none border-none'
      )}
    >
      <CardHeader>
        <CardTitle className='flex w-full text-4xl justify-between items-center'>
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StatsCharts activityData={activityData} />
      </CardContent>
    </MotionCard>
  )
}
