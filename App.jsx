import { NativeBaseProvider } from "native-base"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Login from "./src/screens/Login"
const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  )
}
