import { ChessAccount } from '@prisma/client'
import prisma from '../database'

export const getWinByOpening = async (chessAccounts: ChessAccount[]) => {
  const openings = await prisma.game.groupBy({
    _count: {
      _all: true,
    },
    where: {
      OR: [
        {
          AND: [
            {
              whiteChessAccountId: {
                in: chessAccounts.map((account) => account.id),
              },
            },
            { winner: 'white' },
          ],
        },
        {
          AND: [
            {
              blackChessAccountId: {
                in: chessAccounts.map((account) => account.id),
              },
            },
            { winner: 'black' },
          ],
        },
      ],
    },
    by: ['opening'],
  })
  
  return openings
}
