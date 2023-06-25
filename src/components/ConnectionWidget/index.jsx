import { Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useConnection } from '../../contexts/Connection'

const Widget = ({ className }) => {
  const { connected } = useConnection()

  return (
    <View className={`flex-row items-center gap-3 ml-[-7px] ${className}`}>
      {connected
        ? (<Text className="text-xs text-[#53BD21]">Online</Text>)
        : (<Text className="text-xs text-[#E50014]">Offline</Text>)
      }

      {connected
        ? (<Feather name="wifi" color="#53BD21" size={12} />)
        : (<Feather name="wifi-off" color="#E50014" size={12} />)}
    </View>
  )
}

export default Widget
