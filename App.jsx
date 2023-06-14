import 'intl'
import 'intl/locale-data/jsonp/en'

import { StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from './src/screens/Login'
import Home from './src/screens/Home'
import ConnectionSettings from './src/screens/ConnectionSettings'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <StatusBar hidden height="auto" />
        <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="connection-settings"
            component={ConnectionSettings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="home"
            component={Home}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  )
}
