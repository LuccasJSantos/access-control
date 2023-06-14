import { Button, IconButton, Text } from 'native-base'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import StepIndicator from 'react-native-step-indicator'
import WiFiList from '../components/WiFiList'
import Cond, { CondItem } from '../components/Cond'
import ConnectionTest from '../components/ConnectionTest'
import ConnectionWidget from '../components/ConnectionWidget'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import useConnection from '../hooks/connection'

function ConnectionSettings() {
  const { connected } = useConnection()

  const navigation = useNavigation()
  const route = useRoute()

  const connectionText = connected
    ? 'Tudo certo com sua conexão com a porta!'
    : 'Inicie a configuração abaixo e siga o passo a passo para realizar a conexão com a porta.'

  const [guide, setGuide] = useState({
    started: false,
    currentStep: 0,
    steps: [
      { text: 'Selecione a rede WiFi', state: 'current' },
      { text: 'Testando conexão', state: 'unfinished' },
      { text: '', state: 'unfinished' },
    ],
  })

  useEffect(() => {
    if (connected && route.params?.login) {
      navigation.reset({ index: 0, routes: [{ name: 'login' }] })
      return
    }
  }, [connected])

  function setStepByIndex(index, value) {
    return {
      steps: [
        ...guide.steps.slice(0, index),
        { ...guide.steps[index], ...value },
        ...guide.steps.slice(index + 1),
      ],
    }
  }

  function onStepCompleted(response) {
    if (response?.error) {
      return setGuide({
        ...guide,
        ...setStepByIndex(guide.currentStep, { state: 'error' }),
      })
    }

    return setGuide({
      ...guide,
      currentStep: guide.currentStep + 1,
      ...setStepByIndex(guide.currentStep, { state: 'finished' }),
    })
  }

  function renderStepIndicator({ position, stepStatus }) {
    const style =
      guide.steps[position].state === 'error'
        ? 'text-error'
        : stepStatus === 'unfinished'
        ? 'text-gray-300'
        : stepStatus === 'current'
        ? 'text-success'
        : 'text-white'

    return (
      <Text className={`text-sm font-medium text-center w-28 ${style}`}>
        {position + 1}
      </Text>
    )
  }

  function renderLabel({ label, position, stepStatus }) {
    const style =
      guide.steps[position].state === 'error'
        ? 'text-error'
        : stepStatus === 'unfinished'
        ? 'text-gray-300'
        : 'text-success'

    return (
      <Text className={`text-sm font-medium text-center w-28 ${style}`}>
        {label}
      </Text>
    )
  }

  function getCurrentStrokeColor() {
    const state = guide.steps[guide.currentStep].state
    return state === 'error'
      ? '#E50014'
      : state === 'unfinished'
      ? '#DDDDDD'
      : state === 'current'
      ? '#4CAF50'
      : '#FFFFFF'
  }

  return (
    <LinearGradient
      colors={['#fff', '#fff', '#f4f6fa']}
      locations={[0, 0.05, 1]}
      className="absolute -z-10 top-0 left-0 w-full h-full py-3 px-5"
    >
      <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
        <View className="w-full gap-1">
          <Text className="text-xl font-bold text-gray-500">Conexão</Text>
          <ConnectionWidget className="mt-0.5" />
          <Text className="text-xs text-gray-500">{connectionText}</Text>
        </View>

        <View className="mt-56">
          {/* Guide Text */}
          {!connected && !guide.started && (
            <View className="gap-5">
              <Text className="text-xl leading-8 text-gray-500">
                Você não está conectado no momento, clique no botão abaixo para
                inciar a configuração
              </Text>
              <Button
                className="bg-success"
                onPress={() => setGuide({ ...guide, started: true })}
              >
                Configurar rede
              </Button>
            </View>
          )}

          {/* Guide */}
          {guide.started && (
            <View>
              {/* Guide Title */}
              <View className="items-center w-full">
                <Text className="text-xl font-bold">Passo a Passo</Text>
                <Text className="text-xl">Conexão</Text>
              </View>

              {/* Guide Stepper */}
              <View className="mt-9.5">
                <StepIndicator
                  customStyles={{
                    stepStrokeCurrentColor: getCurrentStrokeColor(),
                    stepIndicatorLabelCurrentColor: '#4CAF50',
                    stepIndicatorUnFinishedColor: '#ddd',
                    stepStrokeUnFinishedColor: '#ddd',
                    labelColor: '#ff0',
                  }}
                  stepCount={3}
                  currentPosition={guide.currentStep}
                  labels={[
                    'Configuração Wi-Fi',
                    'Teste de Conexão',
                    'Configuração Concluída',
                  ]}
                  renderStepIndicator={renderStepIndicator}
                  renderLabel={renderLabel}
                  onPress={() => {}}
                />
              </View>

              <View className="mt-12">
                <Text className="text-sm font-medium text-gray-500">
                  {guide.steps[guide.currentStep].text}
                </Text>

                <View className="mt-3">
                  <Cond watch={guide.currentStep}>
                    <CondItem when={0}>
                      <WiFiList
                        onConnected={onStepCompleted}
                        onError={onStepCompleted}
                      />
                    </CondItem>
                    <CondItem when={1}>
                      <ConnectionTest
                        onCompleted={onStepCompleted}
                        onError={onStepCompleted}
                      />
                    </CondItem>
                    <CondItem when={2} className="items-center">
                      <View className="gap-2 items-center w-56">
                        <Text className="text-3xl text-gray-500">
                          Tudo certo!
                        </Text>
                        <Text className="text-sm text-center text-success">
                          Conexão com o dispositivo concluída
                        </Text>
                        <View className="pt-2">
                          <IconButton
                            className="bg-success"
                            size={16}
                            borderRadius="full"
                            variant="solid"
                            _pressed={{
                              opacity: 80,
                            }}
                            _icon={{
                              as: Feather,
                              name: 'check',
                              size: 6,
                            }}
                            onPress={() => navigation.goBack()}
                          />
                        </View>
                      </View>
                    </CondItem>
                  </Cond>
                </View>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default ConnectionSettings
