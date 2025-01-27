import { Prisma } from '@prisma/client'
import prisma from '../database'

export const getCountGamesPerDay = async (chessAccountIds: string[]) => {
  const countGamePerDay = (await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('day', "date") as "date",
      COUNT(*) as "count"
    FROM "Game"
    WHERE ("whiteChessAccountId" IN (${Prisma.join(chessAccountIds)})
      OR "blackChessAccountId" IN (${Prisma.join(chessAccountIds)})
    ) 
    AND "date" >= NOW() - INTERVAL '365 days'
    GROUP BY DATE_TRUNC('day', "date")
    ORDER BY DATE_TRUNC('day', "date") ASC;
  `) as { date: Date; count: number }[]
  return countGamePerDay
}