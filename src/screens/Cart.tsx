import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './Cart.style'

import type { ICartLine } from '@/models/cart'
import { TAppStackParamList } from '@/navigation/types'
import { useCartStore } from '@/state/cartStore'
import { useMenuStore } from '@/state/menuStore'
import { useOrderStore } from '@/state/orderStore'
import { Colors } from '@/theme'
import { lineSubtotal, cartSubtotal, cartItemCount, buildOrderPayload } from '@/utils/cart'
import { formatPrice } from '@/utils/format'

type TCartProps = NativeStackScreenProps<TAppStackParamList, 'Cart'>

const Cart: React.FC<TCartProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const lines = useCartStore((s) => s.lines)
  const customerNote = useCartStore((s) => s.customerNote)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeLine = useCartStore((s) => s.removeLine)
  const setCustomerNote = useCartStore((s) => s.setCustomerNote)
  const clear = useCartStore((s) => s.clear)
  const { tableId } = useMenuStore()
  const { submitting, submitError, submit } = useOrderStore()

  const subtotal = useMemo(() => cartSubtotal(lines), [lines])
  const itemCount = useMemo(() => cartItemCount(lines), [lines])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: itemCount > 0 ? t('cart.titleWithCount', { count: itemCount }) : t('cart.title'),
      headerRight: () =>
        lines.length > 0 ? (
          <TouchableOpacity
            onPress={() =>
              Alert.alert(t('cart.clearTitle'), t('cart.clearMessage'), [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('cart.clear'), style: 'destructive', onPress: () => clear() },
              ])
            }
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel={t('cart.a11y.clearCart')}
          >
            <Text style={styles.headerBtnText}>{t('cart.clear')}</Text>
          </TouchableOpacity>
        ) : null,
    })
  }, [lines, itemCount, navigation, clear, t])

  const handlePlaceOrder = async () => {
    if (lines.length === 0 || !tableId || submitting) return
    const payload = buildOrderPayload(tableId, lines, customerNote)
    const order = await submit(payload)
    if (order) {
      clear()
      navigation.replace('OrderConfirmation', { orderId: order.id })
    }
  }

  if (lines.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{t('cart.empty')}</Text>
        <Text style={styles.emptyBody}>{t('cart.emptyBody')}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.primaryBtn}
          accessibilityRole="button"
        >
          <Text style={styles.primaryBtnText}>{t('cart.browseMenu')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const renderLine = ({ item: line }: { item: ICartLine }) => {
    const lineTotal = lineSubtotal(line)
    const customizationSummary = line.selectedOptions.map((o) => o.name).join(' · ')
    return (
      <View style={styles.lineRow}>
        <View style={styles.lineMain}>
          <View style={styles.lineTextCol}>
            <Text style={styles.lineName}>{line.name}</Text>
            {customizationSummary.length > 0 && (
              <Text style={styles.lineOptions} numberOfLines={2}>
                {customizationSummary}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => removeLine(line.signature)}
            style={styles.removeBtn}
            accessibilityLabel={t('cart.a11y.remove', { name: line.name })}
          >
            <Text style={styles.removeBtnText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lineFooter}>
          <View style={styles.qtyStepper}>
            <TouchableOpacity
              onPress={() => updateQuantity(line.signature, line.quantity - 1)}
              style={styles.qtyBtn}
              accessibilityLabel={t('cart.a11y.decreaseQty')}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{line.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(line.signature, line.quantity + 1)}
              style={styles.qtyBtn}
              accessibilityLabel={t('cart.a11y.increaseQty')}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.lineSubtotal}>{formatPrice(lineTotal)}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={lines}
        keyExtractor={(l) => l.signature}
        renderItem={renderLine}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.noteWrap}>
            <Text style={styles.noteLabel}>{t('cart.customerNote')}</Text>
            <TextInput
              value={customerNote}
              onChangeText={setCustomerNote}
              placeholder={t('cart.notePlaceholder')}
              placeholderTextColor={Colors.textMuted}
              multiline
              style={styles.noteInput}
              maxLength={300}
              accessibilityLabel={t('cart.a11y.customerNote')}
            />
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('cart.subtotal')}</Text>
          <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
        </View>
        {submitError && <Text style={styles.errorText}>{submitError.message}</Text>}
        <TouchableOpacity
          style={[styles.placeBtn, (submitting || !tableId) && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={submitting || !tableId}
          accessibilityRole="button"
          accessibilityState={{ disabled: submitting || !tableId, busy: submitting }}
          accessibilityLabel={
            submitting
              ? t('cart.a11y.placingOrder')
              : t('cart.a11y.placeOrderWithTotal', { total: formatPrice(subtotal) })
          }
        >
          {submitting ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <Text style={styles.placeBtnText}>{t('cart.placeOrder')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Cart
