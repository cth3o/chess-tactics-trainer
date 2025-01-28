import { z } from "zod";

export const analysisParamsSchema = z.object({
    gameId: z.string(),
    engine: z.enum(['stockfish']).optional().default('stockfish'),
    forceAnalysis: z.boolean().optional().default(false),
    depth: z.number().optional().default(15),
    movetime: z.number().optional().default(300),
    multipv: z.number().optional().default(1),
    skillLevel: z.number().optional().default(20),
    threads: z.number().optional().default(1),
    hash: z.number().optional().default(256)
});

export type AnalysisParams = z.infer<typeof analysisParamsSchema>;