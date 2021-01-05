import React from 'react'
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Text,
  PanResponder,
  Platform,
  BackHandler
} from 'react-native'
import Orientation from 'react-native-orientation-locker'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'

import VideoImages from '../libs/Images'
import { statusBarHeight, screenWidth, screenHeight, defaultVideoHeight, formatTime } from '../libs/Utils'
import Header from './Header'
import Loading from './Loading'
import Speed from './Speed'

class VideoPlayer extends React.Component {
  static defaultProps = {
    autoPlay: false, // 控制播放器是否自动播放
    showBack: true,
    enableSwitchScreen: true, // 是否显示切换全屏按钮
    statusBar: null, // 状态栏
    statusBarTrans: false, // 是否沉侵式 状态栏
    poster: null, // 加载视频时要显示的图像
    muted: false, // 控制音频是否静音
    repeat: false, // 确定在到达结尾时是否重复播放视频
    playInBackground: false, // 确定应用程序在后台时是否应继续播放媒体。 这允许客户继续收听音频。
    allowsExternalPlayback: false, // 指示播放器是否允许切换到AirPlay或HDMI等外部播放模式
    ignoreSilentSwitch: 'ignore', // 控制iOS静默开关行为
    playFromBeginning: false, // 视频是否需要从头开始播放
    posterResizeMode: 'cover', // 确定当帧与原始视频尺寸不匹配时如何调整海报图像的大小
    resizeMode: 'contain', // 确定当帧与原始视频尺寸不匹配时如何调整视频大小
    controls: false,
    playWhenInactive: true, // 在通知或控制中心位于视频前面时是否应继续播放媒体
    listMode: false, // 列表模式
    showMinTitle: false, // 是否显示小视频标题
    videoMaxWidth: 0, // 默认小屏视频最大宽度
    paddingX: 0, // 边距的值
    rate: [1, 1.25, 1.5, 1.75, 2], // 视频播放的速率
    isModal: false,
    isFullScreen: false,
    showPoster: null
  }

