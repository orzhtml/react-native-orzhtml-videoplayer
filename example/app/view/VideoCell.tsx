import React, { useState } from "react"
import { TouchableOpacity, View, Text } from "react-native"

import { defaultVideoHeight, screenWidth } from '../common/Utils'
import { VideoPlayer } from '../libs/videoPlayer'

const VideoCell = (props) => {
  const { data, idx, onFullScreen } = props

  return (
    <View style={{
      borderBottomWidth: 1,
      borderBottomColor: 'red',
      paddingVertical: 10,
      position: 'relative',
    }}>
      <View style={{
        backgroundColor: '#0ff',
        width: screenWidth,
        height: defaultVideoHeight
      }}>
        <VideoPlayer
          statusBar={() => { }}
          statusHeight={() => 0}
          videoStyles={{
            backgroundColor: idx === 0 ? 'yellow' : 'transparent',
          }}
          onFullScreen={onFullScreen}
        />
      </View>
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
