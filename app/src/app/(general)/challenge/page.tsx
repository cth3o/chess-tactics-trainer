import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MotionCard } from '@/components/ui/motion-card'
import {
  checkServerSessionOrRedirect,
  getChessAccountFromUser
} from '@/lib/authentication'
import { cn } from '@/lib/utils'
import { ChallengeBadge } from '@/components/challenge/challenge-badge'
import { OPENING_CHALLENGES } from './challenges'
import { getWinByOpening } from '@/lib/stats/opening'

export default async function StatsPage() {
  const user = await checkServerSessionOrRedirect()
  const chessAccounts = getChessAccountFromUser(user)

  const openings = await getWinByOpening(chessAccounts)

  const getTotalGamesFromOpening = (commonOpening: string) => {
    return openings
      .filter((opening: { opening: string }) =>
        opening.opening.toLowerCase().includes(commonOpening)
      )
      .reduce((acc: any, curr: { _count: { _all: any } }) => acc + curr._count._all, 0)
  }

  const openingChallenges = OPENING_CHALLENGES.map((challenge) => ({
    name: challenge.name,
    progress: getTotalGamesFromOpening(challenge.label),
    total: challenge.total
  }))

  return (
    <MotionCard
      className={cn(
        'col-span-12 bg-foreground xl:col-span-6 p-2 text-white rounded-none border-none'
      )}
    >
      <CardHeader>
        <CardTitle className='flex w-full text-4xl justify-between items-center'>
          Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type='single' collapsible defaultValue='item-1'>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='pl-4'>Openings</AccordionTrigger>
            <AccordionContent>
              <div
                className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6
                 gap-8 lg:w-4/5 mx-auto justify-center align-baseline m-6`}
              >
                {openingChallenges.map((challenge, index) => (
                  <ChallengeBadge
                    key={index}
                    name={challenge.name}
                    progress={challenge.progress}
                    total={challenge.total}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </MotionCard>
  )
}
