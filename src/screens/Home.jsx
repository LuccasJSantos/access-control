import { Avatar, Text } from 'native-base'
import { SafeAreaView, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { DateTime } from 'luxon'

import Section from '../components/Section'
import ConnectionWidget from '../components/ConnectionWidget'
import List from '../components/List'
import { useConnection } from '../context/Connection'
import { useLogin } from '../context/Login'

function Home () {
  const { connected } = useConnection()
  const { username } = useLogin()
  const [firstname] = username.split(' ')
  const [lastname] = username.split(' ').slice(-1)
  const avatarText = `${firstname[0]}${lastname[0]}`

  const data = [
    {
      title: 'Mário Marques',
      subtitle: 'Professor',
      detail: DateTime.now()
    },
    {
      title: 'Geovanni Adan',
      subtitle: 'Técnico de Informática',
      detail: DateTime.now()
    },
    {
      title: 'Mário Marques',
      subtitle: 'Professor',
      detail: DateTime.now()
    }
  ]

  return (
    <LinearGradient
      colors={['#fff', '#fff', '#f4f6fa']}
      locations={[0, 0.05, 1]}
      className="absolute -z-10 top-0 left-0 w-full h-full py-3 px-5"
    >
      <SafeAreaView>
        {/* Header */}
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-xl font-bold">
            Bom dia,
            <Text className="ml-1 font-normal text-gray-400"> {firstname}</Text>
          </Text>

          <Avatar className="bg-accent">{avatarText}</Avatar>
        </View>

        {/* Connection section */}
        <Section
          title="Conexão"
          link={!connected && { title: 'Configurar', screen: 'connection-settings' }}
          className="mt-5"
        >
          <View className="flex-row items-center gap-1">
            <ConnectionWidget />
          </View>
          { !connected &&
            <TouchableOpacity className="mt-0.5">
              <Text className="text-xs text-gray-400">
                Clique aqui para iniciar configuração
              </Text>
            </TouchableOpacity>
          }
        </Section>

        {/* Recent access section */}
        <Section
          title="Acessos recentes"
          link={data.length && { title: 'Ver todos', screen: 'Access' }}
          className="mt-5"
        >
          <List
            items={data}
            footerText={!connected && 'Conecte-se para atualizar a lista'}
            render={item => (
              <View>
                <View className="flex-row items-center justify-between w-full py-3 px-2">
                  <View className="gap-0.5">
                    <Text className="text-xs font-semibold">
                      {item.title}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {item.subtitle}
                    </Text>
                  </View>

                  <Text className="text-xs text-gray-400">
                    {item.detail.toFormat('dd/MM/yy')} •{' '}
                    {item.detail.toFormat('HH:mm')}
                  </Text>
                </View>
              </View>
            )} />
        </Section>

        {/* Users section */}
        <Section
          title="Usuários"
          link={{ title: 'Ver todos', screen: 'Access' }}
          className="mt-5"
        >
          <List
            items={data}
            footerText={!connected && 'Conecte-se para atualizar a lista'}
            render={item => {
              return (
                <View>
                  <View className="flex-row items-center justify-between w-full py-3 px-2">
                    <View className="gap-0.5">
                      <Text className="text-xs font-semibold">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {item.subtitle}
                      </Text>
                    </View>

                    <Text className="text-xs text-gray-400">
                      {item.detail.toFormat('dd/MM/yy')} •{' '}
                      {item.detail.toFormat('HH:mm')}
                    </Text>
                  </View>
                </View>
              )
            }}
          />
        </Section>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Home
