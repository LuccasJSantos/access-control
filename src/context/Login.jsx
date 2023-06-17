import axios from 'axios'
import { DateTime, Interval } from 'luxon'
import { useState, createContext, useContext } from 'react'
import {
  APP_SESSION
} from '@env'
import storage from '../utils/storage'
import { useConnection } from './Connection'

const LoginContext = createContext({})

export const LoginProvider = ({ children }) => {
  const { ip } = useConnection()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')

  const requestAuthentication = async () => {
    return Promise.resolve('5ABfaBEg42f,EB5A42CE,Luccas Josival da Silva Santos')
    // return axios.get(`http://${ip}/login`)
      .then(data => {
        const [session, id, username] = data.split(',')

        setSessionId(session)
        setUserId(id)
        setUsername(username)

        return storage.write(APP_SESSION, {
          username,
          sessionId: session,
          userId: id,
          expireAt: DateTime.now().plus({ seconds: 30 })
        })
      })
      .catch(() => {
        throw new Error('Tente novamente')
      })
  }

  const login = async () => {
    return storage.read(APP_SESSION)
      .then((data) => {
        const interval = Interval.fromDateTimes(new Date(), new Date(data.expireAt))

        if (!interval.isValid) {
          return { valid: false, message: 'Sessão expirada' }
        }

        setUserId(data.id)
        setSessionId(data.session)
        setUsername(data.name)

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
      value={{ sessionId, userId, username, requestAuthentication, login }}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLogin = () => useContext(LoginContext)
