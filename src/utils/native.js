import { PermissionsAndroid } from 'react-native'
import u from '../utils'

export const requestMultiple = permissions =>
  PermissionsAndroid.requestMultiple(permissions)
    .then(u.values)
    .then(u.every(x => x === 'granted'))
