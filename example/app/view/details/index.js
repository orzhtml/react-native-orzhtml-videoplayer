import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'

import { VideoPlayer } from '../../../video-player'

class VideoDetails extends Component {
  constructor (props) {
    super(props)

    this.state = {
      // videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
      // videoImage: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
      // videoTitle: '这是可全屏的播放组件',
      videoUrl: null,
      videoImage: null,
      videoTitle: null,
      autoPlay: false
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        videoUrl: 'http://cloudvideo.thepaper.cn/video/9c5064f53cc649a181915c0d5d5eb7dd/hd/a4602300-6a38-4f02-900f-ef5cdc565715-359f2dfc-950c-1ba3-1211-e9ee0ec6b15c.mp4',
        videoImage: 'https://imagecloud.thepaper.cn/thepaper/image/106/984/413.png?x-oss-process=style/app750-280',
        videoTitle: '女子手卡绞肉机，正献血消防员飞奔出警',
      })
    }, 3000)
  }

  render () {
    const { navigation, route } = this.props
    const { videoUrl, videoImage, videoTitle, autoPlay } = this.state
    console.log('route:', route.params)
    return (
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        {
          videoUrl ? (
            <VideoPlayer
              ref={v => (this.VideoPlayer = v)}
              videoUrl={videoUrl}
              statusBarTrans={true}
              videoTitle={videoTitle}
              autoPlay={true}
              poster={videoImage}
              onBackButton={() => {
                navigation.goBack()
              }}
              navigation={navigation}
            // isFullScreen={true}
            />
          ) : null
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
}

export default VideoDetails
