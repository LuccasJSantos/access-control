import { useState } from 'react'
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'
import { Button, FormControl, Input } from 'native-base'
import bg from '../../assets/login-bg.png'
import logo from '../../assets/fatec-logo.png'

function Login(props) {
  const [data, setData] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({ username: '', password: '' })

  function onLogin() {
    setErrors({
      username: data.username ? '' : 'Preencha o usuário',
      password: data.password ? '' : 'Preencha a senha',
    })

    if (data.username && data.password) {
      props.navigation.navigate('Home')
    }
  }

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

            <FormControl isRequired isInvalid={errors.username}>
              <Input
                placeholder="Usuário"
                variant="underlined"
                onChangeText={(value) => setData({ ...data, username: value })}
                className="text-white"
              />
              {errors.username && (
                <FormControl.ErrorMessage>
                  {errors.username}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={errors.password}>
              <Input
                placeholder="Senha"
                variant="underlined"
                onChangeText={(value) => setData({ ...data, password: value })}
                className="text-white"
              />
              {errors.password && (
                <FormControl.ErrorMessage>
                  {errors.password}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

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
