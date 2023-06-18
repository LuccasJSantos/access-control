import { Fab, Input, Skeleton, Text, Toast } from 'native-base'
import { SafeAreaView, View, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { useRef, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import Section from '../components/Section'
import ConnectionWidget from '../components/ConnectionWidget'
import List from '../components/List'
import { useConnection } from '../context/Connection'
import { useUsers } from '../context/Users'
import Cond, { CondItem } from '../components/Cond'

function Home () {
  const { connected } = useConnection()
  const { users, init: usersInit } = useUsers()

  const [refreshing, setRefreshing] = useState(false)
  const [filterFn, setFilterFn] = useState(() => () => true)

  const searchInput = useRef()

  function loadData () {
    setRefreshing(true)
    Promise.all([
      usersInit().catch(error => Toast.show({ description: error.message, duration: 3000 }))
    ]).finally(() => setRefreshing(false))
  }

  function onSearch () {
    const fn = user =>
      user.name.toLowerCase().includes(searchInput.current.value.toLowerCase()) ||
      user.role.toLowerCase().includes(searchInput.current.value.toLowerCase())

    setFilterFn(() => fn)
  }

  return (
    <LinearGradient
      colors={['#fff', '#fff', '#f4f6fa']}
      locations={[0, 0.05, 1]}
      className="absolute -z-10 top-0 left-0 w-full h-full py-3 px-5"
    >
      <SafeAreaView>
        <FlatList
          data={['']}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
          renderItem={() =>
            <View className="pb-16 mb-1.5">
              {/* Header */}
              <View className="flex-row items-center justify-between w-full">
                <Text className="text-xl font-bold">Usuários</Text>
              </View>

              {/* Connection section */}
              <View className="mt-5">
                <View className="flex-row items-center gap-1">
                  <ConnectionWidget />
                </View>
                <Text className="text-xs text-gray-400">
                  Faça a manutenção de usuários abaixo
                </Text>
              </View>

              <View className="mt-3.5">
                <Input
                  placeholder="Buscar"
                  ref={searchInput}
                  onChangeText={e => (searchInput.current.value = e)}
                  onEndEditing={onSearch}
                  InputRightElement={<View className="mr-3"><Feather name="search" color="#E4E4E4" /></View>} />
              </View>

              {/* Recent users section */}
              <Section
                title={`Lista de usuários cadastrados (${users.length})`}
                className="mt-5"
              >
                <List
                  items={users.filter(filterFn)}
                  footerText={!connected && 'Conecte-se para atualizar a lista'}
                  render={item => (
                    <View>
                      <Cond watch={refreshing}>
                        <CondItem when={true} className="flex-row items-center justify-between w-full py-3 px-2">
                          <View className="gap-1.5">
                            <Skeleton className="h-3 w-44 rounded-full" />
                            <Skeleton className="h-3 w-20 rounded-full" />
                          </View>

                          <Skeleton className="h-3 w-24 rounded-full" />
                        </CondItem>
                        <CondItem when={false} className="flex-row items-center justify-between w-full py-3 px-2">
                          <View className="gap-0.5">
                            <Text className="text-xs font-semibold">
                              {item.name}
                            </Text>
                            <Text className="text-xs text-gray-400">
                              {item.role}
                            </Text>
                          </View>

                          <TouchableOpacity
                            className="p-1.5"
                            onPress={() => console.log('delete user', item.name)}
                          >
                            <Feather
                              name="x-circle"
                              color="#E50014"
                              size={18} />
                          </TouchableOpacity>
                        </CondItem>
                      </Cond>
                    </View>
                  )} />
              </Section>
              <Fab
                className="mt-4 active:bg-green-400"
                bgColor="green.500"
                leftIcon={<Feather name="plus" color="white" size={16} />}
                label="Adicionar usuário" />
            </View>
          } />
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Home
