import prisma from '@/lib/database'

export const getAnalysisFromGame = async (gameId: string) => {
  const gameAnalysis = await prisma.gameAnalysis.findUnique({
    where: { gameId },
  })
  return gameAnalysis
}