  constructor (props) {
    super(props)

    let videoWidth = screenWidth
    let videoHeight = defaultVideoHeight
    if (props.videoMaxWidth !== 0) {
      videoWidth = props.videoMaxWidth
      videoHeight = videoWidth * 9 / 16
    }

    if (props.isFullScreen) {
      videoWidth = screenHeight
      videoHeight = screenWidth
    }

    this.state = {
      videoWidth,
      videoHeight,
      videoUrl: props.videoUrl,
      poster: props.poster,
      videoTitle: props.videoTitle,
      isPaused: !props.autoPlay,
      rateIndex: 0,
      opacityControl: new Animated.Value(1),
      onload: false, // 视频加载状态
      showLoading: false, // 是否显示正在加载
      showControl: false,
      isFullScreen: props.isFullScreen, // 是否全屏
      duration: 0, // 视频的时长
      allTime: null,
      initPlayStatus: props.autoPlay, // 视频初始化状态是否显示 video
      showPoster: props.showPoster !== null ? props.showPoster : !props.autoPlay, // 显示海报
      isSuspended: false // 是否处于暂停状态
    }
    this.nowTime = '00:00'
    this.nowCurrentTime = 0 // 当前播放秒数
    this.nowBufferX = 0 // 当前缓存秒速
    this.dotX = new Animated.Value(0)
    this.bufferX = new Animated.Value(0)
    // 进度条长度
    this.progressBarLength = {
      width: videoWidth - 200
    }
    this.paddingX = props.paddingX
    // 左右拖动进度条
    this._panSpeeDot = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        const { onload } = this.state
        if (!onload) return// 需要权限 或者视频还不可以播放时停止不允许滑动进度条

        this.isMoveDot = true
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        this.touchX = evt.nativeEvent.locationX
        this.dotSpeed.setDotStart(true)
        // console.log('this.touchX:', evt.nativeEvent, this.touchX)
        this.dotSpeed.setDotWidth(evt.nativeEvent.pageX - (this.progressBarLength.x + this.paddingX))
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        const { onload } = this.state
        if (!onload) return// 需要权限 或者视频还不可以播放时停止不允许滑动进度条

        // console.log('touchX:', this.touchX)
        // console.log('evt.nativeEvent.pageX:', evt.nativeEvent)
        this.realMarginLeft = gestureState.moveX - (this.progressBarLength.x + this.paddingX)
        if (this.realMarginLeft >= this.progressBarLength.width) {
          this.realMarginLeft = this.progressBarLength.width
        }
        if (this.realMarginLeft > 0) {
          if ((evt.nativeEvent.pageX - this.touchX - (this.progressBarLength.x + this.paddingX)) >= this.progressBarLength.width) {
            this.dotSpeed.setDotWidth(this.progressBarLength.width)
          } else {
            this.dotSpeed.setDotWidth(evt.nativeEvent.pageX - (this.progressBarLength.x + this.paddingX))
          }
        }
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { duration } = this.state
        // this.activateAutoHide()// 手指离开后激活自动隐藏
        const speedB = Math.round((this.dotSpeed.state.dotWidth) / this.progressBarLength.width * 100) / 100
        if (speedB >= 1) {
          this.video && this.video.seek(duration * speedB - 2)
        } else {
          this.video && this.video.seek(duration * speedB)
        }
        this.isMoveDot = false
      },
      onPanResponderTerminate: (evt, gestureState) => {
        console.log('onPanResponderTerminate')
        this.isMoveDot = false// 判断是否触摸按住进度条上的点
        return true
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        console.log('onShouldBlockNativeResponder')
        return false
      }
    })

    console.log('video-player init')
  }

  componentDidMount () {
    if (this.props.isFullScreen) {
      this.props.navigation && this.props.navigation.setParams({ enableGestures: false })
      Orientation.lockToLandscape()
    }
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    }
  }

  componentWillUnmount () {
    Orientation.lockToPortrait()
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
    }
  }

  onBackPress = () => {
    return true
  }

  _onLoad = (data) => {
    console.log('_onLoad data:', data)
    const { onLoad } = this.props

    // 进度条动画
    this.playDotX = this.dotX.interpolate({
      inputRange: [0, this.progressBarLength.width],
      outputRange: [0, this.progressBarLength.width],
      extrapolate: 'clamp'
    })
    // 缓存条
    this.playBufferX = this.bufferX.interpolate({
      inputRange: [0, this.progressBarLength.width],
      outputRange: [0, this.progressBarLength.width],
      extrapolate: 'clamp'
    })

    this.setState({
      duration: data.duration,
      allTime: formatTime(data.duration),
      onload: true,
      initPlayStatus: true
    }, () => {
      onLoad && onLoad(data)
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

  // 播放进度  包含进度条  以及当前播放时间
  _onProgress = (e) => {
    // console.log('_onProgress e:', e)
    const { onProgress } = this.props
    const ratio = e.seekableDuration / this.progressBarLength.width

    onProgress && onProgress(e)

    if (!this.isMoveDot) {
      this.nowCurrentTime = e.currentTime
      this.nowBufferX = e.playableDuration
    }

    this.nowTime = formatTime(e.currentTime)
    !this.isMoveDot && this.dotSpeed && this.dotSpeed.setSpeed(e)

    Animated.timing(
      // timing方法使动画值随时间变化
      this.dotX, // 要变化的动画值
      {
        toValue: e.currentTime / ratio, // 最终的动画值
        duration: 0,
        useNativeDriver: false
      }
    ).start() // 开始执行动画

    Animated.timing(
      // timing方法使动画值随时间变化
      this.bufferX, // 要变化的动画值
      {
        toValue: e.playableDuration / ratio, // 最终的动画值
        duration: 0,
        useNativeDriver: false
      }
    ).start() // 开始执行动画
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

  _onLoadStart = (e) => {
    console.log('_onLoadStart e:', e)
    const { onLoadStart } = this.props
    onLoadStart && onLoadStart(e)
  }

  _onPlay = () => {
    const { onPlay } = this.props
    const { duration, isPaused, isEnd, isSuspended } = this.state
    const _isPause_ = !isPaused
    const ratio = duration / this.progressBarLength.width

    console.log('_onPlay isEnd:', isEnd, '_isPause_', _isPause_)
    if (isEnd) {
      this.video.seek(0)
      this.nowTime = '00:00'
      Animated.timing(
        // timing方法使动画值随时间变化
        this.dotX, // 要变化的动画值
        {
          toValue: 0, // 最终的动画值
          duration: 0,
          useNativeDriver: false
        }
      ).start() // 开始执行动画

      Animated.timing(
        // timing方法使动画值随时间变化
        this.bufferX, // 要变化的动画值
        {
          toValue: 0, // 最终的动画值
          duration: 0,
          useNativeDriver: false
        }
      ).start()
      this.setState({
        showPoster: false, // 正在播放不显示海报
        initPlayStatus: true,
        isPaused: false,
        isEnd: false
      })
    } else {
      this.setState({
        showPoster: false, // 正在播放不显示海报
        initPlayStatus: true,
        isPaused: _isPause_
      }, () => {
        if (isSuspended) {
          // 处于暂停状态，还原播放进度
          this.video.seek(this.nowCurrentTime)
          this.nowTime = formatTime(this.nowCurrentTime)
          Animated.timing(
            // timing方法使动画值随时间变化
            this.dotX, // 要变化的动画值
            {
              toValue: this.nowCurrentTime / ratio, // 最终的动画值
              duration: 0,
              useNativeDriver: false
            }
          ).start() // 开始执行动画

          Animated.timing(
            // timing方法使动画值随时间变化
            this.bufferX, // 要变化的动画值
            {
              toValue: this.nowBufferX / ratio, // 最终的动画值
              duration: 0,
              useNativeDriver: false
            }
          ).start()

          this.setState({
            isSuspended: false
          })
        }
      })
    }

    onPlay && onPlay(_isPause_)
  }

  _changeSpeedTip = (e) => {
    // this.SpeedTipTimeRef && this.SpeedTipTim eRef.refs.gotimeSpeed.setNativeProps({ style: e })
  }

  _fullScreen = () => {
    console.log('_fullScreen')
    this._setFullScreen()
    Orientation.lockToLandscape()
  }

  _smallScreen = () => {
    console.log('_smallScreen')
    this._setSamllScreen()
    Orientation.lockToPortrait()
  }

  _setFullScreen = () => {
    const { listMode, navigation, isModal, onChangeFullScreen } = this.props
    const { isPaused } = this.state
    navigation && navigation.setParams({ enableGestures: false })
    this.dotSpeed && this.dotSpeed.setDotStart(false)
    if (listMode) {
      if (isModal) {
        this.setState({
          videoWidth: screenHeight,
          videoHeight: screenWidth,
          isFullScreen: true
        }, () => {
          StatusBar.setHidden(true)
          onChangeFullScreen && onChangeFullScreen({
            screen: 'full',
            seekTime: this.nowCurrentTime,
            buffer: this.nowBufferX,
            paused: isPaused
          })
        })
      } else {
        StatusBar.setHidden(true)
        onChangeFullScreen && onChangeFullScreen({
          screen: 'full',
          seekTime: this.nowCurrentTime,
          buffer: this.nowBufferX,
          paused: isPaused
        })
      }
    } else {
      this.setState({
        videoWidth: screenHeight,
        videoHeight: screenWidth,
        isFullScreen: true
      }, () => {
        StatusBar.setHidden(true)
        onChangeFullScreen && onChangeFullScreen({
          screen: 'full',
          seekTime: this.nowCurrentTime,
          buffer: this.nowBufferX,
          paused: isPaused
        })
      })
    }
  }

  _setSamllScreen = () => {
    const { navigation, videoMaxWidth, listMode, isModal, onChangeFullScreen } = this.props
    const { isPaused } = this.state

    navigation && navigation.setParams({ enableGestures: true })
    this.dotSpeed && this.dotSpeed.setDotStart(false)
    let videoWidth = screenWidth
    if (videoMaxWidth !== 0) {
      videoWidth = videoMaxWidth
    }
    if (listMode) {
      console.log('_setSamllScreen 1111111111111')
      if (isModal) {
        this.setState({
          videoWidth,
          videoHeight: videoWidth * 9 / 16,
          isFullScreen: false
        }, () => {
          console.log('_setSamllScreen 222222222222')
          StatusBar.setHidden(false)
          onChangeFullScreen && onChangeFullScreen({
            screen: 'small',
            seekTime: this.nowCurrentTime,
            buffer: this.nowBufferX,
            paused: isPaused
          })
        })
      } else {
        StatusBar.setHidden(false)
        onChangeFullScreen && onChangeFullScreen({
          screen: 'small',
          seekTime: this.nowCurrentTime,
          buffer: this.nowBufferX,
          paused: isPaused
        })
      }
    } else {
      this.setState({
        videoWidth,
        videoHeight: videoWidth * 9 / 16,
        isFullScreen: false
      }, () => {
        StatusBar.setHidden(false)
        onChangeFullScreen && onChangeFullScreen({
          screen: 'small',
          seekTime: this.nowCurrentTime,
          buffer: this.nowBufferX,
          paused: isPaused
        })
      })
    }
  }

  _onReadyForDisplay = (e) => {
    console.log('_onReadyForDisplay e:', e)
    const { onReadyForDisplay } = this.props
    onReadyForDisplay && onReadyForDisplay(e)
  }

  _showControl = () => {
    const { initPlayStatus, showControl } = this.state
    if (!initPlayStatus) {
      // 视频没有初始化的时候，禁止显示控制栏
      return
    }
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

  _onTapSwitchButton = () => {
    const { isFullScreen } = this.state
    if (isFullScreen) {
      this._smallScreen()
    } else {
      this._fullScreen()
    }
  }

  _setProgressBarLength = (data) => {
    console.log('_setProgressBarLength isFullScreen:', JSON.stringify(data))
    this.progressBarLength = data
    // 更新播放进度
    this.playDotX = this.dotX.interpolate({
      inputRange: [0, data.width],
      outputRange: [0, data.width],
      extrapolate: 'clamp'
    })

    // 更新缓存进度
    this.playBufferX = this.bufferX.interpolate({
      inputRange: [0, data.width],
      outputRange: [0, data.width],
      extrapolate: 'clamp'
    })

    const { duration } = this.state

    if (!duration) {
      return
    }

    const ratio = duration / data.width

    Animated.timing(
      // timing方法使动画值随时间变化
      this.dotX, // 要变化的动画值
      {
        toValue: this.nowCurrentTime / ratio, // 最终的动画值
        duration: 0,
        useNativeDriver: false
      }
    ).start() // 开始执行动画

    Animated.timing(
      // timing方法使动画值随时间变化
      this.bufferX, // 要变化的动画值
      {
        toValue: this.nowBufferX / ratio, // 最终的动画值
        duration: 0,
        useNativeDriver: false
      }
    ).start() // 开始执行动画
    this.setState({
      refreshVideo: !this.state.refreshVideo
    })
  }

  /* 以下为 外部接口 */
  // 更新视频数据
  updateVideo = ({ uri, title, seekTime, buffer, paused, showPoster }) => {
    const { duration } = this.state
    const ratio = duration / this.progressBarLength.width
    console.log('updateVideo:', duration)
    const data = {}
    if (uri) {
      data.videoUrl = uri
    }
    if (title) {
      data.videoTitle = title
    }
    if (paused !== undefined && paused !== null) {
      data.isPaused = paused
    }
    console.log('data.isPaused:', data.isPaused)
    if (showPoster !== undefined && showPoster !== null) {
      data.showPoster = showPoster
    }
    this.setState({
      ...data
    })
    this.video.seek(seekTime)
    this.nowTime = formatTime(seekTime)
    Animated.timing(
      // timing方法使动画值随时间变化
      this.dotX, // 要变化的动画值
      {
        toValue: seekTime / ratio, // 最终的动画值
        duration: 0,
        useNativeDriver: false
      }
    ).start() // 开始执行动画

    Animated.timing(
      // timing方法使动画值随时间变化
      this.bufferX, // 要变化的动画值
      {
        toValue: buffer / ratio, // 最终的动画值
        duration: 0,
        useNativeDriver: false
      }
    ).start()
  }

  // 变更全屏方式
  onFullScreen = (status) => {
    if (status) {
      this._fullScreen()
    } else {
      this._smallScreen()
    }
  }

  // 暂停视频
  onStopPlay = () => {
    console.log('onStopPlay 暂停视频')
    this.setState({
      isPaused: true,
      showControl: false,
      showLoading: false
    })
  }

  // 其他视频在播放的时候暂停上一个视频
  onStopListPlay = () => {
    console.log('onStopListPlay 其他视频在播放的时候暂停上一个视频')
    this.setState({
      initPlayStatus: false,
      isPaused: true,
      showControl: false,
      showLoading: false,
      isSuspended: true
    })
  }

  // 播放
  onPlay = () => {
    this.setState({
      isPaused: false
    })
  }

  render () {
    const {
      muted, repeat, posterResizeMode,
      statusBar, playInBackground, allowsExternalPlayback,
      ignoreSilentSwitch, playWhenInactive, resizeMode,
      controls, showBack, enableSwitchScreen,
      statusBarTrans, listMode, showMinTitle,
      rate
    } = this.props
    const {
      videoUrl, poster, videoTitle,
      showPoster, isPaused, videoHeight,
      videoWidth, rateIndex, showControl,
      opacityControl, isFullScreen, showLoading,
      initPlayStatus, allTime
    } = this.state

    console.log('render isPaused:', isPaused)
    return (
      <View>
        { statusBar ? statusBar() : (<Header trans={statusBarTrans} isFullScreen={isFullScreen} />) }
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
              (listMode && !initPlayStatus) || (!listMode && (poster !== null && poster !== undefined && poster !== '') && showPoster) ? (
                <View style={{ backgroundColor: '#000', height: videoHeight, width: videoWidth }}>
                  <Image source={{ uri: poster }} style={{ height: videoHeight, width: videoWidth }} />
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
                  onLoadStart={this._onLoadStart}
                  onLoad={this._onLoad} // 加载媒体并准备播放时调用的回调函数。
                  onError={this._onError} // 播放失败后的回调
                  onReadyForDisplay={this._onReadyForDisplay}
                  style={{ backgroundColor: '#000', height: videoHeight, width: videoWidth }}
                />
              )
            }
          </TouchableOpacity>
          {
            (isPaused && !showControl && !showLoading) || (showControl && !showLoading) ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={this._showControl}
                style={styles.controlPlayBtn}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.playButton}
                  onPress={this._onPlay}
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
                style={[styles.control, styles.topControl, {
                  opacity: opacityControl,
                  height: isFullScreen ? 72 : 50,
                  paddingTop: isFullScreen ? 22 : statusBarTrans ? statusBarHeight : 0
                }]}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
                  style={[styles.shadow, {
                    height: isFullScreen ? 72 : statusBarTrans ? (50 + statusBarHeight) : 50,
                    width: videoWidth
                  }]}
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
                style={[styles.control, styles.bottomControl, {
                  opacity: opacityControl,
                  width: videoWidth,
                  height: isFullScreen ? 75 : 50,
                  alignItems: isFullScreen ? 'flex-start' : 'center'
                }]}
                onLayout={(e) => {
                  console.log('onlayout Control bar e:', JSON.stringify(e.nativeEvent.layout))
                }}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
                  style={[styles.shadow, { height: isFullScreen ? 75 : 50, width: videoWidth }]}
                />
                <Speed
                  ref={ref => this.dotSpeed = ref}
                  nowTime={this.nowTime}
                  panHandlers={this._panSpeeDot.panHandlers}
                  allTime={allTime}
                  playDotX={this.playDotX}
                  playBufferX={this.playBufferX}
                  isMoveDot={this.isMoveDot}
                  videoWidth={videoWidth}
                  setProgressBarLength={this._setProgressBarLength}
                />
                {
                  enableSwitchScreen ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        paddingHorizontal: 15
                      }}
                      onPress={this._onTapSwitchButton}
                      onLayout={(e) => {
                        console.log('switch screen:', JSON.stringify(e.nativeEvent.layout))
                      }}
                    >
                      <Image
                        style={styles.controlSwitchBtn}
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
  control: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0
  },
  topControl: {
    top: 0,
    paddingHorizontal: 15
  },
  bottomControl: {
    bottom: 0,
    zIndex: 99999
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
  controlPlayBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlSwitchBtn: {
    width: 25,
    height: 25
  }
})

export default VideoPlayer
