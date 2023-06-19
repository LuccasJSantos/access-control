import 'intl'
import 'intl/locale-data/jsonp/en'

import { StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ConnectionProvider } from './src/context/Connection'
import Login from './src/screens/Login'
import Home from './src/screens/Home'
import Access from './src/screens/Access'
import Users from './src/screens/Users'
import ConnectionSettings from './src/screens/ConnectionSettings'

import { LoginProvider } from './src/context/Login'
import { AccessProvider } from './src/context/Access'
import { UsersProvider } from './src/context/Users'

const Stack = createNativeStackNavigator()

export default function App () {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <ConnectionProvider>
          <LoginProvider>
            <AccessProvider>
              <UsersProvider>
                <StatusBar hidden height="auto" />
                <Stack.Navigator
                  initialRouteName="login"
                  screenOptions={{ headerShown: false }}
                >
                  <Stack.Screen name="login" component={Login} />
                  <Stack.Screen name="home" component={Home} />
                  <Stack.Screen name="access" component={Access} />
                  <Stack.Screen name="users" component={Users} />
                  <Stack.Screen name="connection-settings" component={ConnectionSettings} />
                </Stack.Navigator>
              </UsersProvider>
            </AccessProvider>
          </LoginProvider>
        </ConnectionProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  )
}
