'use server'

import { fetchChessAccounts } from '@/lib/authentication'
import { UserWithAccounts } from '@/lib/database'
import { revalidatePath } from 'next/cache'

export const infosHasChanged = async (user: UserWithAccounts) => {
  if (!user) {
    return
  }

  const accounts = await fetchChessAccounts(user)

  const hasChanged = user.chessAccounts.some((currentAccount) =>
    accounts.some(
      (account) =>
        account.id === currentAccount.chessAccount.id &&
        (account.isFetching !== currentAccount.chessAccount.isFetching ||
          account.lastFetch?.toUTCString() !==
            currentAccount.chessAccount.lastFetch?.toUTCString())
    )
  )

  if (hasChanged) {
    revalidatePath('/profile')
  }
}
