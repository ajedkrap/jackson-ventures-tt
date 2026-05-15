import { CommonActions } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, Animated, AccessibilityInfo } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './OrderConfirmation.style'

import { TAppStackParamList } from '@/navigation/types'
import { useMenuStore } from '@/state/menuStore'

type TOrderConfirmationProps = NativeStackScreenProps<TAppStackParamList, 'OrderConfirmation'>

const OrderConfirmation: React.FC<TOrderConfirmationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { orderId } = route.params
  const scale = useRef(new Animated.Value(0)).current
  const { tableId } = useMenuStore()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('orderConfirmation.title'),
      headerBackVisible: false,
      gestureEnabled: false,
    })
  }, [navigation, t])

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }, [scale])

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      t('orderConfirmation.a11y.announcement', { id: orderId })
    )
  }, [orderId, t])

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
        <Text style={styles.title}>{t('orderConfirmation.heroTitle')}</Text>
        <Text style={styles.subtitle}>{t('orderConfirmation.heroSubtitle')}</Text>
        <View style={styles.orderIdWrap}>
          <Text style={styles.orderIdLabel}>{t('orderConfirmation.orderIdLabel')}</Text>
          <Text style={styles.orderIdValue}>{orderId}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleTrackOrder}
          accessibilityRole="button"
          accessibilityLabel={t('orderConfirmation.trackOrder')}
        >
          <Text style={styles.primaryBtnText}>{t('orderConfirmation.trackOrder')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleOrderMore}
          accessibilityRole="button"
          accessibilityLabel={t('orderConfirmation.orderMore')}
        >
          <Text style={styles.secondaryBtnText}>{t('orderConfirmation.orderMore')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tertiaryBtn}
          onPress={handleSwitchTable}
          accessibilityRole="button"
          accessibilityLabel={t('orderConfirmation.switchTable')}
        >
          <Text style={styles.tertiaryBtnText}>{t('orderConfirmation.switchTable')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default OrderConfirmation
