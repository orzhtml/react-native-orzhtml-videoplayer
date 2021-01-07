import React from 'react'
import {
  View,
  Modal
} from 'react-native'

import VideoPlayer from './VideoPlayer'

class VideoModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fullScreen: false
    }
    this.seekTime = 0
    this.buffer = 0
    this.paused = null
  }

  onStopPlay = () => {
    console.log('VideoModal onStopPlay')
    this.videoPlayer && this.videoPlayer.onStopPlay()
  }

  onStopListPlay = () => {
    this.videoPlayer && this.videoPlayer.onStopListPlay()
  }

  onChangeFullScreen = ({ screen, seekTime, buffer, paused }) => {
    this.seekTime = seekTime
    this.buffer = buffer
    this.paused = paused
    if (screen === 'full') {
      console.log('lockToPortrait:', 'full', seekTime, buffer)
      this.videoPlayer && this.videoPlayer.onStopPlay()
      this.setState({
        fullScreen: true
      })
    } else {
      this.setState({
        fullScreen: false
      }, () => {
        console.log('lockToPortrait:', 'small', seekTime, buffer)
        this.videoPlayer && this.videoPlayer.updateVideo({
          seekTime: Math.max(0, seekTime - 1),
          buffer,
          paused: paused
        })
      })
    }
  }

  _onLoadVideoModal = () => {
    this.videoModal && this.videoModal.updateVideo({
      seekTime: Math.max(0, this.seekTime - 1),
      buffer: this.buffer,
      paused: this.paused
    })
  }

  render () {
    const { fullScreen } = this.state

    return (
      <View style={{}}>
        <VideoPlayer
          {...this.props}
          ref={ref => this.videoPlayer = ref}
          onChangeFullScreen={this.onChangeFullScreen}
          // 启用模态全屏模式
          isModal={true}
        />
        <Modal
          visible={fullScreen}
          transparent={true}
          supportedOrientations={['portrait', 'landscape']}
          hardwareAccelerated={true}
        >
          <VideoPlayer
            {...this.props}
            ref={ref => this.videoModal = ref}
            isFullScreen={true}
            showPoster={false}
            autoPlay={false}
            paddingX={0}
            // 协调局部、全屏播放进度
            onChangeFullScreen={this.onChangeFullScreen}
            onLoad={this._onLoadVideoModal}
          />
        </Modal>
      </View>
    )
  }
}

export default VideoModal
