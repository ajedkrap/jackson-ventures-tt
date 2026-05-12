import { client } from './client'

import type { IOrder, IOrderCreatePayload } from '@/models/order'

export const createOrder = async (payload: IOrderCreatePayload): Promise<IOrder> => {
  const { data } = await client.post<IOrder>('/orders', payload)
  return data
}

export const getOrder = async (orderId: string): Promise<IOrder> => {
  const { data } = await client.get<IOrder>(`/orders/${orderId}`)
  return data
}
