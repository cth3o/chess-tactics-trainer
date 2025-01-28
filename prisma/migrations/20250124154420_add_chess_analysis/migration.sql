-- CreateEnum
CREATE TYPE "Quality" AS ENUM ('excellent', 'good', 'inaccuracy', 'mistake', 'blunder');

-- CreateEnum
CREATE TYPE "Engine" AS ENUM ('stockfish');

-- CreateTable
CREATE TABLE "GameAnalysis" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "centipawns" INTEGER[],
    "quality" "Quality"[],
    "engine" "Engine" NOT NULL,
    "depth" INTEGER NOT NULL,
    "multipv" INTEGER NOT NULL,
    "skillLevel" INTEGER NOT NULL,
    "threads" INTEGER NOT NULL,

    CONSTRAINT "GameAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "moves" TEXT[],

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameAnalysis" ADD CONSTRAINT "GameAnalysis_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "GameAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
