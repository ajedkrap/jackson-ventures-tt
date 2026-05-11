import { client } from './client'
import { AppError } from './errors'

import type { MenuResponse } from '@/models/menu'

export const getMenu = async (tableId: string): Promise<MenuResponse> => {
  const { data } = await client.get<MenuResponse[]>('/menu', {
    params: { table_id: tableId },
  })
  if (data.length === 0) {
    throw new AppError('client', `No menu found for table ${tableId}.`, 404)
  }
  return data[0]
}
