import { Avatar, Box, Divider, FlatList, Text } from 'native-base'
import { SafeAreaView, StatusBar, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { DateTime } from 'luxon'

import Section from '../components/Section'

function Home() {
  const data = [
    {
      title: 'Mário Marques',
      subtitle: 'Professor',
      detail: DateTime.now(),
    },
    {
      title: 'Geovanni Adan',
      subtitle: 'Técnico de Informática',
      detail: DateTime.now(),
    },
    {
      title: 'Mário Marques',
      subtitle: 'Professor',
      detail: DateTime.now(),
    },
  ]

  return (
    <LinearGradient
      colors={['#fff', '#fff', '#f4f6fa']}
      locations={[0, 0.05, 1]}
      className="absolute -z-10 top-0 left-0 w-full h-full py-3 px-5"
    >
      <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-xl font-bold">
            Bom dia,
            <Text className="ml-1 font-normal text-gray-400"> Luccas</Text>
          </Text>

          <Avatar className="bg-accent">LS</Avatar>
        </View>
      </SafeAreaView>

      <Section
        title="Conexão"
        link={{ title: 'Configurar', screen: 'ConnectionSetup' }}
        className="mt-5"
      >
        <View className="flex-row items-center gap-1">
          <Text className="text-red-500 text-xs">Offline</Text>
          <Feather name="wifi-off" color="#ef4444" />
        </View>
        <TouchableOpacity className="mt-0.5">
          <Text className="text-[10px] text-gray-400">
            Clique aqui para iniciar configuração
          </Text>
        </TouchableOpacity>
      </Section>

      <Section
        title="Acessos recentes"
        link={{ title: 'Ver todos', screen: 'Access' }}
        className="mt-5"
      >
        <Box rounded="lg" className="bg-white px-1.5">
          <FlatList
            data={data}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <View className="flex-row items-center justify-between w-full py-3 px-2">
                    <View className="gap-0.5">
                      <Text className="text-xs font-semibold">
                        {item.title}
                      </Text>
                      <Text className="text-[10px] font-medium text-gray-400">
                        {item.subtitle}
                      </Text>
                    </View>

                    <Text className="text-[10px] text-gray-400">
                      {item.detail.toFormat('dd/MM/yy')} •{' '}
                      {item.detail.toFormat('HH:mm')}
                    </Text>
                  </View>

                  {index < data.length - 1 && (
                    <Divider className="bg-gray-100" />
                  )}
                </View>
              )
            }}
          />
        </Box>

        <View className="flex-row w-full justify-end pt-1">
          <Text className="flex text-gray-500 text-[10px] text-right">
            Conecte-se para atualizar a lista
          </Text>
        </View>
      </Section>

      <Section
        title="Usuários"
        link={{ title: 'Ver todos', screen: 'Access' }}
        className="mt-5"
      >
        <Box rounded="lg" className="bg-white px-1.5">
          <FlatList
            data={data}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <View className="flex-row items-center justify-between w-full py-3 px-2">
                    <View className="gap-0.5">
                      <Text className="text-xs font-semibold">
                        {item.title}
                      </Text>
                      <Text className="text-[10px] font-medium text-gray-400">
                        {item.subtitle}
                      </Text>
                    </View>

                    <Text className="text-[10px] text-gray-400">
                      {item.detail.toFormat('dd/MM/yy')} •{' '}
                      {item.detail.toFormat('HH:mm')}
                    </Text>
                  </View>

                  {index < data.length - 1 && (
                    <Divider className="bg-gray-100" />
                  )}
                </View>
              )
            }}
          />
        </Box>

        <View className="flex-row w-full justify-end pt-1">
          <Text className="flex text-gray-500 text-[10px] text-right">
            Conecte-se para atualizar a lista
          </Text>
        </View>
      </Section>
    </LinearGradient>
  )
}

export default Home
