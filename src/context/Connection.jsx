import * as Network from 'expo-network'
import axios from 'axios'
import WifiManager from 'react-native-wifi-reborn'
import { DateTime, Interval } from 'luxon'
import { useState, createContext, useContext } from 'react'
import {
  APP_NODEMCU_CFG_FILENAME,
  APP_NODEMCU_HOST,
  APP_NODEMCU_PASS,
  APP_NODEMCU_SSID
} from '@env'
import storage from '../utils/storage'

const ConnectionContext = createContext({})

export const ConnectionProvider = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const [ip, setIp] = useState('')

  const reset = () => {
    setConnected(false)
    setIp('')
  }

  const connectionCheck = () => {
    // return axios.get(`${ip}/dooraccess`)
    return Promise.resolve({ status: 200 })
      .then((res) => (res.status === 200))
      .then((conn) => {
        if (!conn) {
          reset()
          return false
        }

        setConnected(true)

        const expireAt = DateTime.now().plus({ days: 7 })

        storage.write(APP_NODEMCU_CFG_FILENAME, { ip, expireAt })

        return true
      })
  }

  const connectionInit = async () => {
    return storage.read(APP_NODEMCU_CFG_FILENAME)
      .then(async (data = {}) => {
        const interval = Interval.fromDateTimes(new Date(), new Date(data.expireAt))

        if (!data || !interval.isValid) {
          reset()

          return false
        }

        return Promise.resolve({ status: 200 })
        // return axios.get(`http://${data.ip}/dooraccess`)
          .then(res => {
            if (!res.status === 200) { return false }

            setConnected(true)
            setIp(data.ip)

            return true
          })
          .catch(() => false)
      })
  }

  const getMcuIp = async () => {
    return Network.getIpAddressAsync()
      .then(async deviceIp => {
        const [net] = deviceIp.split(/\.(?=\d*$)/)

        const ip = await Promise.race(
          new Array(256).fill().map((_, host) => {
            const ip = `${net}.${host + 1}`

            return new Promise((resolve, reject) => {
              return axios.get(`http://${ip}/dooraccess`)
                .then(() => resolve(ip))
                .catch(() => setTimeout(reject, 5000))
            })
          })
        ).catch(() => undefined)

        if (!ip) {
          return Promise.reject(new Error('NodeMCU not found'))
        }

        setIp(ip)

        return Promise.resolve()
      })
  }

  const connect = async ({ ssid, password }) => {
    return WifiManager.connectToProtectedSSID(APP_NODEMCU_SSID, APP_NODEMCU_PASS, false)
      .then(() =>
        axios.get(`http://${APP_NODEMCU_HOST}/ssid?ssid=${ssid}&pass=${password}`))
      .then(res => {
        if (res.status !== 200) {
          return new Error('Could not send SSID and Password to NodeMCU')
        }
      })
  }

  return (
    <ConnectionContext.Provider
      value={{ connected, ip, setIp, getMcuIp, connectionInit, connectionCheck, connect }}>
      {children}
    </ConnectionContext.Provider>
  )
}

export const useConnection = () => useContext(ConnectionContext)
