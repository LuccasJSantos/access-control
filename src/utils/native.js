import { Toast } from 'native-base'
import { PermissionsAndroid } from 'react-native'

import u from '../utils'

export const requestMultiple = permissions =>
  PermissionsAndroid.requestMultiple(permissions)
    .then(u.values)
    .then(u.every(x => x === 'granted'))

export const errorHandler = error => {
  Toast.show({
    duration: 2000,
    description: error.message,
    backgroundColor: '#4CAF50'
  })
}
