import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'

import { VideoPlayer } from '../../../video-player'

class ListDls extends Component {
  constructor (props) {
    super(props)

    const { params } = props.route
    console.log('params:', params)

    this.state = {
      videoUrl: params.videoUrl,
      videoImage: params.videoImage,
      videoTitle: params.videoTitle,
      autoPlay: false
    }
  }

  _onLoadVideoModal = () => {
    console.log('_onLoadVideoModal')
    const { params } = this.props.route
    this.VideoPlayer && this.VideoPlayer.updateVideo({
      seekTime: Math.max(0, params.currentTime - 1),
      buffer: Math.max(0, params.playableDuration),
      paused: false
    })
  }

  _onEnd = (screen) => {
    console.log('_onEnd screen:', screen)
    if (screen === 'full') {
      this.VideoPlayer && this.VideoPlayer.onFullScreen(false)
    }
  }

  render () {
    const { navigation } = this.props
    const { videoUrl, videoImage, videoTitle, autoPlay } = this.state

    return (
      <View style={{ flex: 1 }}>
        {
          videoUrl ? (
            <VideoPlayer
              ref={v => (this.VideoPlayer = v)}
              videoUrl={videoUrl}
              // statusBarTrans={true}
              videoTitle={videoTitle}
              autoPlay={autoPlay}
              poster={videoImage}
              onBackButton={() => {
                navigation.goBack()
              }}
              navigation={navigation}
              // isFullScreen={true}
              showPoster={false}
              showMinTitle={true}
              muted={true}
              showMuted={true}
              onLoad={this._onLoadVideoModal}
              onEnd={this._onEnd}
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

export default ListDls
