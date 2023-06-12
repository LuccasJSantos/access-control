import { View } from 'react-native'

const Cond = ({ watch, children, className }) => {
  if (!children.find) return <View className={className}>{children}</View>

  return (
    <View className={className}>
      {children.find((c) => c.props.when === watch)}
    </View>
  )
}

// eslint-disable-next-line no-unused-vars
export const CondItem = ({ when, children, className }) => {
  return <View className={className}>{children}</View>
}

export default Cond
