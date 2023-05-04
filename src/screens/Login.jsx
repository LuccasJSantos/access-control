import { useState } from "react"
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native"
import { Button, FormControl, Input } from "native-base"
import bg from "../../assets/login-bg.png"
import logo from "../../assets/fatec-logo.png"

const Login = () => {
  const [data, setData] = useState({ username, password })

  function onLogin() {}

  return (
    <ImageBackground className="flex-1" source={bg} resizeMode="cover">
      <SafeAreaView
        className="flex-1 items-center justify-center w-full h-full px-10 space-y-[120px]"
        style={{ marginTop: StatusBar.currentHeight }}
      >
        {/* Logo */}
        <Image
          source={logo}
          resizeMode="contain"
          style={{
            width: 236,
            height: 114,
          }}
        />

        {/* Login */}
        <View className="flex-row">
          <View className="flex-1">
            <Text className="font-semibold text-white text-2xl">Login</Text>
            <FormControl isRequired isInvalid={"name" in errors}>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                Name
              </FormControl.Label>
              <Input
                placeholder="Usuário"
                onChangeText={(value) => setData({ ...data, username: value })}
                className="text-white"
              />
              {"name" in errors ? (
                <FormControl.ErrorMessage>
                  Preencha o campo usuário
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText>
                  Preencha o campo usuário
                </FormControl.HelperText>
              )}
            </FormControl>
            <Button onPress={onSubmit} mt="5" colorScheme="cyan">
              Submit
            </Button>

            <View className="mt-4 space-y-2">
              <Input
                variant="underlined"
                size="lg"
                placeholder="Usuário"
                className="text-white"
              />
              <Input
                variant="underlined"
                type="password"
                size="lg"
                placeholder="Senha"
                className="text-white"
              />
            </View>

            <Button className="mt-6 bg-accent" onPress={onLogin}>
              Login
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Login
