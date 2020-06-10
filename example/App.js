/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, Dimensions } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import { VideoPlayer, defaultVideoHeight, statusBarHeight, screenWidth, screenHeight } from './videoplayer'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isPaused: true,
      videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
      videoImage: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
      videoTitle: '这是可全屏的播放组件'
    }
    this.isStopPlay = null
    console.log(Dimensions.get('window').width, Dimensions.get('window').height)
  }

  _onVideoFullScreen = (isFullScreen) => {
    console.log('onVideoFullScreen: ', isFullScreen)
    if (isFullScreen) {
      this.setState({
        isFullScreen: false
      })
      this.VideoPlayer.updateLayout(screenWidth, defaultVideoHeight, false)
      Orientation.lockToPortrait()
    } else {
      this.setState({
        isFullScreen: true
      })
      console.log('screenHeight, screenWidth:', screenHeight, screenWidth)
      this.VideoPlayer.updateLayout(screenHeight, screenWidth, true)
      Orientation.lockToLandscapeLeft()
    }
  }

  _onTapBackButton = (isFullScreen) => {
    console.log('onTapBackButton isFullScreen: ', isFullScreen)
    this.setState({
      isFullScreen: false
    })
    this.VideoPlayer.updateLayout(screenWidth, defaultVideoHeight, false)
    Orientation.lockToPortrait()
  }

  _onVideoBuffering = (isBuffering) => {
    console.log('_onVideoBuffering:', this.isStopPlay, isBuffering)
    if (this.isStopPlay) {
      return false
    }
    if (!isBuffering) {
      console.log('视频缓冲中...')
    } else {
      // console.log()
    }
  }

  _onPlay = (isPause) => {
    console.log('isPause:', isPause)
    this.isStopPlay = isPause
  }

  _onStopPlay = () => {
    console.log('视频关闭')
    this.isStopPlay = true
  }

  render () {
    const { isPaused, videoUrl, videoImage, videoTitle, isFullScreen } = this.state
    return (
      <View style={styles.container}>
        <View style={{ height: isFullScreen ? 0 : statusBarHeight, backgroundColor: '#fff' }}>
          <StatusBar translucent barStyle={'dark-content'} hidden={isFullScreen}/>
        </View>
        <View style={[{
          backgroundColor: '#000',
          width: screenWidth,
          height: defaultVideoHeight
        }, isFullScreen ? {
          width: screenHeight,
          height: screenWidth
        } : null]}>
          <View
            style={[{
              position: 'absolute',
              top: 0,
              left: 0
            },
            isFullScreen ? {
              bottom: 0,
              right: 0
            } : null]}
            activeOpacity={1}
            onPress={() => {
              this.setState({
                isShowVideo: false
              })
              this.VideoPlayer.stopPlay()
            }}
          >
            <VideoPlayer
              ref={v => (this.VideoPlayer = v)}
              videoURL={videoUrl}
              videoCover={videoImage}
              paused={isPaused}
              videoTitle={videoTitle}
              onChangeOrientation={this._onVideoFullScreen}
              onTapBackButton={this._onTapBackButton}
              onVideoBuffering={this._onVideoBuffering}
              onStopPlay={this._onStopPlay}
              onPlay={this._onPlay}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})
