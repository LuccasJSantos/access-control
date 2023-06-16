import { Toast } from 'native-base'
import {useEffect, useState} from 'react'
import WifiManager from 'react-native-wifi-reborn'
import Geolocation from '@react-native-community/geolocation'
import { requestMultiple } from '../../utils/native'
import u from '../../utils'

export default ({ successFn, errorFn }) => {
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [networks, setNetworks] = useState([])
  const [selectedWiFi, setSelectedWiFi] = useState({})

  useEffect(() => {
    if (networks.length) setLoading(false)
  }, [networks])

  useEffect(() => {
    let timeout = null

    const fn = async () => {
      const granted = await requestMultiple([
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.NEARBY_WIFI_DEVICES',
      ])

      console.log({ granted })

      if (!granted) { return }

      Geolocation.getCurrentPosition(
        () => Toast.closeAll(),
        () => {
          if (!Toast.isActive('location-detector')) {
            Toast.show({
              id: 'location-detector',
              backgroundColor: '#E50014',
              description: 'Habilite a localização do dispositivo.',
              duration: 60000,
            })
          }

          timeout = setTimeout(fn, 2000)
        }
      )

      setPermissionGranted(true)
      setLoading(true)
      loadWifiList()
    }

    fn()

    return () => {
      Toast.closeAll()
      clearTimeout(timeout)
    }
  }, [])

  async function loadWifiList() {
    const removeDuplicates = u.bind(u.createSet, 'SSID')
    const addEnabledProp = u.assoc('enabled', false)
    const sortByLevel = (a, b) => a.level < b.level

    WifiManager.loadWifiList()
      .then(removeDuplicates)
      .then(u.values)
      .then(u.map(addEnabledProp))
      .then(u.sort(sortByLevel))
      .then(setNetworks)
      .catch((error) => errorFn({ error, message: 'Error while loading WiFi list' }))
  }

  function onWiFiSelected(index) {
    const networksDisabled = networks.map(net => ({ ...net, enabled: false }))
    const networksUpdated = [...networksDisabled.slice(0, index), { ...networksDisabled[index], enabled: true }, ...networksDisabled.slice(index + 1) ]

    setNetworks(networksUpdated)
    setSelectedWiFi(networksUpdated[index])

    // WifiManager.connectToProtectedSSID(wifi.SSID, 'Inovaca0', true)
    //   .then(successFn)
    //   .catch((error) =>
    //     errorFn({
    //       error,
    //       message: `Could not connected to ${selectedWiFi.SSID}.`,
    //     })
    //   )
    //   .finally(() => setSelectedWiFi({}))
  }

  function onConnectPress ({ ssid, password }) {
    successFn({ ssid: ssid, password  })
  }

  return { 
    permissionGranted, 
    loading, 
    networks, 
    selectedWiFi,
    onConnectPress,
    onWiFiSelected,
  }
}