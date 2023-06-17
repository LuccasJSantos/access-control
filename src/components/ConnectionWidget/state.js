import { useState } from 'react'

export default () => {
  const [connected] = useState(false)
  const [ip] = useState()

  return { connected, ip }
}
