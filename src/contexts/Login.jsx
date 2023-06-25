import axios from 'axios'
import { DateTime, Interval } from 'luxon'
import { useState, createContext, useContext } from 'react'
import {
  APP_SESSION_FILENAME
} from '@env'
import storage from '../utils/storage'
import { useConnection } from './Connection'

const LoginContext = createContext({})

export const LoginProvider = ({ children }) => {
  const { ip } = useConnection()
  const [access, setAccess] = useState(0)
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('')

  const requestAuthEnable = async () => axios.get(`http://${ip}/login`)

  const requestAuth = async () => {
    return new Promise((resolve, reject) => {
    // return Promise.resolve('5ABfaBEg42f,EB5A42CE,Luccas Josival da Silva Santos')
      const recurse = () => {
        return axios.get(`http://${ip}/login_rfid`)
          .then(res => {
            if (res.status === 204) {
              return setTimeout(recurse, 2000)
            }

            const [id, access, name, role, session] = res.data.split(',')

            setAccess(access)
            setSessionId(session)
            setUserId(id)
            setUsername(name)
            setRole(role)

            return resolve(storage.write(APP_SESSION_FILENAME, {
              name,
              access,
              role,
              sessionId: session,
              userId: id,
              expireAt: DateTime.now().plus({ weeks: 1 })
            }))
          })
          .catch(() => reject(new Error('Tente novamente')))
      }

      return recurse()
    })
  }

  const login = async () => {
    return storage.read(APP_SESSION_FILENAME)
      .then((data) => {
        const interval = Interval.fromDateTimes(new Date(), new Date(data.expireAt))

        if (!interval.isValid) {
          return { valid: false, message: 'Sessão expirada' }
        }

        setAccess(data.access)
        setSessionId(data.session)
        setUserId(data.id)
        setUsername(data.name)
        setRole(data.role)

        storage.write(APP_SESSION_FILENAME, {
          name: data.name,
          access: data.access,
          role: data.role,
          sessionId: data.session,
          userId: data.id,
          expireAt: DateTime.now().plus({ weeks: 1 })
        })

        return { valid: true, message: 'Usuário autenticado!' }
      })
      .catch((error) => {
        if (error.message.includes('ENOENT')) {
          throw new Error('Realize a configuração de login inicial')
        }
      })
  }

  return (
    <LoginContext.Provider
      value={{ sessionId, userId, access, role, username, requestAuth, requestAuthEnable, login }}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLogin = () => useContext(LoginContext)
