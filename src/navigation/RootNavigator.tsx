import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AppStack from './AppStack'
import { TRootStackParamList } from './types'

const { Navigator, Screen } = createNativeStackNavigator<TRootStackParamList>()

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Navigator initialRouteName="AppStack">
        <Screen name="AppStack" component={AppStack} options={{ headerShown: false }} />
      </Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
