import React from 'react'
import {
  View,
  ActivityIndicator,
  Text,
} from 'react-native'

function Loading ({ showLoading, videoHeight, videoWidth }) {
  console.log('Loading showLoading:', showLoading)
  if (!showLoading) {
    return null
  }

  return (
    <View
      style={{
        // backgroundColor: 'rgba(255,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        zIndex: 3,
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          paddingHorizontal: 10,
          paddingVertical: 11,
          borderRadius: 6,
        }}
      >
        <ActivityIndicator color={'#fff'} size={'large'} />
        <Text style={{ color: '#fff' }}>正在缓冲...</Text>
      </View>
    </View>
  )
}

export default Loading
