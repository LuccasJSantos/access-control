import { View } from 'react-native'

const Cond = ({ watch, children, className }) => {
  if (!children.find) return <>{children}</>

  return (
    <View className={className}>
      {children.find((c) => c.props.when === watch)}
    </View>
  )
}

export const CondItem = ({ when, children, className }) => {
  return <View className={className}>{children}</View>
}

export default Cond
