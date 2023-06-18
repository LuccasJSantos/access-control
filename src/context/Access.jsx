import axios from 'axios'
import { useState, createContext, useContext } from 'react'
import { APP_ACCESS_FILENAME } from '@env'
import { DateTime } from 'luxon'
import storage from '../utils/storage'
import { useConnection } from './Connection'

const AccessContext = createContext({})

export const AccessProvider = ({ children }) => {
  const { connected, ip } = useConnection()
  const [access, setAccess] = useState([] || [])

  const requestAccessData = async () => {
    return Promise.resolve(`Mário Marques,Professor,2023-06-01T23:23:00Z
Geovanni Adan,Técnico de Informática,2023-06-01T07:29:17Z
Lael Jader de Oliveira,Aluno,2023-06-01T17:18:05Z
Júlia da Silva,Aluno,2023-06-01T22:19:04Z
Mário Marque,Professor,2023-06-14T23:18:05Z
Lael Jader de Oliveira,Aluno,2023-05-01T16:27:04Z
Luccas Josival da Silva Santos,Aluno,2023-07-01T19:23:00Z`)
    // return axios.get(`http://${ip}/access`)
      .then(data => {
        const lines = data.split('\n')
        const accessData = lines
          .map(line => line.split(','))
          .map(([name, role, date]) => ({ name, role, date: DateTime.fromISO(date) }))
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
  }

  return (
    <AccessContext.Provider
      value={{ access, requestAccessData, init }}>
      {children}
    </AccessContext.Provider>
  )
}

export const useAccess = () => useContext(AccessContext)
