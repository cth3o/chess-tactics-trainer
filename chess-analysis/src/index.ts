import "dotenv/config";

import { z } from "zod";
import { Request, Response } from "express";

import { chessAnalysis } from "./main";
import prisma from "./prisma";
import { AnalysisParams, analysisParamsSchema } from "./schemas/analysisParams";

export const chessAnalysisFunction = async (req: Request, res: Response) => {
  try {
    const params = analysisParamsSchema.parse(req.body);

    const game = await prisma.game.findUnique({
      where: { id: params.gameId }
    });

    if (!game) {
      return res.status(404).send("The game does not exist");
    }

    await prisma.game.update({
      where: { id: params.gameId },
      data: { analysing: true }
    });

    await chessAnalysis(game, params);

    await prisma.game.update({
      where: { id: params.gameId },
      data: { analysing: false }
    });

    res.status(200).send(`The game ${params.gameId} was analyzed successfully`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid request",
        errors: error.errors,
      });
    }
    res.status(500).send(`Unexpected error: ${error}`);
  }
};

// TEST CODE
// const GAME_ID = "122374127732";
// const main = async () => {
//   const game = await prisma.game.findUnique({
//     where: { id: GAME_ID },
//   });

//   if (!game) {
//     return;
//   }
//   console.log(game);

  
//   const params: AnalysisParams = {
//     gameId: GAME_ID,
//     engine: "stockfish",
//     forceAnalysis: true,
//     depth: 15,
//     movetime: 300,
//     multipv: 1,
//     skillLevel: 20,
//     threads: 1,
//     hash: 256,
//   };

//   await prisma.game.update({
//     where: { id: params.gameId },
//     data: { analysing: true }
//   });

//   await chessAnalysis(game, params);

//   await prisma.game.update({
//     where: { id: params.gameId },
//     data: { analysing: false }
//   });
//   console.log("ok");
// };
// main();
