import React, { useState } from "react"
import { TouchableOpacity, View, Text } from "react-native"

import { VideoModal } from '../libs/videoPlayer'

const VideoCell = (props) => {
  const { data, idx } = props

  return (
    <View style={{
      borderBottomWidth: 1,
      borderBottomColor: 'red',
      position: 'relative',
    }}>
      <VideoModal
        statusBar={() => null}
        videoStyles={[
          idx === 0 ?
          {
            backgroundColor: 'yellow',
          } : null
        ]}
        {...data}
        autoPlay={!data.isPaused}
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
