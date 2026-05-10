import { useNavigation } from '@react-navigation/native'
import { Button, Text, View, StyleSheet } from 'react-native'

import { Colors, Spacing, FontSize } from '@/theme'

const Scanner = () => {
  const nav = useNavigation()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner (stub)</Text>
      <Button title="Mock scan T001" onPress={() => nav.navigate('Menu', { tableId: 'T001' })} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xl,
    color: Colors.text,
  },
})

export default Scanner
