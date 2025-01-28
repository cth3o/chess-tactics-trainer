/*
  Warnings:

  - You are about to drop the column `centipawns` on the `GameAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `quality` on the `GameAnalysis` table. All the data in the column will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gameId]` on the table `GameAnalysis` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_analysisId_fkey";

-- AlterTable
ALTER TABLE "GameAnalysis" DROP COLUMN "centipawns",
DROP COLUMN "quality",
ADD COLUMN     "movesQuality" "Quality"[],
ADD COLUMN     "scores" TEXT[],
ADD COLUMN     "variants" TEXT[];

-- DropTable
DROP TABLE "Variant";

-- CreateIndex
CREATE UNIQUE INDEX "GameAnalysis_gameId_key" ON "GameAnalysis"("gameId");
