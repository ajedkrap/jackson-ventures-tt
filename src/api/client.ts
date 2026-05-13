import { create } from 'axios'

import { normalizeError } from './errors'

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

if (!BASE_URL) {
  console.warn('[api] EXPO_PUBLIC_API_BASE_URL is not set — requests will fail')
}

export const client = create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error))
)
