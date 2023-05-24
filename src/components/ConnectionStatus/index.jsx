import { Feather } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import useState from './state'

const ConnectionStatus = ({ className }) => {
  const { connected } = useState()

  return (
    <View className={`flex-row items-center gap-3 ml-[-8px] ${className}`}>
      {connected ? (
        <Text className="text-xs text-[#53BD21]">Online</Text>
      ) : (
        <Text className="text-xs text-[#E50014]">Offline</Text>
      )}

      {connected ? (
        <Feather name="wifi" color="#53BD21" size={12} />
      ) : (
        <Feather name="wifi-off" color="#E50014" size={12} />
      )}
    </View>
  )
}

export default ConnectionStatus
