import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { TAppStackParamList } from './types'

import Cart from '@/screens/Cart'
import ItemDetail from '@/screens/ItemDetail'
import Menu from '@/screens/Menu'
import OrderConfirmation from '@/screens/OrderConfirmation'
import OrderTracking from '@/screens/OrderTracking'
import Scanner from '@/screens/Scanner'
import { Colors } from '@/theme'

const { Navigator, Screen } = createNativeStackNavigator<TAppStackParamList>()

const AppStack = () => {
  return (
    <Navigator
      initialRouteName="Scanner"
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.textInverse,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Screen name="Scanner" component={Scanner} options={{ title: 'Scan Table' }} />
      <Screen name="Menu" component={Menu} options={{ title: 'Menu' }} />
      <Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{ presentation: 'modal', title: 'Customize' }}
      />
      <Screen name="Cart" component={Cart} options={{ title: 'Your Cart' }} />
      <Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{ title: 'Order Placed', headerBackVisible: false }}
      />
      <Screen name="OrderTracking" component={OrderTracking} options={{ title: 'Order Status' }} />
    </Navigator>
  )
}

export default AppStack
