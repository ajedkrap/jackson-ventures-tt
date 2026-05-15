import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './OrderTracking.style'

import { useOrderPolling } from '@/hooks/useOrderPolling'
import type { IOrderStatus } from '@/models/order'
import { TAppStackParamList } from '@/navigation/types'
import { Colors } from '@/theme'

type Props = NativeStackScreenProps<TAppStackParamList, 'OrderTracking'>

const STATUS_FLOW: IOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served']

const OrderTracking = ({ navigation, route }: Props) => {
  const { t } = useTranslation()
  const { orderId } = route.params
  const { order, loading, error, retry } = useOrderPolling(orderId)

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('orderTracking.title') })
  }, [navigation, t])

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
        <Text style={styles.errorTitle}>{t('orderTracking.errorTitle')}</Text>
        <Text style={styles.errorBody}>{error.message}</Text>
        <TouchableOpacity onPress={retry} style={styles.retryBtn} accessibilityRole="button">
          <Text style={styles.retryText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorBody}>{t('orderTracking.orderNotFound')}</Text>
      </View>
    )
  }

  const currentIndex = STATUS_FLOW.indexOf(order.status)
  const isServed = order.status === 'served'

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <Text style={styles.orderIdLabel}>{t('orderTracking.orderIdLabel')}</Text>
          <Text style={styles.orderIdValue}>{order.id}</Text>
          {!!order.estimated_minutes && !isServed && (
            <View style={styles.etaWrap}>
              <Text style={styles.etaLabel}>{t('orderTracking.estimatedPrep')}</Text>
              <Text style={styles.etaValue}>
                {t('orderTracking.minutes', { n: order.estimated_minutes })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.timeline}>
          {STATUS_FLOW.map((status, index) => {
            const isDone = index < currentIndex
            const isCurrent = index === currentIndex
            const isLast = index === STATUS_FLOW.length - 1
            const label = t(`orderTracking.status.${status}`)
            const description = t(`orderTracking.statusDesc.${status}`)
            return (
              <View
                style={styles.stepRow}
                key={status}
                accessible
                accessibilityRole="text"
                accessibilityLabel={
                  isDone
                    ? t('orderTracking.a11y.stepCompleted', { label })
                    : isCurrent
                      ? t('orderTracking.a11y.stepCurrent', { label, description })
                      : t('orderTracking.a11y.stepFuture', { label })
                }
              >
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
                    {label}
                  </Text>
                  {isCurrent && <Text style={styles.stepDesc}>{description}</Text>}
                </View>
              </View>
            )
          })}
        </View>

        {error && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {t('orderTracking.refreshError', { message: error.message })}
            </Text>
            <TouchableOpacity
              onPress={retry}
              accessibilityRole="button"
              accessibilityLabel={t('orderTracking.a11y.retryRefresh')}
            >
              <Text style={styles.bannerRetry}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderTracking
