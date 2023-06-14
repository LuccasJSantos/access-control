import * as Network from 'expo-network'
import WifiManager from 'react-native-wifi-reborn'
import { useState } from 'react'
import storage from '../utils/storage'
import { Interval } from 'luxon'
import { useEffect } from 'react'

import { 
  APP_NODEMCU_CFG_FILENAME,
  APP_NODEMCU_SSID,
  APP_NODEMCU_PASS,
  APP_NODEMCU_HOST,
  APP_NODEMCU_PORT,
  APP_NODEMCU_CONNECTION_EXPIRE,
} from '@env'

/*
const Data = {
}
*/

const useConnection = () => {
  const [ connected, setConnected ] = useState(undefined)
  const [ ip, setIp ] = useState('')
  const [ ssid, setSsid ] = useState('')
  const [ pass, setPass ] = useState('')
  const [ expire, setExpire ] = useState('')
  const endpoint = ip ? `http://${ip}` : ''

  console.log({ endpoint })

  const connectionCheck = async (ip) => {
    return await fetch(`${endpoint}?dooraccess=1`)
    // return Promise.resolve({ status: 200 })
      .then((res) => (res.status === 200))
      .then((conn) => {
        if (!conn) {
          setConnected(false)
          setIp('')
          setSsid('')
          setPass('')
          setExpire('')

          return false
        }

        setConnected(true)
        setIp(ip)
        setSsid(conn.ssid)
        setPass(conn.pass)
        setExpire(conn.expire)
        
        return true
      })
      .catch(error => {
        setConnected(false)
        console.log('Connection init error:\n', { error })
      })
  }

  const connectionInit = async () => {
    return storage.read(APP_NODEMCU_CFG_FILENAME)
      .then((data = {}) => {
        const interval = Interval.fromDateTimes(new Date(), new Date(data.expire))

        if (!data || !interval.isValid) {
          setConnected(false)
          setIp('')
          setSsid('')
          setPass('')
          setExpire('')

          return false
        }

        setConnected(true)
        setIp(data.ip)
        setSsid(data.ssid)
        setPass(data.pass)
        setExpire(data.expire)

        return true
      })
  }

  const getMcuIp = () => {
    return Network.getIpAddressAsync()
      .then(async deviceIp => {
        const [net] = deviceIp.split(/\.(?=\d*$)/)

        const lookup = await Promise.all(
          new Array(10).fill().map(async (_, host) => {
            const ip = `${net}.${host}`

            return await connectionCheck(ip)
          })
        )

        const ip = lookup.find(Boolean) || ''

        if (!ip.length) {
          return Promise.reject(new Error('NodeMCU not found'))
        }

        return Promise.resolve(ip)
      })
  }

  const connect = async () => {
    return WifiManager.connectToProtectedSSID(APP_NODEMCU_SSID, APP_NODEMCU_PASS, true)
      .then(() => fetch({
        method: 'POST',
        url: `http://${APP_NODEMCU_HOST}:${APP_NODEMCU_PORT}/?ssid=${ssid}&pass=${pass}`
      }))
      .then(getMcuIp)
      .then(connectionCheck)
      .catch(console.error)
  }

  useEffect(() => { connectionCheck() }, [ip])

  return { connected, ip, ssid, connectionInit, connectionCheck, connect }
}

export default useConnection
