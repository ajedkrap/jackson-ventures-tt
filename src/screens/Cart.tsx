import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useLayoutEffect, useMemo } from 'react'
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
      title: itemCount > 0 ? `Cart · ${itemCount}` : 'Cart',
      headerRight: () =>
        lines.length > 0 ? (
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Clear cart?', 'This will remove all items.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => clear() },
              ])
            }
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear cart"
          >
            <Text style={styles.headerBtnText}>Clear</Text>
          </TouchableOpacity>
        ) : null,
    })
  }, [lines, itemCount, navigation, clear])

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
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyBody}>Add items from the menu to start your order.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.primaryBtn}
          accessibilityRole="button"
        >
          <Text style={styles.primaryBtnText}>Browse menu</Text>
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
            accessibilityLabel={`Remove ${line.name}`}
          >
            <Text style={styles.removeBtnText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lineFooter}>
          <View style={styles.qtyStepper}>
            <TouchableOpacity
              onPress={() => updateQuantity(line.signature, line.quantity - 1)}
              style={styles.qtyBtn}
              accessibilityLabel="Decrease quantity"
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{line.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(line.signature, line.quantity + 1)}
              style={styles.qtyBtn}
              accessibilityLabel="Increase quantity"
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
            <Text style={styles.noteLabel}>Customer note</Text>
            <TextInput
              value={customerNote}
              onChangeText={setCustomerNote}
              placeholder="Allergies, special instructions…"
              placeholderTextColor={Colors.textMuted}
              multiline
              style={styles.noteInput}
              maxLength={300}
              accessibilityLabel="Customer note"
            />
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
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
            submitting ? 'Placing order' : `Place order, total ${formatPrice(subtotal)}`
          }
        >
          {submitting ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : (
            <Text style={styles.placeBtnText}>Place order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Cart
