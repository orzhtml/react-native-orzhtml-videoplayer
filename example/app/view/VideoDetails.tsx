import React, { useEffect, useState } from "react"
import { ScrollView, View, Text, TouchableOpacity } from "react-native"

import { defaultVideoHeight, screenHeight, screenWidth, statusBarHeight } from '../common/Utils'
import { VideoModal } from '../libs/videoPlayer'

const VideoDetails = (props: any) => {
  const [state, setState] = useState<any>({
    videoUrl: null,
    poster: null,
    videoTitle: null,
    autoPlay: false
  })
  const { navigation } = props

  useEffect(() => {
    setTimeout(() => {
      setState({
        ...state,
        videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
        poster: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
        videoTitle: '这是可全屏的播放组件'
      })
    }, 1500)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ height: statusBarHeight }} /> */}
      <VideoModal {...state} navigation={navigation} />
      <ScrollView>
        <Text>{state.videoTitle}</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
      </ScrollView>
    </View>
  )
}

export default VideoDetails
