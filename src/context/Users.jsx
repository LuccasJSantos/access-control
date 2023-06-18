import axios from 'axios'
import { useState, createContext, useContext } from 'react'
import { APP_USERS_FILENAME } from '@env'
import { DateTime } from 'luxon'
import storage from '../utils/storage'
import { useConnection } from './Connection'

const UsersContext = createContext({})

export const UsersProvider = ({ children }) => {
  const { connected, ip } = useConnection()
  const [users, setUsers] = useState([] || [])

  const requestUsersData = async () => {
    return Promise.resolve(`Mário Marques,Professor,2023-06-02T23:23:00Z
Geovanni Adan,Técnico de Informática,2023-06-07T07:29:17Z
Júlia da Silva,Aluno,2023-06-01T22:19:04Z
Lael Jader de Oliveira,Aluno,2023-06-11T16:27:53Z
Arnaldo Marcos dos Santos,Aluno,2023-05-03T19:23:00Z
Rita de Cássio,Professor,2023-05-24T19:32:46Z
Filipe de Souza,Coordenador,2023-04-13T19:35:16Z
Márcia Ferreira de Calle,Limpeza,2023-05-25T19:13:07Z
Flávio Pereira da Silva,Limpeza,2023-06-10T21:17:32Z
Ivan Cardoso Machado,Aluno,2023-04-22T15:16:14Z
Lucas Kan Toshiba,Aluno,2023-05-25T19:13:07Z`)
    // return axios.get(`http://${ip}/users`)
      .then(data => {
        const lines = data.split('\n')
        const usersData = lines
          .map(line => line.split(','))
          .map(([name, role, date]) => ({ name, role, date: DateTime.fromISO(date) }))
          .sort((a, b) => b.date.toMillis() < a.date.toMillis() ? -1 : 1)

        setUsers(usersData)

        return storage.write(APP_USERS_FILENAME, usersData)
      })
      .catch(() => {
        throw new Error('Não foi possível coletar os dados de usuários')
      })
  }

  const init = async () => {
    const data = await storage.read(APP_USERS_FILENAME)
      .catch(error => error)

    if (data && !connected) {
      const dataFormatted = data.map(item => Object.assign({}, item, { date: DateTime.fromISO(item.date) }))
      setUsers(dataFormatted)
      return Promise.resolve()
    }

    return requestUsersData()
      .catch(error => {
        if (data) {
          const dataFormatted = data.map(item => Object.assign({}, item, { date: DateTime.fromISO(item.date) }))
          setUsers(dataFormatted)
          throw new Error(`${error.message}. Utilizando dados salvos`)
        }
      })
  }

  return (
    <UsersContext.Provider
      value={{ users, requestUsersData, init }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => useContext(UsersContext)
