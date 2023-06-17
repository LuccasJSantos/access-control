import { Box, Divider, FlatList } from 'native-base'
import { Text, View } from 'react-native'

const List = ({ items, render, footerText }) => {
  const NoData = () => (
    <Text className="text-center font-medium py-4 text-gray-500">Sem dados no momento</Text>
  )

  return <View>
    <Box rounded="lg" className="bg-white px-1.5">
      {
      !items.length
        ? <NoData />
        : <FlatList
          data={items}
          renderItem={({ item, index }) => {
            return (
              <View key={index}>
                {render(item, index, items)}
                {index < items.length - 1 && (
                  <Divider className="bg-gray-100" />
                )}
              </View>
            )
          }}
        />
      }
    </Box>
    {
      footerText &&
      <View className="flex-row w-full justify-end pt-1">
        <Text className="flex text-gray-500 text-xs text-right">
          {footerText}
        </Text>
      </View>
    }
  </View>
}

export default List
