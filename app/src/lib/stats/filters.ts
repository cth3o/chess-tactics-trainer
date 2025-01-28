'use server'
import {
  ChessAccount,
  GameCategory
} from '@prisma/client'

export type GameFilters = {
  providers: string[]
  tags: string[]
  categories: string[]
  winner: string[]
  analysed: string[]
  adversary: string[]
}

export const convertFiltersToWhere = async (
  chessAccounts: ChessAccount[],
  filters: GameFilters
) => {
  const filteredChessAccounts = chessAccounts.filter((account) => {
    return (
      filters.providers.length === 0 ||
      filters.providers.includes(account.provider)
    )
  })

  const whereConditions = [
    {
      OR: [
        ...filteredChessAccounts.map((account) => {
          return { whiteChessAccountId: account.id }
        }),
        ...filteredChessAccounts.map((account) => {
          return { blackChessAccountId: account.id }
        }),
      ],
    },
  ] as any[]

  if (filters.categories.length > 0) {
    whereConditions.push({
      category: {
        in: filters.categories as GameCategory[],
      },
    })
  }

  if (filters.winner.length > 0) {
    whereConditions.push({
      OR: [
        ...filters.winner.map((winner) => {
          if (winner === 'draw') {
            return { winner: 'draw' }
          } else if (winner === 'win') {
            return {
              OR: [
                {
                  winner: 'white',
                  whiteChessAccountId: {
                    in: chessAccounts.map((account) => account.id),
                  },
                },
                {
                  winner: 'black',
                  blackChessAccountId: {
                    in: chessAccounts.map((account) => account.id),
                  },
                },
              ],
            }
          }
          return {
            OR: [
              {
                winner: 'white',
                blackChessAccountId: {
                  in: chessAccounts.map((account) => account.id),
                },
              },
              {
                winner: 'black',
                whiteChessAccountId: {
                  in: chessAccounts.map((account) => account.id),
                },
              },
            ],
          }
        }),
      ],
    })
  }

  if (filters.tags.length > 0) {
    whereConditions.push({
      status: {
        in: filters.tags,
      },
    })
  }

  if (filters.adversary.length > 0) {
    whereConditions.push({
      OR: [
        {
          whitePlayer: {
            in: filters.adversary,
          }
        },
        {
          blackPlayer: {
            in: filters.adversary,
          }
        }
      ]
    })
  }

  return whereConditions
}
