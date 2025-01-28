'use server'

import { ChessAccount } from '@prisma/client'
import prisma from '../database'
import { convertFiltersToWhere, GameFilters } from './filters'

export const countTotalGames = async (
  chessAccounts: ChessAccount[],
  filters: GameFilters
): Promise<number> => {
  const totalGamesCount = await prisma.game.count({
    where: {
      AND: await convertFiltersToWhere(chessAccounts, filters),
    },
  })
  return totalGamesCount
}

export const getFilteredGames = async (
  chessAccounts: ChessAccount[],
  filters: GameFilters,
  limit?: number,
  offset?: number
) => {
  const games = await prisma.game.findMany({
    include: {
      analysis: true,
    },
    where: {
      AND: await convertFiltersToWhere(chessAccounts, filters),
    },
    orderBy: {
      date: 'desc',
    },
    take: limit,
    skip: offset,
  })

  return games
}

export const getGamesLastSixMonths = async (
  chessAccounts: ChessAccount[],
  filters: GameFilters
) => {
  const results = []

  const currentDate = new Date()

  for (let i = 0; i < 12; i += 1) {
    const month = currentDate.getMonth() - i
    const year = currentDate.getFullYear()

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const gamesCount = await prisma.game.count({
      where: {
        AND: await convertFiltersToWhere(chessAccounts, filters),
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    results.push({
      month: startDate.toLocaleString('default', { month: 'short' }),
      games: gamesCount,
    })
  }

  return results.reverse()
}

export const getWinPercentageLastSixMonths = async (
  chessAccounts: ChessAccount[],
  filters: GameFilters
) => {
  const results = []
  const currentDate = new Date()

  for (let i = 0; i < 12; i += 1) {
    const month = currentDate.getMonth() - i
    const year = currentDate.getFullYear()
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const winCount = await prisma.game.count({
      where: {
        AND: [
          ...(await convertFiltersToWhere(chessAccounts, filters)),
          {
            OR: [
              {
                whiteChessAccountId: {
                  in: chessAccounts.map((account) => account.id),
                },
                winner: 'white',
              },
              {
                blackChessAccountId: {
                  in: chessAccounts.map((account) => account.id),
                },
                winner: 'black',
              },
            ],
          },
        ],
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const totalCount = await prisma.game.count({
      where: {
        AND: [
          ...(await convertFiltersToWhere(chessAccounts, filters)),
          {
            OR: [
              {
                whiteChessAccountId: {
                  in: chessAccounts.map((account) => account.id),
                },
              },
              {
                blackChessAccountId: {
                  in: chessAccounts.map((account) => account.id),
                },
              },
            ],
          },
        ],
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const winPercentage = totalCount > 0 ? (winCount / totalCount) * 100 : 0

    results.push({
      month: startDate.toLocaleString('default', { month: 'short' }),
      precision: Number(winPercentage.toFixed(2)),
    })
  }

  return results.reverse()
}

export const getWinPercentageAverage = async (chessAccounts: ChessAccount[], selectedFilters: GameFilters) => {
  const totalGames = await countTotalGames(chessAccounts, selectedFilters)
  const totalWins = await prisma.game.count({
    where: {
      AND: [
        ...(await convertFiltersToWhere(chessAccounts, selectedFilters)),
        {
          OR: [
            {
              whiteChessAccountId: {
                in: chessAccounts.map((account) => account.id),
              },
              winner: 'white',
            },
            {
              blackChessAccountId: {
                in: chessAccounts.map((account) => account.id),
              },
              winner: 'black',
            },
          ],
        },
      ],
    },
  })
  const average = totalGames > 0 ? (totalWins / totalGames) * 100 : 0
  return Number(average.toFixed(2))
}
