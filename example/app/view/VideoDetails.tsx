import React, { useEffect, useState } from "react"
import { ScrollView, View, Text } from "react-native"

const VideoDetails = (props: any) => {
  const [state, setState] = useState<any>({
    videoUrl: null,
    videoImage: null,
    videoTitle: null,
    autoPlay: false
  })
  const { navigation } = props

  useEffect(() => {
    setTimeout(() => {
      setState({
        ...state,
        videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
        videoImage: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
        videoTitle: '这是可全屏的播放组件'
      })
    }, 1500)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {
        // videoUrl ? (
        //   <VideoPlayer
        //     ref={v => (this.VideoPlayer = v)}
        //     videoUrl={videoUrl}
        //     // statusBarTrans={true}
        //     videoTitle={videoTitle}
        //     autoPlay={autoPlay}
        //     poster={videoImage}
        //     onBackButton={() => {
        //       navigation.goBack()
        //     }}
        //     navigation={navigation}
        //     // isFullScreen={true}
        //     showMinTitle={true}
        //     muted={true}
        //     showMuted={true}
        //   />
        // ) : null
      }
      <ScrollView>
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
