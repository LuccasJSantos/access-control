import { Button, Input, Spinner } from 'native-base'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRef } from 'react'
import Cond, { CondItem } from '../Cond'
import useState from './state'

const WiFiList = ({ className, onError, onConnect }) => {
  const {
    permissionGranted,
    loading,
    networks,
    selectedWiFi,
    onWiFiSelected,
    onConnectPress
  } = useState({ errorFn: onError, successFn: onConnect })

  const refWifiPass = useRef(null)

  const Loading = () => (
    <View className="flex-row items-center gap-2">
      <Spinner color="emerald.500" />
      <Text className="text-xs text-gray-500">Carregando redes...</Text>
    </View>
  )

  const NetworkList = ({ items }) => {
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="gap-1.5"
        >
          {items
            .sort((a, b) => (Number(a.level) > Number(b.level) ? -1 : 1))
            .map((it, i) => (
              <TouchableOpacity
                key={i}
                className={`flex-row items-center gap-2 pr-3 pl-1 pb-2 rounded-lg border-b-2 border-gray-200 bg-white ${
                  it.enabled ? 'border-2 border-green-500' : ''
                }`}
                onPress={() => onWiFiSelected(i)}
              >
                <Text className="flex w-24" numberOfLines={1}>
                  {it.SSID}
                </Text>
                <Feather name="wifi" size={16} />
              </TouchableOpacity>
            ))}
        </ScrollView>

        <Input
          ref={refWifiPass}
          onChangeText={e => (refWifiPass.current.value = e)} // eslint-disable-line
          variant="underlined"
          placeholder="Insira a senha"
          type="password"
          className="mt-4"
        />

        <Button
          onPress={() => {
            onConnectPress({
              ssid: selectedWiFi.SSID,
              password: refWifiPass.current.value
            })
          }}
          className="mt-4 bg-green-500"
        >
          Conectar
        </Button>
      </View>
    )
  }

  return (
    <View className={className}>
      <Cond watch={permissionGranted}>
        <CondItem when={true}>
          <Cond watch={loading}>
            <CondItem when={true}>
              <Loading />
            </CondItem>
            <CondItem when={false}>
              <NetworkList items={networks} />
            </CondItem>
          </Cond>
        </CondItem>
      </Cond>

      {/* Loading Modal */}
      {/* <Center>
        <Modal isOpen={Boolean(selectedWiFi.SSID)} size="sm">
          <Modal.Content maxH="212">
            <Modal.Header>Conectando</Modal.Header>
            <Modal.Body>
              <Center>
                <Text>
                  Conectando-se à rede{' '}
                  <Text className="font-medium">{selectedWiFi.SSID}</Text>
                  ...
                </Text>
              </Center>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center> */}
    </View>
  )
}

export default WiFiList
