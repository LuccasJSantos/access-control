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
    return Promise.resolve(`AE2A5BC4,2,Mário Marques,professor,0
AE2A5BC4,3,Geovanni Adan,it,0
AE2A5BC4,1,Júlia da Silva,student,0
AE2A5BC4,1,Lael Jader de Oliveira,student,0
AE2A5BC4,1,Arnaldo Marcos dos Santos,student,0
AE2A5BC4,2,Rita de Cássio,professor,0
AE2A5BC4,2,Filipe de Souza,coordinator,0
AE2A5BC4,0,Márcia Ferreira de Calle,cleaner,0
AE2A5BC4,1,Flávio Pereira da Silva,cleaner,0
AE2A5BC4,1,Ivan Cardoso Machado,student,0
AE2A5BC4,1,Lucas Kan Toshiba,student,0`)
    // return axios.get(`http://${ip}/users`)
      .then(data => {
        const lines = data.split('\n')
        const usersData = lines
          .map(line => line.split(','))
          .map(([card, access, name, role, session]) => ({ 
            card, 
            session, 
            name, 
            role, 
            moderator: Number(access) === 2, 
            access: Number(access) 
          }))

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

  const awaitAdminCard = async () => {
    return new Promise((res, rej) => {
      setTimeout(res, 1000)
    })
    return Promise.resolve()
    // return axios.get(`http://${ip}/user-register?admin`)
      .then((admin_code = 'admin') => {
        return Promise.resolve() 
      })
      .catch(error => error)
  }

  const awaitUserCard = async () => {
    return new Promise((res, rej) => {
      setTimeout(() => res('E4FA234DC'), 1000)
    })
    return Promise.resolve()
    // return axios.get(`http://${ip}/user-register?user`)
      .then(userCard => userCard)
      .catch(error => error)
  }

  const sendForm = async () => {
    return Promise.resolve()
  }

  return (
    <UsersContext.Provider
      value={{ users, requestUsersData, init, awaitAdminCard, awaitUserCard, sendForm }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => useContext(UsersContext)
