import React, { useEffect, useRef, useMemo, memo } from "react"
import { TouchableOpacity, View, Text } from "react-native"

import { VideoModal } from '../libs/videoPlayer'
import { screenWidth } from "../common/Utils"

const VideoCell = (props) => {
  const { data, idx, isPaused, stopOtherPlayer } = props
  const _videoModalRef = useRef<any>(null)
  const _initRef = useRef(false)

  useEffect(() => {
    if (isPaused && _initRef.current) {
      _videoModalRef.current && _videoModalRef.current.onStopListPlay()
    }
    _initRef.current = true
  }, [isPaused])

  // 播放状态回调
  const _onPlay = (isPaused) => {
    if (!isPaused) {
      stopOtherPlayer && stopOtherPlayer(data.newsId)
    }
  }

  return useMemo(() => {
    return (
      <View style={{
        borderBottomWidth: 1,
        borderBottomColor: 'red',
        position: 'relative',
        paddingHorizontal: 10,
      }}>
        <VideoModal
          {...data}
          ref={_videoModalRef}
          statusBar={() => null}
          autoPlay={!data.isPaused}
          onPlay={_onPlay}
          videoBarRadius={10}
          videoMaxWidth={screenWidth - 20}
        />
        <View
          // activeOpacity={1}
          style={{
            justifyContent: 'center',
            paddingVertical: 10
          }}
        // onPress={() => {
        //   // goDetails && goDetails(data, this.progress)
        // }}
        >
          <Text style={{
            fontSize: 18,
            color: 'black',
            lineHeight: 26,
            textAlign: 'justify'
          }}>{data.videoTitle}</Text>
        </View>
      </View>
    )
  }, [data])
}

export default VideoCell