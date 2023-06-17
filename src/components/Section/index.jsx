import { useNavigation } from '@react-navigation/native'
import { ArrowForwardIcon } from 'native-base'
import { Text, TouchableOpacity, View } from 'react-native'

const Section = ({ children, className, link, title }) => {
  const navigation = useNavigation()

  return (
    <View className={className}>
      <TouchableOpacity
        className="flex-row w-full items-center justify-between"
        disabled={!link?.title}
        onPress={() => navigation.navigate(link.screen)}
      >
        <Text className="text-sm text-gray-500 font-medium">{title}</Text>

        {link?.title && (
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-gray-500 font-medium">
              {link.title}
            </Text>

            <ArrowForwardIcon color="gray.500" />
          </View>
        )}
      </TouchableOpacity>

      <View className="mt-2">{children}</View>
    </View>
  )
}

export default Section
