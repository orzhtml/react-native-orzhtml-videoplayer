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
      fullScreen: props.modalFull || false
    }
    this.seekTime = 0
    this.buffer = 0
    this.paused = null
  }

  _onLoadVideo = (data) => {
    const { onLoad } = this.props
    onLoad && onLoad(data, 'small')
  }

  _onLoadVideoModal = (data) => {
    const { onLoad } = this.props
    this.videoModal && this.videoModal.updateVideo({
      seekTime: Math.max(0, this.seekTime - 1),
      buffer: this.buffer,
      paused: this.paused
    })
    onLoad && onLoad(data, 'full')
  }

  _onChangeFullScreen = ({ screen, seekTime, buffer, paused }) => {
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
          seekTime: Math.max(0, seekTime),
          buffer,
          paused: paused
        })
      })
    }
  }

  _onEnd = (screen, seekTime, buffer) => {
    const { onEnd } = this.props
    this.seekTime = seekTime
    this.buffer = buffer
    this.paused = true

    onEnd && onEnd(screen, seekTime, buffer)
  }

  onSmallUpdateVideo = (options) => {
    this.videoPlayer && this.videoPlayer.updateVideo(options)
  }

  setSmallMuted = (muted) => {
    this.videoPlayer && this.videoPlayer.setMuted(muted)
  }

  setSmallRate = (rate) => {
    this.videoPlayer && this.videoPlayer.setRate(rate)
  }

  onSmallStopPlay = () => {
    this.videoPlayer && this.videoPlayer.onStopPlay()
  }

  onSmallStopListPlay = () => {
    this.videoPlayer && this.videoPlayer.onStopListPlay()
  }

  onFullUpdateVideo = (options) => {
    this.videoModal && this.videoModal.updateVideo(options)
  }

  setFullMuted = (muted) => {
    this.videoModal && this.videoModal.setMuted(muted)
  }

  setFullRate = (rate) => {
    this.videoModal && this.videoModal.setRate(rate)
  }

  onFullStopPlay = () => {
    this.videoModal && this.videoModal.onStopPlay()
  }

  onFullStopListPlay = () => {
    this.videoModal && this.videoModal.onStopListPlay()
  }

  // 外部调用关闭模态窗口
  onCloseModal = () => {
    this.videoModal && this.videoModal.onFullScreen(false)
  }

  render () {
    const { modalFull } = this.props
    const { fullScreen } = this.state

    return (
      <View>
        <VideoPlayer
          {...this.props}
          ref={ref => this.videoPlayer = ref}
          onChangeFullScreen={this._onChangeFullScreen}
          autoPlay={modalFull ? false : (this.props.autoPlay || false)}
          showPoster={modalFull ? false : (this.props.showPoster || null)}
          // 启用模态全屏模式
          isModal={true}
          onLoad={this._onLoadVideo}
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
            autoPlay={modalFull ? (this.props.autoPlay || false) : false}
            paddingX={0}
            // 协调局部、全屏播放进度
            onChangeFullScreen={this._onChangeFullScreen}
            onLoad={this._onLoadVideoModal}
            onEnd={this._onEnd}
          />
        </Modal>
      </View>
    )
  }
}

export default VideoModal
