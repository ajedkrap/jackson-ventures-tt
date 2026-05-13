export interface IOrderItemCustomization {
  option_id: number
  quantity: number
}

export interface IOrderItemPayload {
  menu_item_id: number
  quantity: number
  customizations: IOrderItemCustomization[]
}

export interface IOrderCreatePayload {
  table_id: string
  items: IOrderItemPayload[]
  customer_note: string
}

export type IOrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served'

export interface IOrder {
  id: string
  table_id: string
  items: IOrderItemPayload[]
  customer_note: string
  status: IOrderStatus
  estimated_minutes?: number
  created_at: string
}
