import axios from 'axios'
import { useState, createContext, useContext } from 'react'
import { APP_USERS_FILENAME } from '@env'
import { DateTime } from 'luxon'
import { encode } from 'base-64'
import storage from '../utils/storage'
import { useConnection } from './Connection'
import { useLogin } from './Login'

const UsersContext = createContext({})

export const UsersProvider = ({ children }) => {
  const { connected, ip } = useConnection()
  const { userId, sessionId } = useLogin()
  const [users, setUsers] = useState([] || [])

  const requestUsersData = async () => {
    //     return Promise.resolve(`AE2A5BC4,2,Mário Marques,professor,0
    // AE2A5BC4,3,Geovanni Adan,it,0
    // AE2A5BC4,1,Júlia da Silva,student,0
    // AE2A5BC4,1,Lael Jader de Oliveira,student,0
    // AE2A5BC4,1,Arnaldo Marcos dos Santos,student,0
    // AE2A5BC4,2,Rita de Cássio,professor,0
    // AE2A5BC4,2,Filipe de Souza,coordinator,0
    // AE2A5BC4,0,Márcia Ferreira de Calle,cleaner,0
    // AE2A5BC4,1,Flávio Pereira da Silva,cleaner,0
    // AE2A5BC4,1,Ivan Cardoso Machado,student,0
    // AE2A5BC4,1,Lucas Kan Toshiba,student,0`)
    return axios.get(`http://${ip}/users`, {
      headers: {
        'X-RFID': userId,
        Authorization: 'Basic ' + encode(`${userId}:${sessionId}`)
      }
    })
      .then(res => {
        const lines = res.data.split('\n')
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
          .filter(user => user.access !== 0)
          .filter(user => Boolean(user.card))

        setUsers(usersData)

        return storage.write(APP_USERS_FILENAME, usersData)
      })
      .catch(error => {
        console.error(error)
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
        if (!data.message) {
          const dataFormatted = data.map(item => Object.assign({}, item, { date: DateTime.fromISO(item.date) }))
          setUsers(dataFormatted)
          throw new Error(`${error.message}. Utilizando dados salvos`)
        }

        throw new Error('Erro ao buscar usuários')
      })
  }

  const deleteUser = async rfid => {
    return axios.get(`http://${ip}/user_del?rfid=${rfid}`, {
      headers: {
        'X-RFID': userId,
        Authorization: 'Basic ' + encode(`${userId}:${sessionId}`)
      }
    })
      .then(() => true)
      .catch(() => {
        throw new Error('Não foi possível deletar o usuário')
      })
  }

  const registerUser = async ({ name, role, moderator }) => {
    console.log(`http://${ip}/user_regedit?name=${name}&role=${role}&mod=${Number(moderator)}`)
    return axios.get(`http://${ip}/user_regedit?name=${name}&role=${role}&mod=${Number(moderator)}`, {
      headers: {
        'X-RFID': userId,
        Authorization: 'Basic ' + encode(`${userId}:${sessionId}`)
      }
    })
      .then(() => {
        console.log('registro')
        return new Promise((resolve, reject) => {
          const recurse = () => {
            return axios.get(`http://${ip}/user_regedit_rfid`, {
              headers: {
                'X-RFID': userId,
                Authorization: 'Basic ' + encode(`${userId}:${sessionId}`)
              }
            })
              .then(res => {
                console.log(res.status)
                if (res.status === 204) {
                  return setTimeout(recurse, 2000)
                }

                resolve()
              })
              .catch(reject)
          }

          recurse()
        })
      })
      .catch(error => {
        console.log(error.message)
        throw new Error('Erro registrar usuário')
      })
  }

  const editUser = async ({ card, name, role, moderator }) => {
    return axios.get(`http://${ip}/user_regedit?rfid=${card}&name=${name}&role=${role}&mod=${Number(moderator)}`, {
      headers: {
        'X-RFID': userId,
        Authorization: 'Basic ' + encode(`${userId}:${sessionId}`)
      }
    }).catch(() => {
      throw new Error('Erro ao alterar usuário')
    })
  }

  return (
    <UsersContext.Provider
      value={{ users, requestUsersData, init, registerUser, editUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => useContext(UsersContext)
