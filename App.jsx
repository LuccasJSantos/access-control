import 'intl'
import 'intl/locale-data/jsonp/en'

import { StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ConnectionProvider } from './src/context/Connection'
import Login from './src/screens/Login'
import Home from './src/screens/Home'
import ConnectionSettings from './src/screens/ConnectionSettings'
import { LoginProvider } from './src/context/Login'
import { AccessProvider } from './src/context/Access'
import { UsersProvider } from './src/context/Users'

const Stack = createNativeStackNavigator()

export default function App () {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <LoginProvider>
          <ConnectionProvider>
            <AccessProvider>
              <UsersProvider>
                <StatusBar hidden height="auto" />
                <Stack.Navigator
                  initialRouteName="login"
                  screenOptions={{ headerShown: false }}
                >
                  <Stack.Screen name="login" component={Login} />
                  <Stack.Screen name="home" component={Home} />
                  <Stack.Screen name="connection-settings" component={ConnectionSettings} />
                </Stack.Navigator>
              </UsersProvider>
            </AccessProvider>
          </ConnectionProvider>
        </LoginProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  )
}
