import axios from 'axios'
import { useState, createContext, useContext } from 'react'
import { APP_ACCESS_FILENAME } from '@env'
import { DateTime } from 'luxon'
import storage from '../utils/storage'
import { useConnection } from './Connection'
import { useLogin } from './Login'

const AccessContext = createContext({})

export const AccessProvider = ({ children }) => {
  const { connected, ip } = useConnection()
  const { id, sessionId } = useLogin()
  const [access, setAccess] = useState([] || [])

  const requestAccessData = async () => {
//     return Promise.resolve(`0,0,ABCDEF141,Mário Marques,professor,,
// 0,0,ABCDEF124,Geovanni Adan,it,,
// 0,1,ABCDEF125,Lael Jader de Oliveira,student,,
// 0,13,ABCDEF126,Júlia da Silva,student,,
// 0,10,ABCDEF121,Mário Marque,professor,,
// 0,11,ABCDEF119,Lael Jader de Oliveira,student,,
// 0,12,ABCDEF118,Luccas Josival da Silva Santos,student,,`)
    return axios.get(`http://${ip}/logs`, {
      headers: {
        'X-RFID': id,
        Authorization: `Basic ${btoa(`${id}:${sessionId}`)}`
      }
    })
      .then(data => {
        const lines = data.split('\n')
        const accessData = lines
          .map(line => line.split(','))
          .map(([date, action, id, name, role, idAdmin, nameAdmin]) => ({
            date: DateTime.fromMillis(Number(date)),
            action: Number(action),
            id,
            name,
            role,
            idAdmin,
            nameAdmin
          }))
          .sort((a, b) => b.date.toMillis() < a.date.toMillis() ? -1 : 1)

        setAccess(accessData)

        return storage.write(APP_ACCESS_FILENAME, accessData)
      })
      .catch(() => {
        throw new Error('Não foi possível coletar os dados de acesso')
      })
  }

  const init = async () => {
    const data = await storage.read(APP_ACCESS_FILENAME)
      .catch(error => error)

    if (data && !connected) {
      const dataFormatted = data.map(item => Object.assign({}, item, { date: DateTime.fromISO(item.date) }))
      setAccess(dataFormatted)
      return Promise.resolve()
    }

    return requestAccessData()
      .catch(error => {
        if (data) {
          const dataFormatted = data.map(item => Object.assign({}, item, { date: DateTime.fromISO(item.date) }))
          setAccess(dataFormatted)
          throw new Error(`${error.message}. Utilizando dados salvos`)
        }
      })
  }

  return (
    <AccessContext.Provider
      value={{ access, requestAccessData, init }}>
      {children}
    </AccessContext.Provider>
  )
}

export const useAccess = () => useContext(AccessContext)
