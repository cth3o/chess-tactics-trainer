import { GameWithAnalysis } from '@/lib/games/games'
import { GameFilters } from '@/lib/stats/filters'
import { create } from 'zustand'

type GameStore = {
    game: GameWithAnalysis | null
    activeMove: number
    filters: GameFilters
    // eslint-disable-next-line no-unused-vars
    setGame: (_: GameWithAnalysis | null) => void
    // eslint-disable-next-line no-unused-vars
    setActiveMove: (_: number) => void
    // eslint-disable-next-line no-unused-vars
    setFilters: (_: GameFilters) => void
  }

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  setGame: (game: GameWithAnalysis | null) => set({ game }),
  setActiveMove: (activeMove: number) => set({ activeMove }),
  activeMove: 0,
  filters: {
    providers: [],
    tags: [],
    winner: [],
    categories: [],
    analysed: [],
    adversary: []
  },
  setFilters: (filters: GameFilters) => set({ filters })
}))