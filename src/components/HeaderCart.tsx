import { useEffect, useRef } from 'react'
import { Animated, Text, TouchableOpacity } from 'react-native'

import styles from './HeaderCart.style'

import { useCartStore } from '@/state/cartStore'

interface IHeaderCartProps {
  onPress: () => void
}

const HeaderCart: React.FC<IHeaderCartProps> = ({ onPress }) => {
  const count = useCartStore((s) => s.lines.length)
  const scale = useRef(new Animated.Value(1)).current
  const prevCountRef = useRef(count)

  useEffect(() => {
    if (count > prevCountRef.current) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.4,
          friction: 3,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }
    prevCountRef.current = count
  }, [count, scale])

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `Open cart, ${count} items` : 'Open cart'}
    >
      <Text style={styles.label}>Cart</Text>
      {count > 0 && (
        <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
          <Animated.Text style={[styles.badgeText, { transform: [{ scale }] }]}>
            {count}
          </Animated.Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  )
}

export default HeaderCart
