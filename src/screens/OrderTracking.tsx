import { useRoute, RouteProp } from '@react-navigation/native'
import { Text, View, StyleSheet } from 'react-native'

import { TAppStackParamList } from '@/navigation/types'
import { Colors, Spacing, FontSize } from '@/theme'

const OrderTracking = () => {
  const route = useRoute<RouteProp<TAppStackParamList, 'OrderTracking'>>()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Tracking (stub)</Text>
      <Text style={styles.muted}>Order: {route.params.orderId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  muted: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
})

export default OrderTracking
