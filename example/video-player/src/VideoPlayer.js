import React from 'react'
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Text,
  ActivityIndicator,
  Platform
} from 'react-native'
import Slider from '@react-native-community/slider'
import Orientation from 'react-native-orientation-locker'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'

import { getStatusBarHeight } from '../libs/StatusBarHeight'
import VideoImages from '../libs/Images'

export const statusBarHeight = getStatusBarHeight()
export const screenWidth = Dimensions.get('screen').width
export const screenHeight = Dimensions.get('screen').height
export const defaultVideoHeight = screenWidth * 9 / 16
export const defaultVideoWidth = screenWidth
export function formatTime (second) {
  let result = parseInt(second)
  let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
  let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
  if (Math.floor(result / 3600) === 0) {
    result = `${m}:${s}`
  } else {
    result = `${h}:${m}:${s}`
  }

  return result
}

function Header ({ showStatusBar, statusBar, isFullScreen }) {
  if (!showStatusBar) {
    return null
  }

  if (statusBar) {
    return statusBar
  }

  return (
    <View style={{
      backgroundColor: '#000',
      height: isFullScreen ? 0 : statusBarHeight
    }}>
      <StatusBar translucent={true} backgroundColor='#000' barStyle={'light-content'} />
    </View>
  )
}

function Loading ({ showLoading, videoHeight, videoWidth }) {
  if (!showLoading) {
    return null
  }

  return (
    <View
      style={{
        left: videoWidth / 2 - 45,
        position: 'absolute',
        top: videoHeight / 2 - 35,
        justifyContent: 'center',
        zIndex: 1
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          paddingHorizontal: 10,
          paddingVertical: 11,
          borderRadius: 6
        }}
      >
        <ActivityIndicator color={'#fff'} size={'large'} />
        <Text style={{ color: '#fff' }}>正在缓冲...</Text>
      </View>
    </View>
  )
}

const rate = [1, 1.25, 1.5, 1.75, 2]

