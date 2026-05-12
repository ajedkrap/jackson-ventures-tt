import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useLayoutEffect } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './OrderTracking.style'

import { useOrderPolling } from '@/hooks/useOrderPolling'
import type { IOrderStatus } from '@/models/order'
import { TAppStackParamList } from '@/navigation/types'
import { Colors } from '@/theme'

type Props = NativeStackScreenProps<TAppStackParamList, 'OrderTracking'>

const STATUS_FLOW: IOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served']

const STATUS_LABELS: Record<IOrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
}

const STATUS_DESCRIPTIONS: Record<IOrderStatus, string> = {
  pending: 'Waiting for the kitchen to accept your order.',
  confirmed: 'Your order has been accepted.',
  preparing: 'The kitchen is cooking now.',
  ready: 'Your order is ready for pickup.',
  served: 'Order delivered. Enjoy!',
}

const OrderTracking = ({ navigation, route }: Props) => {
  const { orderId } = route.params
  const { order, loading, error, retry } = useOrderPolling(orderId)

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Order Status' })
  }, [navigation])

  if (loading && !order) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (error && !order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Couldn't load order</Text>
        <Text style={styles.errorBody}>{error.message}</Text>
        <TouchableOpacity onPress={retry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorBody}>Order not found.</Text>
      </View>
    )
  }

  const currentIndex = STATUS_FLOW.indexOf(order.status)
  const isServed = order.status === 'served'

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <Text style={styles.orderIdLabel}>ORDER ID</Text>
          <Text style={styles.orderIdValue}>{order.id}</Text>
          {!!order.estimated_minutes && !isServed && (
            <View style={styles.etaWrap}>
              <Text style={styles.etaLabel}>Estimated prep</Text>
              <Text style={styles.etaValue}>{order.estimated_minutes} min</Text>
            </View>
          )}
        </View>

        <View style={styles.timeline}>
          {STATUS_FLOW.map((status, index) => {
            const isDone = index < currentIndex
            const isCurrent = index === currentIndex
            const isLast = index === STATUS_FLOW.length - 1
            return (
              <View style={styles.stepRow} key={status}>
                <View style={styles.stepIndicatorCol}>
                  <View
                    style={[styles.stepCircle, (isDone || isCurrent) && styles.stepCircleActive]}
                  >
                    {isDone && <Text style={styles.stepCheck}>✓</Text>}
                    {isCurrent && <View style={styles.stepDot} />}
                  </View>
                  {!isLast && <View style={[styles.stepLine, isDone && styles.stepLineActive]} />}
                </View>
                <View style={styles.stepTextCol}>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCurrent && styles.stepLabelActive,
                      index > currentIndex && styles.stepLabelFuture,
                    ]}
                  >
                    {STATUS_LABELS[status]}
                  </Text>
                  {isCurrent && <Text style={styles.stepDesc}>{STATUS_DESCRIPTIONS[status]}</Text>}
                </View>
              </View>
            )
          })}
        </View>

        {error && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{`Couldn't refresh — ${error.message}`}</Text>
            <TouchableOpacity onPress={retry}>
              <Text style={styles.bannerRetry}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderTracking
