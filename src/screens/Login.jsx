import { Button, Spinner, Toast } from 'native-base'
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  View
} from 'react-native'
import Cond, { CondItem } from '../components/Cond'
import bg from '../../assets/login-bg.png'
import logo from '../../assets/logo.png'
import { useConnection } from '../context/Connection'
import { useLogin } from '../context/Login'

function Login () {
  const navigation = useNavigation()
  const { connected, connectionInit } = useConnection()
  const { login, requestAuth, requestAuthEnable } = useLogin()
  const [state, setState] = useState('idle') // idle | card

  function onLogin () {
    login()
      .then(({ valid, message }) => {
        if (valid) { return }

        throw new Error(message)
      })
      .then(() => navigation.reset({ index: 0, routes: [{ name: 'home' }] }))
      .catch((error) => {
        setTimeout(() => setState('card'), 2000)
        Toast.show({ description: error.message, duration: 2000 })
      })
  }

  useEffect(() => {
    if (state === 'card') {
      requestAuthEnable()
        .then(requestAuth)
        .then(() => navigation.reset({ index: 0, routes: [{ name: 'home' }] }))
        .catch(error => {
          setTimeout(() => setState('idle'), 2000)
          Toast.show({ description: error.message, duration: 2000 })
        })
    }
  }, [state])

  useEffect(() => {
    if (connected) return

    connectionInit()
      // Promise.resolve(true)
      .then((connected) => {
        if (!connected) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'connection-settings', params: { login: true } }]
          })
        }
      })
      .catch(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'connection-settings', params: { login: true } }]
        })
      })
  }, [])

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
            height: 114
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
