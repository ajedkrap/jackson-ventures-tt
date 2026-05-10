import { useNavigation } from '@react-navigation/native'
import { Button, Text, View, StyleSheet } from 'react-native'

import { Colors, Spacing, FontSize } from '@/theme'

const Cart = () => {
  const nav = useNavigation()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart (stub)</Text>
      <Button
        title="Place order (mock)"
        onPress={() => nav.navigate('OrderConfirmation', { orderId: 'ORD-001' })}
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
  title: { fontSize: FontSize.xl, color: Colors.text },
})

export default Cart
