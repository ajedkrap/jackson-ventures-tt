export interface ICartLineOption {
  optionId: number
  name: string
  priceModifier: number
}

export interface ICartLine {
  signature: string // dedupe key + React key
  menuItemId: number
  name: string
  basePrice: number
  quantity: number
  selectedOptions: ICartLineOption[]
}
