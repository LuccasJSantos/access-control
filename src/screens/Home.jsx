import { Avatar, Text, Toast } from 'native-base'
import { SafeAreaView, TouchableOpacity, View, FlatList, RefreshControl } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Section from '../components/Section'
import ConnectionWidget from '../components/ConnectionWidget'
import List from '../components/List'
import { useConnection } from '../context/Connection'
import { useLogin } from '../context/Login'
import { useAccess } from '../context/Access'
import { useUsers } from '../context/Users'

function Home () {
  const { connected } = useConnection()
  const { username } = useLogin()
  const { access, init: accessInit } = useAccess()
  const { users, init: usersInit } = useUsers()
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(false)

  const [firstname] = username.split(' ')
  const [lastname] = username.split(' ').slice(-1)
  const avatarText = `${firstname[0]}${lastname[0]}`

  function loadData () {
    setRefreshing(true)
    return Promise.all([
      accessInit().catch(error => Toast.show({ description: error.message, duration: 3000 })),
      usersInit().catch(error => Toast.show({ description: error.message, duration: 3000 }))
    ])
      .finally(() => setRefreshing(false))
  }

  function onRefreshData () {
    loadData()
      .then(() => Toast.show({ description: 'Dados atualizados', duration: 3000 }))
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <LinearGradient
      colors={['#fff', '#fff', '#f4f6fa']}
      locations={[0, 0.05, 1]}
      className="absolute -z-10 top-0 left-0 w-full h-full py-3 px-5"
    >
      <SafeAreaView>
        <FlatList
          data={['']}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshData} />}
          renderItem={() =>
            <View>
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
            <TouchableOpacity className="mt-0.5" onPress={() => navigation.navigate('connection-settings')}>
              <Text className="text-xs text-gray-400">
                Clique aqui para iniciar configuração
              </Text>
            </TouchableOpacity>
                }
              </Section>

              {/* Recent access section */}
              <Section
                title={`Acessos recentes (${access.length})`}
                link={access.slice(4).length && { title: 'Ver todos', screen: 'access' }}
                className="mt-5"
              >
                <List
                  items={access.slice(0, 4)}
                  footerText={!connected && 'Conecte-se para atualizar a lista'}
                  render={item => (
                    <View>
                      <View className="flex-row items-center justify-between w-full py-3 px-2">
                        <View className="gap-0.5">
                          <Text className="text-xs font-semibold">
                            {item.name}
                          </Text>
                          <Text className="text-xs text-gray-400">
                            {item.role}
                          </Text>
                        </View>

                        <Text className="text-xs text-gray-400">
                          {item.date.toFormat('dd/MM/yy')} •{' '}
                          {item.date.toFormat('HH:mm')}
                        </Text>
                      </View>
                    </View>
                  )} />
              </Section>

              {/* Users section */}
              <Section
                title={`Usuários (${users.length})`}
                link={users.slice(4).length && { title: 'Ver todos', screen: 'users' }}
                className="mt-5"
              >
                <List
                  items={users.slice(0, 4)}
                  footerText={!connected && 'Conecte-se para atualizar a lista'}
                  render={item => {
                    return (
                      <View>
                        <View className="flex-row items-center justify-between w-full py-3 px-2">
                          <View className="gap-0.5">
                            <Text className="text-xs font-semibold">
                              {item.name}
                            </Text>
                            <Text className="text-xs text-gray-400">
                              {item.role}
                            </Text>
                          </View>

                          <Text className="text-xs text-gray-400">
                            {item.date.toFormat('dd/MM/yy')} •{' '}
                            {item.date.toFormat('HH:mm')}
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                />
              </Section>
            </View>
          } />
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Home
