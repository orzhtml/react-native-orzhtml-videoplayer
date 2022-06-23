import React, { useState } from "react"
import { View, Text, ScrollView } from 'react-native'

const VModal = (props: any) => {
  const { params } = props.route
  const [state, setState] = useState({
    videoUrl: params.videoUrl,
    videoImage: params.videoImage,
    videoTitle: params.videoTitle,
    autoPlay: true,
    modalFull: true
  })

  return (
    <View />
  )
}

export default VModal
