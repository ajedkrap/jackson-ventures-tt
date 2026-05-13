import { AxiosError } from 'axios'

export type AppErrorKind = 'network' | 'timeout' | 'client' | 'server' | 'unknown'

export class AppError extends Error {
  kind: AppErrorKind
  status?: number

  constructor(kind: AppErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'AppError'
    this.kind = kind
    this.status = status
  }
}

export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) return error

  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') {
      return new AppError('timeout', 'Request took too long. Please try again.')
    }
    if (!error.response) {
      return new AppError('network', "Couldn't reach the server. Check your connection.")
    }
    const status = error.response.status
    const apiMessage = extractApiMessage(error.response.data)
    if (status >= 400 && status < 500) {
      return new AppError('client', apiMessage ?? 'Request was rejected by the server.', status)
    }
    if (status >= 500) {
      return new AppError('server', apiMessage ?? 'Server error. Please try again.', status)
    }
  }

  if (error instanceof Error) {
    return new AppError('unknown', error.message)
  }
  return new AppError('unknown', 'Something went wrong.')
}

const extractApiMessage = (data: unknown): string | null => {
  if (typeof data === 'string') return data
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>
    if (typeof obj.message === 'string') return obj.message
    if (typeof obj.error === 'string') return obj.error
  }
  return null
}
