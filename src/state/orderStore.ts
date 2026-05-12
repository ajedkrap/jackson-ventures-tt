import { create } from 'zustand'

import { createOrder, AppError, normalizeError } from '@/api'
import type { IOrder, IOrderCreatePayload } from '@/models/order'

interface IOrderState {
  submitting: boolean
  submitError: AppError | null
  submit: (payload: IOrderCreatePayload) => Promise<IOrder | null>
  reset: () => void
}

const initialState: IOrderState = {
  submitting: false,
  submitError: null,
  submit: async () => null,
  reset: () => {},
}

export const useOrderStore = create<IOrderState>((set) => ({
  ...initialState,
  submit: async (payload) => {
    set({ submitting: true, submitError: null })
    try {
      const order = await createOrder(payload)
      return order
    } catch (err) {
      set({ submitError: normalizeError(err) })
      return null
    } finally {
      set({ submitting: false })
    }
  },
  reset: () => set(initialState),
}))
