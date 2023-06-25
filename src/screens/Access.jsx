import { Input, Skeleton, Text, Toast } from 'native-base'
import { SafeAreaView, View, FlatList, RefreshControl } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { useRef, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import Section from '../components/Section'
import ConnectionWidget from '../components/ConnectionWidget'
import List from '../components/List'
import { useConnection } from '../contexts/Connection'
import { useAccess } from '../contexts/Access'
import Cond, { CondItem } from '../components/Cond'

import formatter from '../utils/formatter'

function Home () {
  const { connected } = useConnection()
  const { access, init: accessInit } = useAccess()

  const [refreshing, setRefreshing] = useState(false)
  const [filterFn, setFilterFn] = useState(() => () => true)

  const searchInput = useRef()

  function loadData () {
    setRefreshing(true)
    Promise.all([
      accessInit().catch(error => Toast.show({ description: error.message, duration: 3000 }))
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
          renderItem={({ index }) =>
            <View key={index}>
              {/* Header */}
              <View className="flex-row items-center justify-between w-full">
                <Text className="text-xl font-bold">Acessos</Text>
              </View>

              {/* Connection section */}
              <View className="mt-5">
                <View className="flex-row items-center gap-1">
                  <ConnectionWidget />
                </View>
                <Text className="text-xs text-gray-400">
                  Visualize os acessos realizados
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

              {/* Recent access section */}
              <Section
                title={`Lista de acessos (${access.length})`}
                className="mt-5"
              >
                <List
                  items={access.filter(filterFn)}
                  footerText={!connected && 'Conecte-se para atualizar a lista'}
                  render={item => (
                    <View>
                      <Cond watch={refreshing}>
                        <CondItem when={true} className="flex-row items-center justify-between w-full py-3 px-2">
                          <View className="gap-1.5">
                            <Skeleton className="h-3 w-44 rounded-full" />
                            <Skeleton className="h-3 w-20 rounded-full" />
                            <Skeleton className="h-3 w-28 rounded-full" />
                          </View>

                          <Skeleton className="h-3 w-24 rounded-full" />
                        </CondItem>
                        <CondItem when={false} className="flex-row items-center justify-between w-full py-3 px-2">
                          <View className="gap-0.5">
                            <Text className="text-xs font-semibold">
                              {item.name ? item.name : 'Sem identificação'}
                            </Text>
                            <Text className="text-xs text-gray-400">
                              {formatter.role(item.role ? item.role : 'unidentified')}
                            </Text>
                          </View>

                          <View className="items-end">
                            <View className="flex-row items-center gap-1">
                              <View className="opacity-30">
                                <Feather size={10} name={formatter.actionIcon(item.action)} />
                              </View>
                              <Text className="text-xs text-gray-400">
                                {formatter.action(item.action)}
                              </Text>
                            </View>
                            <Text className="text-xs text-gray-400">
                              {item.date.toFormat('dd/MM/yy')} •{' '}
                              {item.date.toFormat('HH:mm')}
                            </Text>
                          </View>
                        </CondItem>
                      </Cond>
                    </View>
                  )} />
              </Section>
            </View>
          } />
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Home
