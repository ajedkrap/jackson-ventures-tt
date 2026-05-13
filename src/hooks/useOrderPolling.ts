import { useCallback, useEffect, useState } from 'react'

import { getOrder, AppError, normalizeError } from '@/api'
import type { IOrder, IOrderStatus } from '@/models/order'

const POLL_INTERVAL_MS = 5000
const MAX_CONSECUTIVE_ERRORS = 3
const TERMINAL_STATUSES: readonly IOrderStatus[] = ['served']

export interface OrderPollingState {
  order: IOrder | null
  loading: boolean
  error: AppError | null
  retry: () => void
}

export const useOrderPolling = (orderId: string): OrderPollingState => {
  const [order, setOrder] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)
  const [retryToken, setRetryToken] = useState(0)

  const retry = useCallback(() => setRetryToken((n) => n + 1), [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    let cancelled = false
    let consecutiveErrors = 0

    setLoading(true)
    setError(null)

    const tick = async () => {
      try {
        const next = await getOrder(orderId)
        if (cancelled) return
        consecutiveErrors = 0
        setOrder(next)
        setError(null)
        setLoading(false)

        if (TERMINAL_STATUSES.includes(next.status)) {
          return
        }
      } catch (err) {
        if (cancelled) return
        consecutiveErrors += 1
        setError(normalizeError(err))
        setLoading(false)
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          return
        }
      }
      if (!cancelled) {
        timer = setTimeout(tick, POLL_INTERVAL_MS)
      }
    }

    tick()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [orderId, retryToken])

  return { order, loading, error, retry }
}
