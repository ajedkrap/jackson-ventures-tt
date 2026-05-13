import { CommonActions } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Animated, AccessibilityInfo } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './OrderConfirmation.style'

import { TAppStackParamList } from '@/navigation/types'
import { useMenuStore } from '@/state/menuStore'

type TOrderConfirmationProps = NativeStackScreenProps<TAppStackParamList, 'OrderConfirmation'>

const OrderConfirmation: React.FC<TOrderConfirmationProps> = ({ navigation, route }) => {
  const { orderId } = route.params
  const scale = useRef(new Animated.Value(0)).current
  const { tableId } = useMenuStore()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Order Placed',
      headerBackVisible: false,
      gestureEnabled: false,
    })
  }, [navigation])

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }, [scale])

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(`Order placed. Order ID ${orderId}`)
  }, [orderId])

  const handleTrackOrder = () => {
    navigation.navigate('OrderTracking', { orderId })
  }

  const handleOrderMore = () => {
    if (!tableId) {
      handleSwitchTable()
      return
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Menu', params: { tableId } }],
      })
    )
  }

  const handleSwitchTable = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Scanner' }],
      })
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.body}>
        <Animated.View style={[styles.successCircle, { transform: [{ scale }] }]}>
          <Text style={styles.checkmark}>✓</Text>
        </Animated.View>
        <Text style={styles.title}>Order placed</Text>
        <Text style={styles.subtitle}>{`We've sent it to the kitchen.`}</Text>
        <View style={styles.orderIdWrap}>
          <Text style={styles.orderIdLabel}>ORDER ID</Text>
          <Text style={styles.orderIdValue}>{orderId}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleTrackOrder}
          accessibilityRole="button"
          accessibilityLabel="Track order"
        >
          <Text style={styles.primaryBtnText}>Track order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleOrderMore}
          accessibilityRole="button"
          accessibilityLabel="Order more from this table"
        >
          <Text style={styles.secondaryBtnText}>Order more from this table</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tertiaryBtn}
          onPress={handleSwitchTable}
          accessibilityRole="button"
          accessibilityLabel="Switch table"
        >
          <Text style={styles.tertiaryBtnText}>Switch table</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default OrderConfirmation
