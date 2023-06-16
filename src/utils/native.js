import { PermissionsAndroid } from 'react-native'

export const requestPermission = ({ permission, title, message }) => 
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS[permission],
    {
      title,
      message,
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    }
  ).then((granted) => granted === PermissionsAndroid.RESULTS.GRANTED)
