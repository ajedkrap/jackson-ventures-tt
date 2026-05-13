import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { ICartLine } from '@/models/cart'

interface ICartState {
  lines: ICartLine[]
  customerNote: string
  addLine: (line: ICartLine) => void
  updateQuantity: (signature: string, quantity: number) => void
  removeLine: (signature: string) => void
  setCustomerNote: (note: string) => void
  clear: () => void
}

const initialState: ICartState = {
  lines: [],
  customerNote: '',
  addLine: () => {},
  updateQuantity: () => {},
  removeLine: () => {},
  setCustomerNote: () => {},
  clear: () => {},
}

export const useCartStore = create<ICartState>()(
  persist(
    (set) => ({
      ...initialState,
      addLine: (line) =>
        set((state) => {
          const existingIdx = state.lines.findIndex((l) => l.signature === line.signature)
          if (existingIdx >= 0) {
            const next = [...state.lines]
            next[existingIdx] = {
              ...next[existingIdx],
              quantity: next[existingIdx].quantity + line.quantity,
            }
            return { lines: next }
          }
          return { lines: [...state.lines, line] }
        }),
      updateQuantity: (signature, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.signature !== signature)
              : state.lines.map((l) => (l.signature === signature ? { ...l, quantity } : l)),
        })),
      removeLine: (signature) =>
        set((state) => ({ lines: state.lines.filter((l) => l.signature !== signature) })),
      setCustomerNote: (note) => set({ customerNote: note }),
      clear: () => set({ lines: [], customerNote: '' }),
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
