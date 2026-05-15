import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import LanguageSwitcher from '@/components/LanguageSwitcher'
import RootNavigator from '@/navigation/RootNavigator'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
        <LanguageSwitcher />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
