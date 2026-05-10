export type TRootStackParamList = {
  AppStack: undefined
}

export type TAppStackParamList = {
  Scanner: undefined
  Menu: { tableId: string }
  ItemDetail: { itemId: number }
  Cart: undefined
  OrderConfirmation: { orderId: string }
  OrderTracking: { orderId: string }
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TRootStackParamList {}
    interface RootParamList extends TAppStackParamList {}
  }
}
