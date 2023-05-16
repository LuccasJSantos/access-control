import { Center, HStack, Modal, Spinner } from 'native-base'
import { useState } from 'react'
import { useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { PermissionsAndroid } from 'react-native'
import WifiManager from 'react-native-wifi-reborn'
import Cond, { CondItem } from '../Cond'
import { Feather } from '@expo/vector-icons'

const WiFiList = ({ className, onError, onConnected }) => {
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [networks, setNetworks] = useState([])
  const [selectedWiFi, setSelectedWiFi] = useState({})

  useEffect(() => {
    if (networks.length) setLoading(false)
  }, [networks])

  useEffect(() => {
    ;(async () => {
      if (permissionGranted) return

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de Localização Necessária',
          message:
            'Este aplicativo solicita permissão para utilizar a localização do dispositivo para buscar redes Wi-Fi disponíveis.',
          buttonNegative: 'DENY',
          buttonPositive: 'ALLOW',
        }
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true)
        setLoading(true)
        loadWifiList()
      }
    })()
  }, [])

  async function loadWifiList() {
    const networkList = await WifiManager.loadWifiList().catch((error) =>
      onError({ error, message: 'Error while loading WiFi list' })
    )

    setNetworks(networkList)
  }

  function onWiFiSelected(wifi) {
    setSelectedWiFi(wifi)

    WifiManager.connectToProtectedSSID(wifi.SSID, 'LuNo2703152G', true)
      .then(onConnected)
      .catch((error) =>
        onError({
          error,
          message: `Could not connected to ${selectedWiFi.SSID}.`,
        })
      )
      .finally(() => setSelectedWiFi({}))
  }

  const Loading = () => (
    <View className="flex-row items-center gap-2">
      <Spinner color="emerald.500" />
      <Text className="text-xs text-gray-500">Carregando redes...</Text>
    </View>
  )

  const NetworkList = ({ items }) => (
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
            className="flex-row items-center gap-2 pr-3 pl-1 pb-2 rounded-lg border-b-2 border-gray-200 bg-white"
            onPress={() => onWiFiSelected(it)}
          >
            <Text className="flex w-24" numberOfLines={1}>
              {it.SSID}
            </Text>
            <Feather name="wifi" size={16} />
          </TouchableOpacity>
        ))}
    </ScrollView>
  )

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
      <Center>
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
      </Center>
    </View>
  )
}

export default WiFiList
