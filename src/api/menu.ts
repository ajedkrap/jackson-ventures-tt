import { client } from './client'
import { AppError } from './errors'

import type { IMenuResponse } from '@/models/menu'

export const getMenu = async (tableId: string): Promise<IMenuResponse> => {
  const response = await client.get<IMenuResponse[]>('/menu', {
    params: { table_id: tableId },
  })
  if (response.data.length === 0) {
    throw new AppError('client', `No menu found for table ${tableId}.`, 404)
  }
  return response.data[0]
}
