import type { ICartLine } from '@/models/cart'
import type { IMenuItem } from '@/models/menu'
import {
  computeSignature,
  buildCartLine,
  lineSubtotal,
  cartSubtotal,
  cartItemCount,
  buildOrderPayload,
} from '@/utils/cart'

const ramen: IMenuItem = {
  id: 4,
  name: 'Chicken Ramen',
  description: 'Rich broth',
  price: 14.99,
  category_id: 2,
  image_url: null,
  customization_groups: [
    {
      id: 3,
      name: 'Spice Level',
      required: true,
      max_selections: 1,
      options: [
        { id: 6, name: 'Mild', price_modifier: 0 },
        { id: 7, name: 'Medium', price_modifier: 0 },
        { id: 8, name: 'Spicy', price_modifier: 0 },
        { id: 9, name: 'Extra Spicy', price_modifier: 1 },
      ],
    },
    {
      id: 4,
      name: 'Add-ons',
      required: false,
      max_selections: 3,
      options: [
        { id: 10, name: 'Extra Egg', price_modifier: 2 },
        { id: 11, name: 'Extra Chashu', price_modifier: 4 },
        { id: 12, name: 'Corn', price_modifier: 1 },
      ],
    },
  ],
}

const greenTea: IMenuItem = {
  id: 3,
  name: 'Green Tea',
  description: 'Hot',
  price: 3.5,
  category_id: 3,
  image_url: null,
  customization_groups: [],
}

describe('computeSignature', () => {
  it('produces the same signature regardless of option order', () => {
    expect(computeSignature(4, [10, 7])).toBe(computeSignature(4, [7, 10]))
  })

  it('differs when items differ', () => {
    expect(computeSignature(4, [7])).not.toBe(computeSignature(5, [7]))
  })

  it('differs when option sets differ', () => {
    expect(computeSignature(4, [7])).not.toBe(computeSignature(4, [8]))
  })

  it('handles empty option list', () => {
    expect(computeSignature(3, [])).toBe('3#')
  })
})

describe('buildCartLine', () => {
  it('builds a line with selected options carried through', () => {
    const line = buildCartLine(ramen, { 3: [7], 4: [10] }, 2)
    expect(line.menuItemId).toBe(4)
    expect(line.name).toBe('Chicken Ramen')
    expect(line.basePrice).toBeCloseTo(14.99)
    expect(line.quantity).toBe(2)
    expect(line.selectedOptions).toEqual([
      { optionId: 7, name: 'Medium', priceModifier: 0 },
      { optionId: 10, name: 'Extra Egg', priceModifier: 2 },
    ])
  })

  it('produces a consistent signature for same item+options regardless of input order', () => {
    const a = buildCartLine(ramen, { 3: [7], 4: [10] }, 1)
    const b = buildCartLine(ramen, { 4: [10], 3: [7] }, 5)
    expect(a.signature).toBe(b.signature)
  })

  it('handles items with no customizations', () => {
    const line = buildCartLine(greenTea, {}, 1)
    expect(line.selectedOptions).toEqual([])
    expect(line.signature).toBe('3#')
  })

  it('omits options that exist in the selection but not in the item', () => {
    const line = buildCartLine(greenTea, { 999: [123] }, 1)
    expect(line.selectedOptions).toEqual([])
  })
})

describe('lineSubtotal', () => {
  it('base × quantity when no options', () => {
    const line: ICartLine = {
      signature: 'x',
      menuItemId: 3,
      name: 'Tea',
      basePrice: 3.5,
      quantity: 2,
      selectedOptions: [],
    }
    expect(lineSubtotal(line)).toBeCloseTo(7)
  })

  it('adds option modifiers then multiplies', () => {
    const line: ICartLine = {
      signature: 'x',
      menuItemId: 4,
      name: 'Ramen',
      basePrice: 14.99,
      quantity: 2,
      selectedOptions: [
        { optionId: 9, name: 'Extra Spicy', priceModifier: 1 },
        { optionId: 10, name: 'Extra Egg', priceModifier: 2 },
      ],
    }
    // (14.99 + 1 + 2) × 2 = 35.98
    expect(lineSubtotal(line)).toBeCloseTo(35.98)
  })
})

describe('cartSubtotal & cartItemCount', () => {
  const tea = buildCartLine(greenTea, {}, 2)
  const ramenLine = buildCartLine(ramen, { 3: [7] }, 1)

  it('sums line subtotals across the cart', () => {
    // 3.5 × 2 + 14.99 × 1 = 21.99
    expect(cartSubtotal([tea, ramenLine])).toBeCloseTo(21.99)
  })

  it('returns 0 for an empty cart', () => {
    expect(cartSubtotal([])).toBe(0)
    expect(cartItemCount([])).toBe(0)
  })

  it('sums quantities across lines', () => {
    expect(cartItemCount([tea, ramenLine])).toBe(3) // 2 + 1
  })
})

describe('buildOrderPayload', () => {
  it('matches the API contract shape from the brief', () => {
    const ramenLine = buildCartLine(ramen, { 3: [7], 4: [10] }, 2)
    const teaLine = buildCartLine(greenTea, {}, 1)
    const payload = buildOrderPayload('T001', [ramenLine, teaLine], 'No MSG')

    expect(payload).toEqual({
      table_id: 'T001',
      customer_note: 'No MSG',
      items: [
        {
          menu_item_id: 4,
          quantity: 2,
          customizations: [
            { option_id: 7, quantity: 1 },
            { option_id: 10, quantity: 1 },
          ],
        },
        {
          menu_item_id: 3,
          quantity: 1,
          customizations: [],
        },
      ],
    })
  })

  it('handles an empty cart', () => {
    expect(buildOrderPayload('T001', [], '')).toEqual({
      table_id: 'T001',
      customer_note: '',
      items: [],
    })
  })

  it('always sends quantity:1 per customization', () => {
    const line = buildCartLine(ramen, { 3: [7], 4: [10, 12] }, 1)
    const payload = buildOrderPayload('T001', [line], '')
    expect(payload.items[0].customizations.every((c) => c.quantity === 1)).toBe(true)
  })
})
