import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, ScrollView, TouchableOpacity, Image, AccessibilityInfo } from 'react-native'
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

type TFn = (key: string, opts?: Record<string, unknown>) => string

const groupHelperText = (group: ICustomizationGroup, t: TFn): string => {
  if (group.required) return t('itemDetail.required')
  if (group.max_selections === 1) return t('itemDetail.optional')
  return t('itemDetail.upTo', { n: group.max_selections })
}

const ItemDetail: React.FC<TItemDetailProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
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
    navigation.setOptions({ title: item?.name ?? t('itemDetail.title') })
  }, [item, navigation, t])

  if (!item) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.errorTitle}>{t('itemDetail.notFound')}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.primaryBtn}
          accessibilityRole="button"
        >
          <Text style={styles.primaryBtnText}>{t('itemDetail.backToMenu')}</Text>
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
    AccessibilityInfo.announceForAccessibility(
      t('itemDetail.a11y.addedAnnouncement', { count: quantity, name: item.name })
    )
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
          <Text style={styles.qtyLabel}>{t('itemDetail.quantity')}</Text>
          <View style={styles.qtyStepper}>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
              accessibilityLabel={t('itemDetail.a11y.decreaseQty')}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.min(99, q + 1))}
              style={styles.qtyBtn}
              accessibilityLabel={t('itemDetail.a11y.increaseQty')}
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
                  {groupHelperText(group, t)}
                </Text>
              </View>
              {groupError && (
                <Text style={styles.groupError}>
                  {groupError.reason === 'required'
                    ? t('itemDetail.errorRequired', { name: group.name.toLowerCase() })
                    : t('itemDetail.errorMaxSelections', { n: group.max_selections })}
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
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid }}
          accessibilityLabel={t('itemDetail.a11y.addToCart', { total: formatPrice(total) })}
        >
          <Text style={styles.addBtnText}>
            {t('itemDetail.addToCart', { total: formatPrice(total) })}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ItemDetail
