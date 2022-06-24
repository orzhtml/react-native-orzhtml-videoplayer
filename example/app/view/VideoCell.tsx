import React, { useState } from "react"
import { TouchableOpacity, View, Text } from "react-native"

import { VideoModal } from '../libs/videoPlayer'

const VideoCell = (props) => {
  const { data, idx } = props

  return (
    <View style={{
      borderBottomWidth: 1,
      borderBottomColor: 'red',
      paddingVertical: 10,
      position: 'relative',
    }}>
      <VideoModal
        statusBar={() => null}
        videoStyles={{
          backgroundColor: idx === 0 ? 'yellow' : 'transparent',
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={{
          justifyContent: 'center',
          padding: 10
        }}
        onPress={() => {
          // goDetails && goDetails(data, this.progress)
        }}
      >
        <Text style={{
          fontSize: 21,
          color: 'black',
          lineHeight: 26,
          textAlign: 'justify'
        }}>{data.videoTitle}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default VideoCell
