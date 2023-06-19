import { Button, Center, Checkbox, Modal, Fab, VStack, Input, Select, Skeleton, Spinner, Text, Toast } from 'native-base'
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
import { useEffect } from 'react'

import u from '../utils'
import formatter from '../utils/formatter'

function Home () {
  const { connected } = useConnection()
  const { users, init: usersInit, awaitUserCard, sendForm, deleteUser } = useUsers()

  const [refreshing, setRefreshing] = useState(false)
  const [filterFn, setFilterFn] = useState(() => () => true)
  const [userModal, setUserModal] = useState(false)
  const [modalState, setModalState] = useState('form') // admin | user | form
  const [form, setForm] = useState({
    name: '',
    role: '',
    card: '',
    moderator: false
  })

  const roles = [{
    name: 'student',
    text: 'Estudante',
  },{
    name:  'professor',
    text: 'Professor',
  },{
    name:  'cleaner',
    text: 'Limpeza',
  },{
    name:  'coordinator',
    text: 'Coordenador',
  },{
    name:  'director',
    text: 'Diretor',
  },{
    name:  'employee',
    text: 'Funcionário',
  }, {
    name: 'it',
    text: 'Técnico de informática'
  }]

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

  function onOpenUserForm (user) {
    setUserModal(true)
    setModalState('form')

    if (user) {
      setForm({ card: user.card, name: user.name, role: user.role, moderator: user.moderator })
    }
  }

  function resetForm () {
    setForm({ name: '', card: '', moderator: '', role: '' })
  }

  async function onSendToNodeMcu () {
    return sendForm(form)
      .then(() => {
        setModalState('user')
      })
      .catch(error => Toast.show({ description: error.message, duration: 3000 }))
  }

  async function onDeleteUser (user) {
    deleteUser(user.id)
      .then(() => Toast.show({ description: 'Usuário deletado com sucesso', duration: 3000, backgroundColor: '#4CAF50' }))
      .catch(error => Toast.show({ description: error.message, duration: 3000 }))
  }

  useEffect(() => {
    if (userModal) {
      switch (modalState) {
        case 'user': 
          awaitUserCard(form)
            .then(card => setForm(current => Object.assign({}, current, { card })))
            .then(resetForm)
            .then(() => Toast.show({ description: 'Usuário cadastrado com sucesso', duration: 3000, backgroundColor: '#4CAF50' }))
            .then(() => u.sleep(1000))
            .then(() => setUserModal(false))
            .then(() => loadData())
            .catch(error => Toast.show({ description: error.message, duration: 3000 }))
          break
        case 'form': 
          break
      }

    }
  }, [userModal, modalState])

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
                    <TouchableOpacity onPress={() => onOpenUserForm(item)}>
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
                              {formatter.role(item.role)}
                            </Text>
                          </View>

                          <TouchableOpacity
                            className="p-1.5"
                            onPress={() => onDeleteUser(item)}
                          >
                            <Feather
                              name="x-circle"
                              color="#E50014"
                              size={18} />
                          </TouchableOpacity>
                        </CondItem>
                      </Cond>
                    </TouchableOpacity>
                  )} />
              </Section>
              <Fab
                className="mt-4 active:bg-green-400"
                bgColor="green.500"
                leftIcon={<Feather name="plus" color="white" size={16} />}
                label="Adicionar usuário"
                onPress={() => onOpenUserForm()} />
            </View>
          } />
          <Center>
            <Modal isOpen={userModal} closeOnOverlayClick={true} onClose={() => {
              resetForm()
              setUserModal(false)
              setModalState('admin')
            }} size="sm">
              <Modal.Content>
                <Modal.Header>Cadastro de usuário</Modal.Header>
                <Modal.Body>
                  <Cond watch={modalState}>
                    <CondItem when="admin">
                      <Center>
                        <Text className="text-center text-lg">Passe o cartão administrador ou de usuário autorizado</Text>
                        <Spinner size="lg" mt="4" />
                      </Center>
                    </CondItem>
                    <CondItem when="user">
                      <Center>
                        <Text className="text-center text-lg">Passe o cartão novo usuário</Text>
                        <Spinner size="lg" mt="4" />
                      </Center>
                    </CondItem>
                    <CondItem when="form">
                      <VStack space={2}>
                        <Input 
                          placeholder="Nome completo"
                          value={form.name}
                          onChangeText={name => setForm(current => Object.assign({}, current, { name }))} />

                        <Select 
                          selectedValue={form.role}
                          minWidth="200"
                          placeholder="Função"
                          mt={1} 
                          onValueChange={role => setForm(current => Object.assign({}, current, { role }))}>
                          { roles.map((role, index) => 
                              <Select.Item key={index} label={role.text} value={role.name} />) }
                        </Select>

                        <Checkbox 
                          mt={2}
                          isChecked={form.moderator}
                          onChange={moderator => setForm(current => Object.assign({}, current, { moderator }))}>Moderador</Checkbox>

                        <Button
                          disabled={!connected}
                          opacity={connected ? 1 : 0.6}
                          className="mt-2 active:bg-green-400"
                          bgColor="green.500"
                          onPress={onSendToNodeMcu}
                        >Finalizar</Button>
                      </VStack>
                    </CondItem>
                  </Cond>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </Center>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default Home
