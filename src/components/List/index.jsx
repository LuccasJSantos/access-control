import { Box, Divider, FlatList } from 'native-base'
import { View } from 'react-native'

const List = ({ items, render }) => {
  return <Box rounded="lg" className="bg-white px-1.5">
    <FlatList
      data={items}
      renderItem={({ item, index }) => {
        return (
          <View>
            {render(item, index, items)}
            {index < items.length - 1 && (
              <Divider className="bg-gray-100" />
            )}
          </View>
        )
      }}
    />
  </Box>
}

export default List
