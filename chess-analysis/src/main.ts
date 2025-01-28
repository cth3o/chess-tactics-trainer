import { Engine, SearchResult } from "node-uci";
import { Chess, Move } from "chess.js";
import prisma from "./prisma";
import { Game, Quality } from "@prisma/client";
import { AnalysisParams } from "./schemas/analysisParams";
import { START_FEN } from "./lib/chess";

const getMoveQuality = async (
  before: { value: number; unit: string },
  after: { value: number; unit: string }
): Promise<Quality> => {
  const val = after.value * -1;

  const deltaCentipawnsThresholds: { threshold: number; label: Quality }[] = [
    { threshold: 0, label: "excellent" },
    { threshold: 70, label: "good" },
    { threshold: 150, label: "inaccuracy" },
    { threshold: 300, label: "mistake" },
  ];

  if (before.unit == "cp" && after.unit == "cp") {
    for (const category of deltaCentipawnsThresholds) {
      if (before.value < val + category.threshold) {
        return category.label;
      }
    }
  } else if (before.unit == "mate" && after.unit == "mate") {
    if (val < before.value) {
      return "good";
    }
    return "inaccuracy";
  }
  return "blunder";
};

const getBestLine = (data: any[]) => {
  data.sort((a, b) => {
    if (a.score.unit != "cp" && b.score.unit != "cp") {
      if (a.score.value >= 0 && b.score.value >= 0)
        return (a.score.value - b.score.value) * -1;
      if (a.score.value >= 0) return 1;
      if (b.score.value >= 0) return -1;
      return (a.score.value - b.score.value) * -1;
    }
    if (a.score.unit != "cp" && b.score.unit == "cp") {
      if (a.score.value >= 0) return 1;
      return -1;
    }
    if (a.score.unit == "cp" && b.score.unit != "cp") {
      if (b.score.value >= 0) return -1;
      return 1;
    }
    return a.score.value - b.score.value;
  });
  data.reverse();
  return data[0];
};

const getMoveAnalysis = async (
  engine: Engine,
  position: string,
  depth: number,
  movetime: number
) => {
  await engine.position(position);
  const result = await engine.go({ depth, movetime });
  if (result.bestmove == "(none)") {
    return undefined;
  }

  return getBestLine(result.info.slice((depth - 1) * -1));
};

const initEngine = async (params: AnalysisParams): Promise<Engine> => {
  const engine = new Engine(`bin/${params.engine}`);
  await engine.init();
  await engine.setoption("MultiPV", `${params.multipv}`);
  await engine.setoption("Skill Level", `${params.skillLevel}`);
  await engine.setoption("Threads", `${params.threads}`);
  await engine.setoption("Hash", `${params.hash}`);
  return engine;
};

const getGameHistory = (game: Game): Move[] => {
  const board = new Chess();
  board.loadPgn(game.pgn);
  return board.history({ verbose: true });
};

const getSanPV = (fen: string, pv: string): string => {
  const board = new Chess(fen);
  const moves = pv.split(" ");
  const sanMoves = moves.map((move) => {
    const moveObj = board.move(move);
    return moveObj ? moveObj.san : "";
  });
  return sanMoves.join(" ");
};

export const chessAnalysis = async (game: Game, params: AnalysisParams) => {

  const previousGameAnalysis = await prisma.gameAnalysis.findUnique(
    { where: { gameId: game.id } }
  )

  if (previousGameAnalysis && !params.forceAnalysis) {
    console.log(`Game ${game.id} already analyzed`);
    return;
  }

  const engine = await initEngine(params);
  const history = getGameHistory(game);
  const board = new Chess();

  const scores: string[] = [];
  const movesQuality: Quality[] = [];
  const variants: string[] = [];

  console.log(`Starting analyis of game ${game.id}`);

  let previousMoveAnalysis = await getMoveAnalysis(
    engine,
    START_FEN,
    params.depth,
    params.movetime
  );
  let isWhiteTurn = true;

  for (let move of history) {
    board.move(move.san);

    const currentMoveAnalysis = await getMoveAnalysis(
      engine,
      board.fen(),
      params.depth,
      params.movetime
    );

    if (!currentMoveAnalysis) {
      break
    }

    const moveQuality = await getMoveQuality(
      previousMoveAnalysis.score,
      currentMoveAnalysis.score
    );

    const scoreUnit = currentMoveAnalysis.score.unit;
    const scoreValue = currentMoveAnalysis.score.value * (isWhiteTurn && scoreUnit != 'mate' ? 1 : -1);

    scores.push(`${scoreValue} ${scoreUnit}`);
    movesQuality.push(moveQuality);
    variants.push(getSanPV(board.fen(), currentMoveAnalysis.pv));

    previousMoveAnalysis = currentMoveAnalysis;

    isWhiteTurn = !isWhiteTurn;
  }


  const currentDate = new Date();
  await prisma.gameAnalysis.upsert({
    where: { gameId: game.id },
    update: {
      date: currentDate,
      scores: scores,
      movesQuality: movesQuality,
      variants: variants, 
      engine: params.engine,
      depth: params.depth,
      multipv: params.multipv,
      skillLevel: params.skillLevel,
      moveTime: params.movetime,
      threads: params.threads,
    },
    create: {
      gameId: game.id,
      date: currentDate,
      scores: scores,
      movesQuality: movesQuality,
      variants: variants,
      engine: params.engine,
      depth: params.depth,
      multipv: params.multipv,
      skillLevel: params.skillLevel,
      moveTime: params.movetime,
      threads: params.threads,
    },
  });

  await engine.quit();
};
