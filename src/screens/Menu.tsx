import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { Button, Text, View, StyleSheet } from 'react-native'

import { TAppStackParamList } from '@/navigation/types'
import { Colors, Spacing, FontSize } from '@/theme'

const Menu = () => {
  const nav = useNavigation()
  const route = useRoute<RouteProp<TAppStackParamList, 'Menu'>>()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu (stub)</Text>
      <Text style={styles.muted}>Table: {route.params.tableId}</Text>
      <Button title="Open item 1" onPress={() => nav.navigate('ItemDetail', { itemId: 1 })} />
      <Button title="Go to cart" onPress={() => nav.navigate('Cart')} />
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

export default Menu
