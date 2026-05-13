import type { TSelection } from './customization'

import type { ICartLine } from '@/models/cart'
import type { ICustomizationGroup, IMenuItem } from '@/models/menu'
import type { IOrderCreatePayload } from '@/models/order'

export const computeSignature = (menuItemId: number, optionIds: number[]): string => {
  const sorted = [...optionIds].sort((a, b) => a - b)
  return `${menuItemId}#${sorted.join(',')}`
}

export const buildCartLine = (
  item: IMenuItem,
  selection: TSelection,
  quantity: number
): ICartLine => {
  const selectedOptions = item.customization_groups.flatMap((group: ICustomizationGroup) => {
    const ids = selection[group.id] ?? []
    return group.options
      .filter((o) => ids.includes(o.id))
      .map((o) => ({
        optionId: o.id,
        name: o.name,
        priceModifier: o.price_modifier,
      }))
  })
  return {
    signature: computeSignature(
      item.id,
      selectedOptions.map((o) => o.optionId)
    ),
    menuItemId: item.id,
    name: item.name,
    basePrice: item.price,
    quantity,
    selectedOptions,
  }
}

export const lineSubtotal = (line: ICartLine): number => {
  const modSum = line.selectedOptions.reduce((acc, o) => acc + o.priceModifier, 0)
  return (line.basePrice + modSum) * line.quantity
}

export const cartSubtotal = (lines: ICartLine[]): number =>
  lines.reduce((acc, l) => acc + lineSubtotal(l), 0)

export const cartItemCount = (lines: ICartLine[]): number =>
  lines.reduce((acc, l) => acc + l.quantity, 0)

export const buildOrderPayload = (
  tableId: string,
  lines: ICartLine[],
  customerNote: string
): IOrderCreatePayload => ({
  table_id: tableId,
  items: lines.map((l) => ({
    menu_item_id: l.menuItemId,
    quantity: l.quantity,
    customizations: l.selectedOptions.map((o) => ({
      option_id: o.optionId,
      quantity: 1,
    })),
  })),
  customer_note: customerNote,
})
