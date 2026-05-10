import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { Button, Text, View, StyleSheet } from 'react-native'

import { TAppStackParamList } from '@/navigation/types'
import { Colors, Spacing, FontSize } from '@/theme'

const OrderConfirmation = () => {
  const nav = useNavigation()
  const route = useRoute<RouteProp<TAppStackParamList, 'OrderConfirmation'>>()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Placed (stub)</Text>
      <Text style={styles.muted}>Order: {route.params.orderId}</Text>
      <Button
        title="Track order"
        onPress={() => nav.navigate('OrderTracking', { orderId: route.params.orderId })}
      />
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

export default OrderConfirmation
