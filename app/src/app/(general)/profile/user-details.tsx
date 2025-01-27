'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { LogoutButton } from '@/components/auth/logout-button'
import { Button } from '@/components/ui/button'
import { UserWithAccounts } from '@/lib/database'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { infosHasChanged } from './check-change'
import { useInterval } from 'usehooks-ts'
import {
  createChesscomTask,
  createLichessSynchonizerTask
} from '@/lib/cloudtask'
import { getBottNeutral } from '@/lib/dicebear'

interface UserProps {
  user: UserWithAccounts
}

const MotionCard = motion(Card)

const PROFIL_POLLING_INTERVAL = 1000

export const UserDetails = ({ user }: UserProps) => {

  const getAccountByType = (type: string) => {
    return user.chessAccounts.find(
      (account) => account.chessAccount.provider === type
    )?.chessAccount
  }

  const lichessAccount = getAccountByType('lichess')
  const chesscomAccount = getAccountByType('chesscom')

  useInterval(() => {
    infosHasChanged(user)
  }, PROFIL_POLLING_INTERVAL)

  return (
    <>
      <MotionCard
        className={cn(
          'text-white bg-foreground border-l-4 border-r-0',
          'border-t-0 border-b-0 border-active rounded-none col-span-12 size-full'
        )}
        animate={{ x: 0, opacity: 1 }}
        initial={{ x: -50, opacity: 0 }}
      >
        <CardHeader>
          <CardTitle className='flex w-full text-4xl justify-between items-center'>
            Settings
          </CardTitle>
          <CardDescription>
            <div className='flex flex-row align-baseline gap-2 mt-4'>
              <Avatar>
                <AvatarImage src={getBottNeutral(user.email ?? 'unknown')} />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              <div>
                {user.name}
                <br />
                <i className='text-sm'>{user.email}</i>
                <div className='mt-4 ml-8'><LogoutButton /></div>
              </div>
            </div>
            <div className='flex w-full flex-col lg:flex-row'>
              <div className='grid h-32 grow place-items-center'>
                {lichessAccount && (
                  <>
                    <span>
                      <Text as='h4'>{`Lichess.org: ${lichessAccount.username}`}</Text>
                      <i
                        suppressHydrationWarning
                        className='flex gap-1 justify-center'
                      >
                        <div>Last update:</div>
                        <div>
                          {lichessAccount.isFetching ? (
                            <Loader2 className='ml-1 size-4 animate-spin' />
                          ) : (
                            lichessAccount?.lastFetch?.toLocaleString() ??
                            'Never fetched'
                          )}
                        </div>
                      </i>
                    </span>
                    <Button
                      disabled={lichessAccount?.isFetching}
                      onClick={async () => {
                        await createLichessSynchonizerTask(
                          lichessAccount?.id ?? ''
                        )
                        toast.success(
                          'Synchronization with lichess.org started'
                        )
                      }}
                    >
                      Refresh Lichess account
                    </Button>
                  </>
                )}
              </div>
              <div className='grid h-32 grow place-items-center'>
                {chesscomAccount && (
                  <>
                    <span>
                      <Text as='h4'>{`Chess.com: ${chesscomAccount.username}`}</Text>
                      <i
                        suppressHydrationWarning
                        className='flex gap-1 justify-center'
                      >
                        <div>Last update:</div>
                        <div>
                          {chesscomAccount.isFetching ? (
                            <Loader2 className='ml-1 size-4 animate-spin' />
                          ) : (
                            chesscomAccount?.lastFetch?.toLocaleString() ??
                            'Never fetched'
                          )}
                        </div>
                      </i>
                    </span>

                    <Button
                      disabled={chesscomAccount?.isFetching}
                      onClick={async () => {
                        await createChesscomTask(chesscomAccount?.id ?? '')
                        toast.success('Synchronization with chess.com started')
                      }}
                    >
                      Refresh Chess Account
                    </Button>
                  </>
                )}
              </div>
            </div>
             
          </CardDescription>
        </CardHeader>
      </MotionCard>
    </>
  )
}
