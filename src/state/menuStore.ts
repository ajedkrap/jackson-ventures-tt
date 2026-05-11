import { create } from 'zustand'

import { getMenu, AppError, normalizeError } from '@/api'
import type { MenuResponse } from '@/models/menu'

interface MenuState {
  menu: MenuResponse | null
  tableId: string | null
  loading: boolean
  error: AppError | null
  fetchMenu: (tableId: string) => Promise<void>
  reset: () => void
}

const initialState = {
  menu: null,
  tableId: null,
  loading: false,
  error: null,
}

export const useMenuStore = create<MenuState>((set, get) => ({
  ...initialState,
  fetchMenu: async (tableId) => {
    if (get().menu && get().tableId === tableId) return
    set({ loading: true, error: null, tableId })
    try {
      const menu = await getMenu(tableId)
      set({ menu, loading: false })
    } catch (err) {
      set({ error: normalizeError(err), loading: false })
    }
  },
  reset: () => set(initialState),
}))
