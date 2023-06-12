import { useState } from 'react'
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'
import { Button, Spinner } from 'native-base'
import bg from '../../assets/login-bg.png'
import logo from '../../assets/logo.png'
import { useNavigation } from '@react-navigation/native'
import Cond, { CondItem } from '../components/Cond'

function Login() {
  const navigation = useNavigation()
  const [state, setState] = useState('card') // idle | card

  function onLogin() {
    navigation.reset({ index: 0, routes: [{ name: 'home' }] })
  }

  const LoginText = ({ text }) => (
    <Text className="font-semibold text-center text-white text-xl">{text}</Text>
  )

  return (
    <ImageBackground className="flex-1 relative" source={bg} resizeMode="cover">
      {/* Overlay */}
      <View className="absolute top-0 left-0 w-full h-full bg-[#0F131A90]" />

      <SafeAreaView
        className="flex-1 items-center justify-center w-full h-full px-10"
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
        <Cond watch={state} className="flex-row mt-40">
          <CondItem when="idle" className="flex-1 space-y-16">
            <LoginText text="Para iniciar uma nova sessão clique no botão abaixo" />

            <Button className="bg-accent" onPress={onLogin}>
              Login
            </Button>
          </CondItem>
          <CondItem when="card" className="flex-1 space-y-16">
            <LoginText text="Passe o cartão para autenticar seu usuário" />

            <Spinner size="lg" />
          </CondItem>
        </Cond>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Login
