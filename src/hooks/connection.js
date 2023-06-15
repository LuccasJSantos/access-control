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
import axios from 'axios'

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
        console.log('Connection init error:', { error })
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

        const ip = await Promise.race(
          new Array(256).fill().map((_, host) => {
            const ip = `${net}.${host + 1}`
            console.log({ ip })

            return new Promise((resolve, reject) => {
              return axios.get(`http://${ip}/dooraccess`)
                .then(res => {
                  console.log(res.status, res.data)

                  return resolve(res.status === 200 ? ip : '')
                })
                .catch(() => setTimeout(reject, 10000))
            })
          })
        )

        if (!ip) {
          return Promise.reject(new Error('NodeMCU not found'))
        }

        console.log({ ip })

        return Promise.resolve(ip)
      })
  }

  const connect = async ({ ssid, password }) => {
    console.log(`Connecting: ${APP_NODEMCU_SSID} : ${APP_NODEMCU_PASS}`)
    // return fetch({
    //   method: 'POST',
    //   url: `http://${APP_NODEMCU_HOST}/?ssid=${ssid}&pass=${password}`
    // })
    return WifiManager.connectToProtectedSSID(APP_NODEMCU_SSID, APP_NODEMCU_PASS, false)
      .then(status => {
        console.log({ status })

        return axios.get(`http://${APP_NODEMCU_HOST}/ssid?ssid=${ssid}&pass=${password}`)
      })
      .then(res => {
        console.log('Status', res.status)
        console.log('Sent SSID and PASS =============')
        console.log(res.data)
      })
      .catch(error => {
        console.log('Erro')
        console.log(error.message)
      })
      // .then(getMcuIp)
      // .then(connectionCheck)
      // .then((result) => {
      //   if (!result) return

    //   setSsid(ssid)
    //   setPass(password)
    // })
  }

  useEffect(() => { connectionCheck() }, [ip])

  return { connected, ip, ssid, getMcuIp, connectionInit, connectionCheck, connect }
}

export default useConnection
