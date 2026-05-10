import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { Button, Text, View, StyleSheet } from 'react-native'

import { TAppStackParamList } from '@/navigation/types'
import { Colors, Spacing, FontSize } from '@/theme'

const ItemDetail = () => {
  const nav = useNavigation()
  const route = useRoute<RouteProp<TAppStackParamList, 'ItemDetail'>>()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ItemDetail (stub)</Text>
      <Text style={styles.muted}>Item: {route.params.itemId}</Text>
      <Button title="Close" onPress={() => nav.goBack()} />
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

export default ItemDetail
