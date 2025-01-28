'use server'

import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { nextAuthConfig } from '@/pages/api/auth/[...nextauth]'
import { isEmpty, isNil } from 'lodash'
import prisma, { UserWithAccounts } from '@/lib/database'
import { createChesscomTask, createLichessSynchonizerTask } from './cloudtask'
import { ChessAccount } from '@prisma/client'

export const checkServerSessionOrRedirect = async (checkSetup: boolean = true): Promise<UserWithAccounts | null> => {
    const session = await getServerSession(nextAuthConfig)

    if (!session || isNil(session?.user?.email)) {
        return redirect('/signin')
    }

    const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          chessAccounts: {
            include: {
              chessAccount: true,
            },
          },
        },
      })

    if (!user) {
        return redirect('/signin')
    }

    if (isEmpty(user.chessAccounts) && checkSetup) {
        return redirect('/setup')
    }
    
    // Trigger chess account synchronization if last fetch is older than 5 minutes
    user.chessAccounts.forEach((account) => {
        if (isNil(account.chessAccount.lastFetch) || 
          (new Date().getTime() - account.chessAccount.lastFetch.getTime()) > 5 * 60 * 1000) {
            if (account.chessAccount.provider === 'lichess') {
                createLichessSynchonizerTask(account.chessAccount.id)
            } else if (account.chessAccount.provider === 'chesscom') {
                createChesscomTask(account.chessAccount.id)
            }
        }
    })
    
    return user
}

export const checkNotAuthenticatedOrRedirect = async () => {
    const session = await getServerSession(nextAuthConfig)
    if (session && session?.user?.email) {
       redirect('/')
    }
}

export const getChessAccountFromUser = (user: UserWithAccounts | null): ChessAccount[] => {
  return user?.chessAccounts.map((account) => account.chessAccount) || []
}

export const fetchChessAccounts = async (user: UserWithAccounts) => {
  const accounts = await prisma.chessAccount.findMany({
    where: {
      users: {
        some: {
          user: { email: user.email }
        }
      }
    }
  })
  return accounts
}