import type { ICustomizationGroup, IMenuItem } from '@/models/menu'

export type TSelection = Record<number, number[]>

export type TValidationError = {
  groupId: number
  groupName: string
  reason: 'required' | 'too_many'
}

export const validateSelection = (
  groups: ICustomizationGroup[],
  selection: TSelection
): TValidationError[] => {
  const errors: TValidationError[] = []
  for (const group of groups) {
    const selected = selection[group.id] ?? []
    if (group.required && selected.length === 0) {
      errors.push({ groupId: group.id, groupName: group.name, reason: 'required' })
    }
    if (selected.length > group.max_selections) {
      errors.push({ groupId: group.id, groupName: group.name, reason: 'too_many' })
    }
  }
  return errors
}

export const calculateItemTotal = (
  item: IMenuItem,
  selection: TSelection,
  quantity: number
): number => {
  const modifierSum = item.customization_groups.reduce((acc, group) => {
    const selectedIds = selection[group.id] ?? []
    const groupSum = group.options
      .filter((o) => selectedIds.includes(o.id))
      .reduce((sum, o) => sum + o.price_modifier, 0)
    return acc + groupSum
  }, 0)
  return (item.price + modifierSum) * quantity
}

export const toggleOption = (
  selection: TSelection,
  group: ICustomizationGroup,
  optionId: number
): TSelection => {
  const current = selection[group.id] ?? []
  const isSelected = current.includes(optionId)

  if (group.max_selections === 1) {
    return { ...selection, [group.id]: isSelected ? [] : [optionId] }
  }

  if (isSelected) {
    return { ...selection, [group.id]: current.filter((id: number) => id !== optionId) }
  }

  if (current.length >= group.max_selections) {
    return selection
  }

  return { ...selection, [group.id]: [...current, optionId] }
}
