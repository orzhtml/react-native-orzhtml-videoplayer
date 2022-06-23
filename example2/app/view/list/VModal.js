import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'

import { VideoModal } from '../../../video-player'

class VModal extends Component {
  constructor (props) {
    super(props)
    const { params } = props.route
    this.state = {
      videoUrl: params.videoUrl,
      videoImage: params.videoImage,
      videoTitle: params.videoTitle,
      autoPlay: true,
      modalFull: true
    }
  }

  _onLoadVideoModal = (data, screen) => {
    console.log('_onLoadVideoModal')
    const { params } = this.props.route
    const { modalFull } = this.state
    if (modalFull && screen === 'full') {
      this.videoModal && this.videoModal.onFullUpdateVideo({
        seekTime: Math.max(0, params.currentTime - 1),
        buffer: Math.max(0, params.playableDuration),
        paused: false
      })
    } else {
      this.videoModal && this.videoModal.onSmallUpdateVideo({
        seekTime: Math.max(0, params.currentTime - 1),
        buffer: Math.max(0, params.playableDuration),
        paused: false
      })
    }
  }

  _onEnd = (screen) => {
    console.log('_onEnd screen:', screen)
    if (screen === 'full') {
      this.videoModal && this.videoModal.onFullScreen(false)
    }
  }

  render () {
    const { navigation } = this.props
    const { videoUrl, videoImage, videoTitle, autoPlay, modalFull } = this.state

    return (
      <View style={{ flex: 1 }}>
        {
          videoUrl ? (
            <VideoModal
              ref={v => (this.videoModal = v)}
              videoUrl={videoUrl}
              // statusBarTrans={true}
              videoTitle={videoTitle}
              autoPlay={autoPlay}
              poster={videoImage}
              onBackButton={() => {
                navigation.goBack()
              }}
              navigation={navigation}
              modalFull={modalFull}
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

export default VModal