class VideoPlayer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isPaused: !props.autoPlay,
      videoHeight: defaultVideoHeight,
      videoWidth: defaultVideoWidth,
      rateIndex: 0,
      opacityControl: new Animated.Value(1),
      onload: false, // 视频加载状态
      showLoading: false, // 是否显示正在加载
      isShowControl: false,
      isFullScreen: false, // 是否全屏
      duration: 0, // 视频的时长
      currentTime: 0, // 视屏当前播放的时间
      playFromBeginning: false, // 视频是否需要从头开始播放
      showStatusBar: props.showStatusBar || true
    }
    console.log('screenWidth:', screenWidth)
    console.log('screenHeight:', screenHeight)
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    Orientation.lockToPortrait()
  }

  _fullScreen = () => {
    console.log('_fullScreen')
    const { onChangeFullScreen } = this.props
    this._setFullScreen()
    Orientation.lockToLandscape()
    onChangeFullScreen && onChangeFullScreen('full')
  }

  _smallScreen = () => {
    console.log('_smallScreen')
    const { onChangeFullScreen } = this.props
    this._setSamllScreen()
    Orientation.lockToPortrait()
    onChangeFullScreen && onChangeFullScreen('small')
  }

  _setFullScreen = () => {
    this.setState({
      videoWidth: screenHeight,
      videoHeight: screenWidth,
      isFullScreen: true
    }, () => {
      StatusBar.setHidden(true)
    })
  }

  _setSamllScreen = () => {
    this.setState({
      videoWidth: screenWidth,
      videoHeight: screenWidth * 9 / 16,
      isFullScreen: false
    }, () => {
      StatusBar.setHidden(false)
    })
  }

  _onLoad = (data) => {
    console.log('_onLoad data:', data)
    this.setState({
      duration: data.duration
    })
  }

  _onEnd = (e) => {
    console.log('_onEnd e:', e)
  }

  _onProgress = (data) => {
    // console.log('_onProgress data:', data)
    const { isPaused } = this.state
    if (!isPaused) {
      this.setState({
        currentTime: data.currentTime
      })
    }
  }

  // _onBuffer = (e) => {
  //   console.log('_onBuffer e:', e)
  // }
  _animatedonBuffer = (event) => {
    const { onBuffer } = this.props
    const { isPaused } = this.state
    console.log('_animatedonBuffer event:', event)
    onBuffer && onBuffer(event)
    this.setState({
      showLoading: Platform.OS === 'android' ? (!!event.isBuffering) : (!isPaused && true)
    })
  }

  _onError = (e) => {
    console.log('_onError e:', e)
  }

  _onSeek = (e) => {
    console.log('_onSeek e:', e)
    const { onSeek } = this.props
    onSeek && onSeek(e)
    this.setState({ isEnd: false })
  }

  _onReadyForDisplay = (e) => {
    console.log('_onReadyForDisplay e:', e)
  }

  _onLoadStart = (e) => {
    console.log('_onLoadStart e:', e)
  }

  _showControl = () => {
    const { isShowControl } = this.state
    this.setState({
      isShowControl: !isShowControl
    })
  }

  _onTapBackButton = () => {
    console.log('_onTapBackButton')
    const { onTapBackButton } = this.props
    const { isFullScreen } = this.state
    if (isFullScreen) {
      this._smallScreen()
    } else {
      this._smallScreen()
      onTapBackButton && onTapBackButton()
    }
  }

  _onTapPlayButton = () => {
    console.log('_onTapPlayButton')
    const { onPlay } = this.props
    const { isPaused } = this.state
    const _isPause_ = !isPaused
    this.setState({
      isPaused: _isPause_
    })
    onPlay && onPlay(_isPause_)
  }

  _onSliderValueChange = (currentTime) => {
    console.log('_onSliderValueChange')
    this.setState({
      currentTime,
      isPaused: true
    })
  }

  _onSliderValueComplete = (currentTime) => {
    console.log('_onSliderValueComplete')
    this.video.seek(currentTime)
    this.setState({
      currentTime,
      isPaused: false
    })
  }

  _onTapSwitchButton = () => {
    const { isFullScreen } = this.state
    if (isFullScreen) {
      this._smallScreen()
    } else {
      this._fullScreen()
    }
  }

  onFullScreen = (status) => {
    if (status) {
      this._fullScreen()
    } else {
      this._smallScreen()
    }
  }

  render () {
    const { statusBar, videoTitle } = this.props
    const {
      videoUrl, poster, muted, repeat, posterResizeMode,
      playInBackground, allowsExternalPlayback, ignoreSilentSwitch,
      playWhenInactive, resizeMode, controls, showBack = true,
      enableSwitchScreen = true
    } = this.props
    const {
      isPaused, videoHeight, videoWidth, rateIndex,
      isShowControl, opacityControl, duration, currentTime,
      showStatusBar, isFullScreen, showLoading
    } = this.state

    return (
      <>
        <Header statusBar={statusBar} showStatusBar={showStatusBar} isFullScreen={isFullScreen} />
        <View
          style={{
            height: videoHeight,
            width: videoWidth
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this._showControl}
          >
            <Video
              ref={ref => this.video = ref}
              source={{ uri: videoUrl }}
              poster={poster || null} // 封面
              paused={isPaused} // 暂停
              muted={muted || false} // 控制音频是否静音
              repeat={repeat || false} // 确定在到达结尾时是否重复播放视频。
              rate={rate[rateIndex]}// 播放速率
              playInBackground={playInBackground || false}
              allowsExternalPlayback={allowsExternalPlayback || false}
              ignoreSilentSwitch={ignoreSilentSwitch || 'ignore'}
              posterResizeMode={posterResizeMode || 'cover'}// 封面大小
              onSeek={this._onSeek}
              onEnd={this._onEnd} // 视频播放结束时的回调函数
              onProgress={this._onProgress} // 视频播放过程中每个间隔进度单位调用的回调函数
              // onBuffer={this._onBuffer} // 远程视频缓冲时的回调
              onBuffer={(e) => { this._animatedonBuffer(e) }}
              onLoadStart={this._onLoadStart}
              onLoad={this._onLoad} // 加载媒体并准备播放时调用的回调函数。
              onError={this._onError} // 播放失败后的回调
              onReadyForDisplay={this._onReadyForDisplay}
              resizeMode={resizeMode || 'contain'} // 缩放模式
              controls={controls || false}
              playWhenInactive={playWhenInactive || true}// 确定当通知或控制中心在视频前面时，媒体是否应继续播放。
              style={{ backgroundColor: 'blue', height: videoHeight, width: videoWidth }}
            />
          </TouchableOpacity>
          {
            isShowControl ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={this._showControl}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.playButton}
                  onPress={this._onTapPlayButton}
                >
                  <Image
                    style={styles.playButton}
                    source={isPaused ? VideoImages.icon_control_play : VideoImages.icon_control_pause}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : null
          }
          {
            isShowControl ? (
              <Animated.View
                style={[styles.Control, styles.topControl, {
                  opacity: opacityControl,
                  height: isFullScreen ? 72 : 50,
                  paddingTop: isFullScreen ? 22 : 0
                }]}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
                  style={[styles.shadow, { height: isFullScreen ? 72 : 50, width: videoWidth }]}
                />
                {
                  showBack ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[styles.backButton, {
                        marginLeft: isFullScreen ? 30 : 0
                      }]}
                      onPress={this._onTapBackButton}
                    >
                      <Image
                        source={VideoImages.icon_back}
                        style={{ width: 26, height: 26 }}
                      />
                    </TouchableOpacity>
                  ) : null
                }
                <Text style={styles.videoTitle} numberOfLines={1}>{videoTitle}</Text>
              </Animated.View>
            ) : null
          }
          {
            isShowControl ? (
              <Animated.View
                style={[styles.Control, styles.bottomControl, {
                  opacity: opacityControl,
                  paddingHorizontal: isFullScreen ? 30 : 0
                }]}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
                  style={[styles.shadow, { height: 50, width: videoWidth }]}
                />
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Slider
                  style={{ flex: 1 }}
                  maximumTrackTintColor={'#999999'}// 滑块右侧轨道的颜色
                  minimumTrackTintColor={'#00c06d'}// 滑块左侧轨道的颜色
                  thumbImage={VideoImages.icon_control_slider}
                  value={currentTime}
                  minimumValue={0}
                  maximumValue={Number(duration)}
                  onSlidingComplete={this._onSliderValueComplete}
                  onValueChange={this._onSliderValueChange}
                />
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
                {
                  enableSwitchScreen ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        width: 50
                      }}
                      onPress={this._onTapSwitchButton}
                    >
                      <Image
                        style={styles.control_switch_btn}
                        source={!isFullScreen
                          ? VideoImages.icon_control_shrink_screen
                          : VideoImages.icon_control_full_screen}
                      />
                    </TouchableOpacity>
                  ) : null
                }
              </Animated.View>
            ) : null
          }
          <Loading showLoading={showLoading} videoHeight={videoHeight} videoWidth={videoWidth} />
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  Control: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0
  },
  topControl: {
    top: 0
  },
  bottomControl: {
    height: 50,
    bottom: 0
  },
  backButton: {
    flexDirection: 'row',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playButton: {
    width: 50,
    height: 50
  },
  videoTitle: {
    fontSize: 14,
    color: 'white',
    flex: 1,
    marginHorizontal: 10
  },
  control_play_btn: {
    width: 24,
    height: 24
  },
  timeText: {
    fontSize: 13,
    color: 'white',
    marginLeft: 10,
    marginRight: 10
  },
  control_switch_btn: {
    width: 25,
    height: 25
  }
})

export default VideoPlayer
