import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'

import { TAppStackParamList } from './types'

import Cart from '@/screens/Cart'
import ItemDetail from '@/screens/ItemDetail'
import Menu from '@/screens/Menu'
import OrderConfirmation from '@/screens/OrderConfirmation'
import OrderTracking from '@/screens/OrderTracking'
import Scanner from '@/screens/Scanner'
import { Colors } from '@/theme'

type TAppStackScreen = {
  name: keyof TAppStackParamList
  component: React.ComponentType<
    NativeStackScreenProps<TAppStackParamList, keyof TAppStackParamList>
  >
  options?: NativeStackNavigationOptions
}

const appStackScreens: TAppStackScreen[] = [
  {
    name: 'Scanner',
    component: Scanner,
    options: { title: 'Scan Table' },
  },
  {
    name: 'Menu',
    component: Menu,
    options: { title: 'Menu' },
  },
  {
    name: 'ItemDetail',
    component: ItemDetail,
    options: { presentation: 'modal', title: 'Customize' },
  },
  {
    name: 'Cart',
    component: Cart,
    options: { title: 'Your Cart' },
  },
  {
    name: 'OrderConfirmation',
    component: OrderConfirmation,
    options: { title: 'Order Placed', headerBackVisible: false },
  },
  {
    name: 'OrderTracking',
    component: OrderTracking,
    options: { title: 'Order Status' },
  },
]

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
      {appStackScreens.map((props) => (
        <Screen key={props.name} {...props} />
      ))}
    </Navigator>
  )
}

export default AppStack
