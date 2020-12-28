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
  ActivityIndicator
} from 'react-native'
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

function Header ({ showStatusBar, trans, statusBar, isFullScreen }) {
  if (!showStatusBar) {
    return null
  }

  if (statusBar) {
    return statusBar
  }

  let backgroundColor = trans ? 'transparent' : '#000'

  return (
    <View style={{
      backgroundColor: backgroundColor,
      height: isFullScreen ? 0 : trans ? 0 : statusBarHeight
    }}>
      <StatusBar translucent={true} backgroundColor={backgroundColor} barStyle={'light-content'} />
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
  static defaultProps = {
    autoPlay: false,
    showBack: true,
    enableSwitchScreen: true,
    statusBarTrans: false,
    showStatusBar: true,
    poster: null,
    muted: false,
    repeat: false,
    playInBackground: false,
    allowsExternalPlayback: false,
    ignoreSilentSwitch: 'ignore',
    posterResizeMode: 'cover',
    resizeMode: 'contain',
    controls: false,
    playWhenInactive: true,
    listMode: false, // 列表模式
    showMinTitle: false // 是否显示小视频标题
  }

  constructor (props) {
    super(props)
    this.state = {
      videoUrl: props.videoUrl,
      poster: props.poster,
      videoTitle: props.videoTitle,
      isPaused: !props.autoPlay,
      videoHeight: defaultVideoHeight,
      videoWidth: defaultVideoWidth,
      rateIndex: 0,
      opacityControl: new Animated.Value(1),
      onload: false, // 视频加载状态
      showLoading: false, // 是否显示正在加载
      showControl: false,
      isFullScreen: false, // 是否全屏
      duration: 0, // 视频的时长
      currentTime: 0, // 视屏当前播放的时间
      playFromBeginning: false, // 视频是否需要从头开始播放
      showStatusBar: props.showStatusBar,
      initPlayStatus: false, // 列表模式下视频初始化状态是否显示 video
      showPoster: !props.autoPlay // 显示海报
    }
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
    const { onLoad } = this.props
    onLoad && onLoad(data)
    this.setState({
      duration: data.duration
    })
  }

  _onEnd = (e) => {
    console.log('_onEnd e:', e)
    const { onEnd, repeat } = this.props
    const { isPaused } = this.state
    !repeat && this.setState({
      showControl: true,
      opacity: 1,
      isPaused: true,
      isEnd: true
    })
    if (!isPaused) {
      onEnd && onEnd()
    }
  }

  _onProgress = (data) => {
    // console.log('_onProgress data:', data)
    const { onProgress } = this.props
    onProgress && onProgress(data)
    const { isPaused } = this.state
    if (!isPaused) {
      this.setState({
        currentTime: data.currentTime
      })
    }
  }

  _onBuffer = (e) => {
    console.log('_onBuffer e:', e)
    const { onBuffer } = this.props
    onBuffer && onBuffer(e)
    this.setState({
      showLoading: !!e.isBuffering
    })
  }

  _onError = (e) => {
    console.log('_onError e:', e)
    const { onError } = this.props
    onError && onError(e)
    this.setState({ showLoading: false, isPaused: true })
  }

  _onSeek = (e) => {
    console.log('_onSeek e:', e)
    const { onSeek } = this.props
    onSeek && onSeek(e)
    this.setState({ isEnd: false })
  }

  _onReadyForDisplay = (e) => {
    console.log('_onReadyForDisplay e:', e)
    const { onReadyForDisplay } = this.props
    onReadyForDisplay && onReadyForDisplay(e)
  }

  _onLoadStart = (e) => {
    console.log('_onLoadStart e:', e)
    const { onLoadStart } = this.props
    onLoadStart && onLoadStart(e)
  }

  _showControl = () => {
    const { showControl } = this.state
    this.setState({
      showControl: !showControl
    })
  }

  _onBackButton = () => {
    console.log('_onBackButton')
    const { onBackButton } = this.props
    onBackButton && onBackButton()
  }

  _onTapBackButton = () => {
    console.log('_onTapBackButton')
    // const { onTapBackButton } = this.props
    this._smallScreen()
  }

  _onTapPlayButton = () => {
    console.log('_onTapPlayButton')
    const { onPlay } = this.props
    const { isPaused, isEnd } = this.state
    const _isPause_ = !isPaused
    if (isEnd) {
      this.video.seek(0)
      this.setState({
        showPoster: false, // 正在播放不显示海报
        initPlayStatus: true,
        isPaused: false,
        isEnd: false,
        currentTime: 0
      })
    } else {
      this.setState({
        showPoster: false, // 正在播放不显示海报
        initPlayStatus: true,
        isPaused: _isPause_
      })
    }

    onPlay && onPlay(_isPause_)
  }

  _onSliderValueChange = (currentTime) => {
    this.setState({
      currentTime,
      isPaused: true
    })
  }

  _onSliderValueComplete = (currentTime) => {
    console.log('_onSliderValueComplete')
    const { onPlay } = this.props
    this.setState({
      initPlayStatus: true,
      currentTime,
      isPaused: false
    }, () => {
      this.video.seek(currentTime)
    })
    onPlay && onPlay(false)
  }

  _onTapSwitchButton = () => {
    const { isFullScreen } = this.state
    if (isFullScreen) {
      this._smallScreen()
    } else {
      this._fullScreen()
    }
  }

  updateVideo = (videoUrl, seekTime, videoTitle, videoCover) => {
    const title = (videoTitle != null) ? videoTitle : this.state.videoTitle
    let hasCover = true
    if (videoCover == null || videoCover === '') {
      hasCover = false
    }
    this.setState({
      videoUrl: videoUrl,
      videoTitle: title,
      isPaused: false,
      hasCover: hasCover,
      isShowVideoCover: false
    })
    this.video.seek(seekTime)
  }

  onFullScreen = (status) => {
    if (status) {
      this._fullScreen()
    } else {
      this._smallScreen()
    }
  }

  onStopPlay = () => {
    this.setState({
      isPaused: true,
      showControl: false
    })
  }

  onStopListPlay = () => {
    this.setState({
      initPlayStatus: false,
      isPaused: true,
      showControl: false
    })
  }

  render () {
    const {
      muted, repeat, posterResizeMode, statusBar,
      playInBackground, allowsExternalPlayback, ignoreSilentSwitch,
      playWhenInactive, resizeMode, controls, showBack,
      enableSwitchScreen, statusBarTrans, listMode, showMinTitle
    } = this.props
    const {
      videoUrl, poster, videoTitle, showPoster,
      isPaused, videoHeight, videoWidth, rateIndex,
      showControl, opacityControl, // duration, currentTime,
      showStatusBar, isFullScreen, showLoading, initPlayStatus
    } = this.state

    return (
      <View>
        <Header statusBar={statusBar} trans={statusBarTrans} showStatusBar={showStatusBar} isFullScreen={isFullScreen} />
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
            {
              (listMode && !initPlayStatus) ? (
                <View style={{ backgroundColor: '#000', height: videoHeight, width: videoWidth }}>
                  {
                    poster ? (
                      <Image
                        source={{ uri: poster }}
                        style={{ height: videoHeight, width: videoWidth }} />
                    ) : null
                  }
                </View>
              ) : (
                <Video
                  ref={ref => this.video = ref}
                  source={{ uri: videoUrl }}
                  poster={poster} // 封面
                  paused={isPaused} // 暂停
                  muted={muted} // 控制音频是否静音
                  repeat={repeat} // 确定在到达结尾时是否重复播放视频。
                  rate={rate[rateIndex]}// 播放速率
                  playInBackground={playInBackground}
                  allowsExternalPlayback={allowsExternalPlayback}
                  ignoreSilentSwitch={ignoreSilentSwitch}
                  posterResizeMode={posterResizeMode}// 封面大小
                  resizeMode={resizeMode} // 缩放模式
                  controls={controls}
                  playWhenInactive={playWhenInactive}// 确定当通知或控制中心在视频前面时，媒体是否应继续播放。
                  onSeek={this._onSeek}
                  onEnd={this._onEnd} // 视频播放结束时的回调函数
                  onProgress={this._onProgress} // 视频播放过程中每个间隔进度单位调用的回调函数
                  onBuffer={this._onBuffer} // 远程视频缓冲时的回调
                  // onBuffer={(e) => { this._animatedonBuffer(e) }}
                  onLoadStart={this._onLoadStart}
                  onLoad={this._onLoad} // 加载媒体并准备播放时调用的回调函数。
                  onError={this._onError} // 播放失败后的回调
                  onReadyForDisplay={this._onReadyForDisplay}
                  style={{ backgroundColor: '#000', height: videoHeight, width: videoWidth }}
                />
              )
            }
            {
              !listMode && (poster !== null && poster !== undefined && poster !== '') && showPoster ? (
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'blue',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Image source={{ uri: poster }} style={{ height: videoHeight, width: videoWidth }} />
                </View>
              ) : null
            }
          </TouchableOpacity>
          {
            showControl ? (
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
            showControl ? (
              <Animated.View
                style={[styles.Control, styles.topControl, {
                  opacity: opacityControl,
                  height: isFullScreen ? 72 : 50,
                  paddingTop: isFullScreen ? 22 : statusBarTrans ? statusBarHeight : 0,
                  paddingHorizontal: 15
                }]}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
                  style={[styles.shadow, { height: isFullScreen ? 72 : statusBarTrans ? (50 + statusBarHeight) : 50, width: videoWidth }]}
                />
                {
                  (showBack && !isFullScreen) ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.backButton}
                      onPress={this._onBackButton}
                    >
                      <Image
                        source={VideoImages.icon_back}
                        style={{ width: 26, height: 26 }}
                      />
                    </TouchableOpacity>
                  ) : null
                }
                {
                  isFullScreen ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.backButton}
                      onPress={this._onTapBackButton}
                    >
                      <Image
                        source={VideoImages.icon_back}
                        style={{ width: 26, height: 26 }}
                      />
                    </TouchableOpacity>
                  ) : null
                }
                {
                  (!isFullScreen && showMinTitle) ? (
                    <Text style={styles.videoTitle} numberOfLines={1}>{videoTitle}</Text>
                  ) : null
                }
                {
                  isFullScreen ? (
                    <Text style={styles.videoTitle} numberOfLines={1}>{videoTitle}</Text>
                  ) : null
                }
              </Animated.View>
            ) : null
          }
          {
            showControl ? (
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
                {
                //   <Speed
                //   color={this.props.speedColor}
                //   cachColor={this.props.cachColor}
                //   dotColor={this.props.dotColor}
                //   dotBorderColor={this.props.dotBorderColor}
                //   allSpeedColor={this.props.allSpeedColor}
                //   admRePlay={this.state.admRePlay}
                //   nowTime={this.nowTime}
                //   panHandlers={this._panSpeeDot.panHandlers}
                //   // allTime={allTime}
                //   ref={child => this.dotspeed = child}
                //   playDotX={this.playDotX}
                //   playBufferX={this.playBufferX}
                //   ismoveDot={this.ismoveDot}
                // />
                }
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
      </View>
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
    width: 60,
    height: 60
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
