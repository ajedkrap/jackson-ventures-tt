import type { ICustomizationGroup, IMenuItem } from '@/models/menu'
import {
  validateSelection,
  calculateItemTotal,
  toggleOption,
  type TSelection,
} from '@/utils/customization'

const requiredRadioGroup: ICustomizationGroup = {
  id: 100,
  name: 'Size',
  required: true,
  max_selections: 1,
  options: [
    { id: 1, name: 'Regular', price_modifier: 0 },
    { id: 2, name: 'Large', price_modifier: 8 },
  ],
}

const optionalCheckboxGroup: ICustomizationGroup = {
  id: 200,
  name: 'Add-ons',
  required: false,
  max_selections: 3,
  options: [
    { id: 10, name: 'Egg', price_modifier: 2 },
    { id: 11, name: 'Chashu', price_modifier: 4 },
    { id: 12, name: 'Corn', price_modifier: 1 },
    { id: 13, name: 'Bamboo', price_modifier: 1.5 },
  ],
}

const buildItem = (groups: ICustomizationGroup[] = []): IMenuItem => ({
  id: 1,
  name: 'Ramen',
  description: 'Test',
  price: 14.99,
  category_id: 1,
  image_url: null,
  customization_groups: groups,
})

describe('validateSelection', () => {
  it('returns no errors when nothing is required', () => {
    expect(validateSelection([optionalCheckboxGroup], {})).toEqual([])
  })

  it('flags a missing required group', () => {
    const errors = validateSelection([requiredRadioGroup], {})
    expect(errors).toHaveLength(1)
    expect(errors[0]).toMatchObject({
      groupId: 100,
      groupName: 'Size',
      reason: 'required',
    })
  })

  it('passes when a required group has a selection', () => {
    expect(validateSelection([requiredRadioGroup], { 100: [1] })).toEqual([])
  })

  it('flags too_many when selections exceed max_selections', () => {
    const sel: TSelection = { 200: [10, 11, 12, 13] }
    const errors = validateSelection([optionalCheckboxGroup], sel)
    expect(errors).toHaveLength(1)
    expect(errors[0].reason).toBe('too_many')
  })

  it('returns errors for multiple invalid groups', () => {
    const sel: TSelection = { 200: [10, 11, 12, 13] }
    const errors = validateSelection([requiredRadioGroup, optionalCheckboxGroup], sel)
    expect(errors).toHaveLength(2)
    expect(errors.map((e) => e.reason).sort()).toEqual(['required', 'too_many'])
  })
})

describe('calculateItemTotal', () => {
  it('returns base price × quantity when no customizations', () => {
    const item = buildItem()
    expect(calculateItemTotal(item, {}, 1)).toBeCloseTo(14.99)
    expect(calculateItemTotal(item, {}, 3)).toBeCloseTo(44.97)
  })

  it('adds option modifiers to the base price', () => {
    const item = buildItem([requiredRadioGroup])
    // Large = +$8 → 14.99 + 8 = 22.99
    expect(calculateItemTotal(item, { 100: [2] }, 1)).toBeCloseTo(22.99)
  })

  it('multiplies the customized price by quantity', () => {
    const item = buildItem([requiredRadioGroup, optionalCheckboxGroup])
    // (14.99 + 8 + 2 + 1) × 2 = 51.98
    expect(calculateItemTotal(item, { 100: [2], 200: [10, 12] }, 2)).toBeCloseTo(51.98)
  })

  it('ignores selections for groups not on the item', () => {
    const item = buildItem([requiredRadioGroup])
    expect(calculateItemTotal(item, { 100: [1], 999: [123] }, 1)).toBeCloseTo(14.99)
  })
})

describe('toggleOption — radio (max_selections=1)', () => {
  it('selects an option in an empty group', () => {
    expect(toggleOption({}, requiredRadioGroup, 1)).toEqual({ 100: [1] })
  })

  it('replaces existing selection', () => {
    expect(toggleOption({ 100: [1] }, requiredRadioGroup, 2)).toEqual({
      100: [2],
    })
  })

  it('deselects when tapping the already-selected option', () => {
    expect(toggleOption({ 100: [1] }, requiredRadioGroup, 1)).toEqual({
      100: [],
    })
  })
})

describe('toggleOption — checkbox (max_selections>1)', () => {
  it('adds an unselected option', () => {
    expect(toggleOption({}, optionalCheckboxGroup, 10)).toEqual({ 200: [10] })
  })

  it('appends additional selections', () => {
    expect(toggleOption({ 200: [10] }, optionalCheckboxGroup, 11)).toEqual({ 200: [10, 11] })
  })

  it('removes an already-selected option', () => {
    expect(toggleOption({ 200: [10, 11] }, optionalCheckboxGroup, 10)).toEqual({ 200: [11] })
  })

  it('ignores tap when at max_selections (returns same reference)', () => {
    const before: TSelection = { 200: [10, 11, 12] }
    const next = toggleOption(before, optionalCheckboxGroup, 13)
    expect(next).toBe(before)
  })

  it('allows deselect even when at the cap', () => {
    expect(toggleOption({ 200: [10, 11, 12] }, optionalCheckboxGroup, 11)).toEqual({
      200: [10, 12],
    })
  })
})
