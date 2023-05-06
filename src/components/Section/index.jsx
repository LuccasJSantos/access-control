import { ArrowForwardIcon } from 'native-base'
import { Text, TouchableOpacity, View } from 'react-native'

function Section({ children, className, link, title }) {
  return (
    <View className={className}>
      <TouchableOpacity className="flex-row w-full items-center justify-between">
        <Text className="text-sm text-gray-500 font-medium">{title}</Text>

        {link?.title && (
          <View className="flex-row items-center gap-2">
            <Text className="text-[10px] text-gray-500 font-medium">
              {link.title}
            </Text>

            <ArrowForwardIcon color="gray.500" />
          </View>
        )}
      </TouchableOpacity>

      <View className="mt-3">{children}</View>
    </View>
  )
}

export default Section
