import React from 'react'
import { View, ActivityIndicator, Text } from 'react-native'

import { lineStyles } from './styles'

function Loading ({ showLoading, videoHeight, videoWidth }: any) {
  if (!showLoading) {
    return null
  }

  return (
    <View style={[lineStyles.gFlexCenter, lineStyles.positionBar, { zIndex: 3 }]}>
      <View style={lineStyles.loadingBar}>
        <ActivityIndicator color={'#fff'} size={'large'} />
        <Text style={{ color: '#fff' }}>正在缓冲...</Text>
      </View>
    </View>
  )
}

export default Loading
