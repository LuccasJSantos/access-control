import { Feather } from '@expo/vector-icons'
import { ScrollView } from 'native-base'
import { useState } from 'react'
import { Text, View } from 'react-native'
import Cond, { CondItem } from '../Cond'
import { useEffect } from 'react'

const ConnectionTest = ({ onCompleted, onError }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const [steps, setSteps] = useState([
    { text: 'Buscando módulo NodeMCU na rede', state: 'current' },
    { text: 'Testando comunicação', state: 'unfinished' },
    { text: 'Testando leitura dos dados', state: 'unfinished' },
    { text: 'Testando escrita dos dados', state: 'unfinished' },
  ]) // state :: unfinished | current | finished | error

  const setStepByIndex = (index, value) => {
    setSteps([
      ...steps.slice(0, index),
      { ...steps[index], ...value },
      ...steps.slice(index + 1),
    ])
  }

  function onStepCompleted() {
    setStepByIndex(currentStep, { state: 'finished' })

    if (currentStep === steps.length - 1) {
      return setTimeout(onCompleted, 1500)
    }

    setCurrentStep(currentStep + 1)
  }

  function findNodeMCU() {
    setTimeout(onStepCompleted, 1000)
    console.log('Find')
  }

  function testConnection() {
    setTimeout(onStepCompleted, 1000)
    console.log('Test Connection')
  }

  function testReading() {
    setTimeout(onStepCompleted, 1000)
    console.log('Test Reading')
  }

  function testWriting() {
    setTimeout(onStepCompleted, 1000)
    console.log('Test Writing')
  }

  useEffect(() => {
    setStepByIndex(currentStep, { state: 'current' })

    switch (currentStep) {
      case 0:
        return findNodeMCU()
      case 1:
        return testConnection()
      case 2:
        return testReading()
      case 3:
        return testWriting()
      default:
        return
    }
  }, [currentStep])

  return (
    <ScrollView>
      {steps.map((step, i) => (
        <View key={i} className="py-1">
          <Cond watch={step.state}>
            <CondItem
              when="unfinished"
              className="flex-row items-center gap-1 opacity-30"
            >
              <Feather name="check-circle" />
              <Text>{step.text}</Text>
            </CondItem>

            <CondItem when="current" className="flex-row items-center gap-1">
              <Feather name="check-circle" />
              <Text>{step.text}...</Text>
            </CondItem>

            <CondItem when="finished" className="flex-row items-center gap-1">
              <Feather name="check-circle" color="#4CAF50" />
              <Text className="text-success">{step.text}</Text>
            </CondItem>

            <CondItem when="error" className="flex-row items-center gap-1">
              <Feather name="check-circle" color="#E50014" />
              <Text className="text-error">{step.text}</Text>
            </CondItem>
          </Cond>
        </View>
      ))}
    </ScrollView>
  )
}

export default ConnectionTest
