import { ChessAccount, Prisma } from '@prisma/client'
import prisma from '../database'

export type GameWithAnalysis = Prisma.GameGetPayload<{
  include: { analysis: true };
}>;

export const getGamesFromAccounts = async (
  chessAccounts: ChessAccount[],
  gamesPerPage?: number,
  pageNumber?: number
) => {
  const skip =
    gamesPerPage !== undefined && pageNumber !== undefined
      ? (pageNumber - 1) * gamesPerPage
      : undefined
  const games = await prisma.game.findMany({
    where: {
      OR: [
        ...chessAccounts.map((account) => {
          return { whiteChessAccountId: account.id }
        }),
        ...chessAccounts.map((account) => {
          return { blackChessAccountId: account.id }
        }),
      ],
    },
    include: {
      analysis: true,
    },
    orderBy: {
      date: 'desc',
    },
    skip,
    take: gamesPerPage ?? 25,
  })
  return games
}

export const getGamesCount = async (chessAccounts: ChessAccount[]) => {
  const totalGames = await prisma.game.count({
    where: {
      OR: [
        ...chessAccounts.map((account) => {
          return { whiteChessAccountId: account.id }
        }),
        ...chessAccounts.map((account) => {
          return { blackChessAccountId: account.id }
        }),
      ],
    },
  })
  return totalGames
}
