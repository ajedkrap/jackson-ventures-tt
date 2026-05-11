import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useLayoutEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './ItemDetail.style'

import { ICustomizationGroup, IMenuItem } from '@/models/menu'
import { TAppStackParamList } from '@/navigation/types'
import { useCartStore } from '@/state/cartStore'
import { useMenuStore } from '@/state/menuStore'
import { buildCartLine } from '@/utils/cart'
import {
  validateSelection,
  calculateItemTotal,
  toggleOption,
  TSelection,
} from '@/utils/customization'
import { formatPrice, formatPriceModifier } from '@/utils/format'

type TItemDetailProps = NativeStackScreenProps<TAppStackParamList, 'ItemDetail'>

const groupHelperText = (group: ICustomizationGroup): string => {
  if (group.required) return 'Required'
  if (group.max_selections === 1) return 'Optional'
  return `Up to ${group.max_selections}`
}

const ItemDetail: React.FC<TItemDetailProps> = ({ navigation, route }) => {
  const { itemId } = route.params
  const { menu } = useMenuStore()
  const { addLine } = useCartStore()
  const [selection, setSelection] = useState<TSelection>({})
  const [quantity, setQuantity] = useState(1)

  const item = useMemo(
    () => menu?.items.find((i: IMenuItem) => i.id === itemId) ?? null,
    [menu, itemId]
  )

  useLayoutEffect(() => {
    navigation.setOptions({ title: item?.name ?? 'Customize' })
  }, [item, navigation])

  if (!item) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.errorTitle}>Item not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Back to menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const errors = validateSelection(item.customization_groups, selection)
  const errorByGroupId = new Map(errors.map((e) => [e.groupId, e]))
  const isValid = errors.length === 0
  const total = calculateItemTotal(item, selection, quantity)

  const handleAddToCart = () => {
    if (!isValid) return
    addLine(buildCartLine(item, selection, quantity))
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrap}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={styles.header}>
          <Text style={styles.itemName}>{item.name}</Text>
          {!!item.description && <Text style={styles.itemDesc}>{item.description}</Text>}
          <Text style={styles.basePrice}>{formatPrice(item.price)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Quantity</Text>
          <View style={styles.qtyStepper}>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
              accessibilityLabel="Decrease quantity"
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.min(99, q + 1))}
              style={styles.qtyBtn}
              accessibilityLabel="Increase quantity"
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {item.customization_groups.map((group) => {
          const isRadio = group.max_selections === 1
          const selectedIds = selection[group.id] ?? []
          const atCap = !isRadio && selectedIds.length >= group.max_selections
          const groupError = errorByGroupId.get(group.id)

          return (
            <View key={group.id} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{group.name}</Text>
                <Text style={[styles.groupHelper, group.required && styles.groupHelperRequired]}>
                  {groupHelperText(group)}
                </Text>
              </View>
              {groupError && (
                <Text style={styles.groupError}>
                  {groupError.reason === 'required'
                    ? `Please choose a ${group.name.toLowerCase()}.`
                    : `Max ${group.max_selections} selections.`}
                </Text>
              )}
              {group.options.map((option) => {
                const isSelected = selectedIds.includes(option.id)
                const isDisabled = atCap && !isSelected
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => setSelection((s) => toggleOption(s, group, option.id))}
                    disabled={isDisabled}
                    style={[styles.optionRow, isDisabled && styles.optionRowDisabled]}
                    accessibilityRole={isRadio ? 'radio' : 'checkbox'}
                    accessibilityState={{ selected: isSelected, disabled: isDisabled }}
                  >
                    <View
                      style={[
                        styles.selectionOuter,
                        isRadio ? styles.selectionOuterRound : styles.selectionOuterSquare,
                        isSelected && styles.selectionOuterActive,
                      ]}
                    >
                      {isSelected &&
                        (isRadio ? (
                          <View style={styles.selectionInnerRound} />
                        ) : (
                          <View style={styles.selectionInnerSquare} />
                        ))}
                    </View>
                    <Text style={styles.optionName}>{option.name}</Text>
                    {option.price_modifier !== 0 && (
                      <Text style={styles.optionModifier}>
                        {formatPriceModifier(option.price_modifier)}
                      </Text>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          )
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addBtn, !isValid && styles.addBtnDisabled]}
          disabled={!isValid}
          onPress={handleAddToCart}
        >
          <Text style={styles.addBtnText}>Add to cart — {formatPrice(total)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ItemDetail
