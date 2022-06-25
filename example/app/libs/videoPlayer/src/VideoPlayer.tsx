import React, { forwardRef, useRef, useState, useImperativeHandle, useEffect, useCallback, useContext } from "react"
import { StyleSheet, View, Animated, Easing, Text, TouchableOpacity, BackHandler, Image } from "react-native"
import Video from 'react-native-video'

import { defaultVideoHeight, formatTime, isIOS, screenHeight, screenWidth } from '../common/Utils'
import VideoImages from '../common/Images'
import { VPlayerContext, VPlayerProvider } from "../models/vPlayer"

import HeaderView from './Header'

const VideoPlayerView = (props) => {
  const { state, dispatch } = useContext<any>(VPlayerContext)
  const {
    rotate, videoWidth, videoHeight, leftHeight,
    isPaused, muted, showPoster, poster, videoUrl,
    videoTitle, rateIndex, isLoad, isError, showLoading,
    showVideo, showPlayBtn, duration, allTime, isEnd,
    isSuspended,
  } = state
  const _videoRef = useRef<Video>(null)

  useImperativeHandle(props.refInstance, () => ({
    switchFullScreen: switchFullScreen,
    onStopPlay: onStopPlay,
    updateVideo: updateVideo,
  }))

  useEffect(() => {
    let _showPoster = props.showPoster !== null ? props.showPoster : !props.autoPlay
    dispatch({
      type: 'setState',
      payload: {
        videoUrl: props.videoUrl,
        poster: props.poster,
        videoTitle: props.videoTitle,
        isPaused: !props.autoPlay,
        isFullScreen: props.isFullScreen,
        muted: props.muted,
        showPoster: _showPoster,
        showVideo: !_showPoster,
      },
    })
    if (props.isFullScreen) {
      setVideoLayout(props.isFullScreen)
    }
    if (!isIOS) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
    }
    return () => {
      console.log('video remove')
      // Orientation.lockToPortrait()
      if (!isIOS) {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
      // clearTimeout(TimeHideConts.current) // 拖动进度条时禁止隐藏控件
    }
  }, [])

  useEffect(() => {
    if (props.videoUrl) {
      dispatch({
        type: 'setState',
        payload: {
          videoUrl: props.videoUrl,
          poster: props.poster,
          videoTitle: props.videoTitle,
        },
      })
    }
  }, [props.videoUrl])

  useEffect(useCallback(() => {
    // 静音判断
    if (props.muted !== muted) {
      console.log('muted:', props.muted, muted)
      dispatch({
        type: 'setState',
        payload: {
          muted: props.muted,
        },
      })
    }
  }, [muted]), [props.muted])
  // 安卓返回按钮
  const onBackPress = () => {
    return true
  }
  // 全屏旋转
  const setVideoLayout = (fullScreen) => {
    let _width = screenHeight
    let _height = screenWidth
    let _left = -((screenHeight / 2) - (screenWidth / 2))
    let _rotate = '90deg'

    if (!fullScreen) {
      _width = screenWidth
      _height = defaultVideoHeight
      _left = 0
      _rotate = '0deg'
      if (props.videoMaxWidth !== 0) {
        _width = props.videoMaxWidth
        _height = _width * 9 / 16
      }
    }
    dispatch({
      type: 'setState',
      payload: {
        videoWidth: _width,
        videoHeight: _height,
        leftHeight: _left,
        rotate: _rotate
      },
    })
  }
  // 横屏切换
  const switchFullScreen = () => {
    let _isFullScreen = !props.isFullScreen
    if (props.isFullScreen) {
      // 显示横屏后调用这个
      props.onModalFullScreen && props.onModalFullScreen(_isFullScreen)
    } else {
      // 非横屏调用这个
      props.onFullScreen && props.onFullScreen(_isFullScreen)
    }
  }
  // 暂停视频
  const onStopPlay = () => {
    dispatch({
      type: 'setState',
      payload: {
        isPaused: true,
      },
    })
  }
  // 更新视频数据
  const updateVideo = ({ uri, title, seekTime, buffer, paused, poster, showPoster }) => {
    const _data: { [p: string]: any; } = {}
    if (uri) {
      _data.videoUrl = uri // 视频 url
    }
    if (title) {
      _data.videoTitle = title  // 标题
    }

    if (poster !== undefined && poster !== null) {
      _data.poster = poster // 封面
    }

    if (paused !== undefined && paused !== null) {
      _data.isPaused = paused
    }

    if (showPoster !== undefined && showPoster !== null) {
      _data.showPoster = showPoster
    }

    dispatch({
      type: 'setState',
      payload: {
        ..._data,
      },
    })
    // _videoRef.current?.seek(seekTime)
    // nowTime.current = formatTime(seekTime)
    // animatedChange(seekTime, buffer)
  }
  // 显示控制栏
  const _showControl = () => {
    console.log('_showControl');
    if (!isLoad) {
      // 视频没有初始化的时候，禁止显示控制栏
      return
    }
    dispatch({
      type: 'setState',
      payload: {
        // showPlayBtn: !showPlayBtn,
      },
    })
  }

  const _onSeek = () => { }

  const _onEnd = () => { }

  const _onProgress = () => { }

  const _onBuffer = () => { }

  const _onLoadStart = () => { }
  // 视频加载
  const _onLoad = (data) => {
    console.log('_onLoad:', data);
    dispatch({
      type: 'setState',
      payload: {
        duration: data.duration,
        allTime: formatTime(data.duration),
        isLoad: true,
        showLoading: false,
      },
    })
  }

  const _onError = (e) => {
    console.log('_onError:', e);
    props.onError && props.onError(e)
    dispatch({
      type: 'setState',
      payload: {
        isPaused: true,
        showLoading: false,
        isError: true, // 视频无法播放
      },
    })
  }

  const _onReadyForDisplay = () => { }

  const _onStartPlay = () => {
    dispatch({
      type: 'setState',
      payload: {
        showPoster: false, // 正在播放不显示海报
        isPaused: false,
        showLoading: false,
        showVideo: true,
        showPlayBtn: false,
      },
    })
    props.onPlay && props.onPlay(false)
  }

  const _onPlay = async () => {
    const _isPause_ = !isPaused
    console.log('_onPlay isEnd:', isEnd, '_isPause_', _isPause_, 'isSuspended:', isSuspended)
    if (isEnd) {
      // 已经播放结束，重新开始播放
      _videoRef.current.seek(0)
      // nowTime.current = '00:00'
      // animatedChange(0, 0)
      await dispatch({
        type: 'setState',
        payload: {
          showPoster: false, // 正在播放不显示海报
          isPaused: false,
          isEnd: false,
          showLoading: !_isPause_,
        },
      })
    } else {
      console.log('处于暂停状态，还原播放进度')
      // _videoRef.current.seek(nowCurrentTime.current)
      // nowTime.current = formatTime(nowCurrentTime.current)
      // animatedChange(nowCurrentTime.current, nowBufferX.current)
      await dispatch({
        type: 'setState',
        payload: {
          showPoster: false, // 正在播放不显示海报
          isPaused: _isPause_,
          showLoading: !_isPause_,
          showVideo: true,
          // isSuspended: false,
        },
      })
    }

    props.onPlay && props.onPlay(_isPause_)
  }

  console.log('videoPlayer videoUrl:', videoUrl, 'showPoster:', showPoster, 'poster:', poster, 'showVideo:', showVideo)

  return (
    <View>
      <HeaderView
        statusBar={props.statusBar}
        statusBarBg={props.statusBarBg}
        barStyle={props.barStyle}
        isDark={props.isDark}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={[
          lineStyles.videoStyles,
          props.videoStyles,
          {
            width: videoWidth,
            height: videoHeight,
            left: leftHeight,
            transform: [
              {
                rotate: rotate,
              },
            ]
          },
        ]}
        onPress={_showControl}
      >
        {
          showVideo && videoUrl ? (
            <Video
              ref={_videoRef}
              source={{ uri: videoUrl }}
              poster={poster} // 封面
              paused={isPaused} // 暂停
              muted={muted} // 控制音频是否静音
              repeat={props.repeat} // 确定在到达结尾时是否重复播放视频。
              rate={props.rate[rateIndex]}// 播放速率
              playInBackground={props.playInBackground}
              allowsExternalPlayback={props.allowsExternalPlayback}
              ignoreSilentSwitch={props.ignoreSilentSwitch}
              posterResizeMode={props.posterResizeMode}// 封面大小
              resizeMode={props.resizeMode} // 缩放模式
              controls={props.controls}
              playWhenInactive={props.playWhenInactive}// 确定当通知或控制中心在视频前面时，媒体是否应继续播放。
              onSeek={_onSeek}
              onEnd={_onEnd} // 视频播放结束时的回调函数
              onProgress={_onProgress} // 视频播放过程中每个间隔进度单位调用的回调函数
              onBuffer={_onBuffer} // 远程视频缓冲时的回调
              onLoadStart={_onLoadStart}
              onLoad={_onLoad} // 加载媒体并准备播放时调用的回调函数。
              onError={_onError} // 播放失败后的回调
              onReadyForDisplay={_onReadyForDisplay}
              style={[lineStyles.videoStyles, props.videoStyles, {
                width: videoWidth,
                height: videoHeight
              }]}
            />
          ) : null
        }
        {
          // 显示封面
          (showPoster && poster !== null) ? (
            <View style={[lineStyles.videoStyles, { flex: 1 }]}>
              <Image
                source={{ uri: poster }}
                style={{
                  width: videoWidth,
                  height: videoHeight,
                }}
              />
            </View>
          ) : null
        }
        {
          showPlayBtn ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={_onStartPlay}
              style={lineStyles.controlPlayBtn}
            >
              <View style={lineStyles.playButton}>
                <Image
                  style={lineStyles.playButton}
                  source={isPaused ? VideoImages.icon_control_play : VideoImages.icon_control_pause}
                />
              </View>
            </TouchableOpacity>
          ) : null
        }
        <View style={{ position: 'absolute' }}>
          <Text style={{ color: '#fff' }}>{videoTitle}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const lineStyles = StyleSheet.create({
  videoStyles: {
    backgroundColor: '#000',
    position: 'relative',
  },
  playButton: {
    width: 60,
    height: 60,
  },
  controlPlayBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
})

const VideoPlayer = (props) => {
  return (
    <VPlayerProvider>
      <VideoPlayerView {...props} />
    </VPlayerProvider>
  )
}

VideoPlayer.defaultProps = {
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
  showMinTitle: false, // 是否显示小视频标题
  videoMaxWidth: 0, // 默认小屏视频最大宽度
  rate: [1, 1.25, 1.5, 1.75, 2], // 视频播放的速率
  rateIndex: 0, // 播放速率
  isModal: false,
  isFullScreen: false,
  showPoster: null,
  showMuted: false, // 是否显示静音按钮
  dotWdt: 14, // 圆点直径
  videoBarRadius: 0, // 圆角
}

const Component = VideoPlayer
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: any, ref) => (
  <Component {...props} refInstance={ref} />
))