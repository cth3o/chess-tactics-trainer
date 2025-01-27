/*
  Warnings:

  - Added the required column `moveTime` to the `GameAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameAnalysis" ADD COLUMN     "moveTime" INTEGER NOT NULL;
