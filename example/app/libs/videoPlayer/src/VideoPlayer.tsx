import React, { forwardRef, useRef, useImperativeHandle, useEffect, useCallback, useContext, useMemo, memo } from "react"
import { View, Animated, Text, TouchableOpacity, BackHandler, Image, PanResponder } from "react-native"
import Video from 'react-native-video'

import {
  defaultVideoHeight, formatTime, isClickGesture, isHorizontalGesture, isIOS,
  screenHeight, screenWidth, statusBarHeight,
} from '../common/Utils'
import VideoImages from '../common/Images'
import { VPlayerContext, VPlayerProvider } from "../models/vPlayer"
import MultiSlider from '../libs/speed/MultiSlider';

import { lineStyles } from './styles'
import HeaderView from './Header'
import Loading from './Loading'
// import Speed from './Speed'

const VideoPlayerView = (props) => {
  const { state, dispatch } = useContext<any>(VPlayerContext)
  const {
    rotate, videoWidth, videoHeight, leftHeight,
    isPaused, showPoster, poster, videoUrl,
    videoTitle, rateIndex, isLoad, isError, showLoading,
    showVideo, showPlayBtn, duration, allTime, isEnd,
    isSuspended, showControl, muted,
    sliderValue, nowTime, sliderLength
  } = state
  const { navigation } = props
  const _videoRef = useRef<Video>(null)
  const opacityControl = useRef(new Animated.Value(0))
  const nowCurrentTime = useRef<number>(0) // 当前播放秒数
  const nowBufferX = useRef<number>(0) // 当前缓存秒速
  const TimeHideConts = useRef<any>(null)
  const dotX = useRef(new Animated.Value(0))
  const bufferX = useRef(new Animated.Value(0))
  const playDotX = useRef<any>(null) // 控件没被隐藏时的进度动画
  const playBufferX = useRef<any>(null) // 缓存进度
  const isMoveDot = useRef(false)
  const touchX = useRef(0)
  const dotSpeed = useRef<any>(null)
  const paddingX = useRef(0) // 边距的值
  const realMarginLeft = useRef(0)
  // 进度条长度
  const progressBarLength = useRef({
    x: 0,
    width: videoWidth - 200,
  })
  // 控件显示动画
  const AnimatedOp = useRef(Animated.timing(
    // timing方法使动画值随时间变化
    opacityControl.current, // 要变化的动画值
    {
      toValue: 1, // 最终的动画值
      duration: 300,
      useNativeDriver: false,
    },
  ))
  // 控件隐藏动画
  const fastHide = useRef(Animated.timing(
    // timing方法使动画值随时间变化
    opacityControl.current, // 要变化的动画值
    {
      toValue: 0, // 最终的动画值
      duration: 300,
      useNativeDriver: false,
    },
  ))
  // 直接隐藏
  const toofastHide = useRef(Animated.timing(
    // timing方法使动画值随时间变化
    opacityControl.current, // 要变化的动画值
    {
      toValue: 0, // 最终的动画值
      duration: 0,
      useNativeDriver: false,
    },
  ))

  // 上下滑动 调节音量 以及屏幕亮度
  const _panResponder = PanResponder.create({
    // 时机 ： 发生在手指刚触摸到屏幕的时候
    /**
       *  捕获询问
          会从根元素一直询问到手指触碰到的元素(一般该元素不再有子元素)，如果在询问中途有元素获得了响应权，那么这次基于start的询问就结束了。
       */
    onStartShouldSetPanResponderCapture: (evt, gestureState) => {
      console.log('_panResponder onStartShouldSetPanResponderCapture')
      navigation && navigation.setParams({ enableGestures: false })
      return false
    },
    /**
       *  冒泡询问
          若捕获询问阶段没有元素请求成为响应者，那么就从最内层的元素开始冒泡询问，这过程中有元素获得响应权，那么这次基于start的询问就结束了
          而在start阶段获得响应者的元素在move阶段是作为询问的最内层元素。就像相当于在move询问阶段的范围可能会缩小。
       */
    onStartShouldSetPanResponder: (evt, gestureState) => {
      console.log('_panResponder onStartShouldSetPanResponder')
      navigation && navigation.setParams({ enableGestures: false })
      if (isMoveDot.current) {
        return false
      }
      // 如果是 0 则不处理
      if (isClickGesture(gestureState.dx, gestureState.dy)) {
        return false
      }
      // 如果是水平滑动，则处理
      if (!isHorizontalGesture(gestureState.dx, gestureState.dy)) {
        return true
      }
      return false
    },
    // 时机 ： 手指开始在屏幕移动的时候
    /**
       *  捕获询问
          与start询问阶段一样，从根元素开始，一直询问是否需要获得手势权，不过这里询问的终点不再是触摸元素，而是由start产生的获权者。关键的事情说三变！！！
       */
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      console.log('_panResponder onMoveShouldSetPanResponderCapture')
      navigation && navigation.setParams({ enableGestures: false })
      return false
    },
    // 冒泡询问 同start询问机制
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      console.log('_panResponder onMoveShouldSetPanResponder:', isMoveDot.current)
      navigation && navigation.setParams({ enableGestures: false })
      if (isMoveDot.current) {
        return false
      }
      // 如果是 0 则不处理
      if (isClickGesture(gestureState.dx, gestureState.dy)) {
        return false
      }
      // 如果是水平滑动，则处理
      if (!isHorizontalGesture(gestureState.dx, gestureState.dy)) {
        return true
      }
      return false
    },
    onPanResponderGrant: (evt, gestureState) => {
      console.log('_panResponder onPanResponderGrant')
    },
    onPanResponderMove: (evt, gestureState) => {
      console.log('_panResponder onPanResponderMove')
      navigation && navigation.setParams({ enableGestures: false })
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      console.log('_panResponder onPanResponderRelease')
      if (!props.isFullScreen) {
        navigation && navigation.setParams({ enableGestures: true })
      }
    },
    onPanResponderTerminate: (evt, gestureState) => {
      console.log('_panResponder onPanResponderTerminate')
      return true
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      console.log('_panResponder onShouldBlockNativeResponder')
      return false
    },
  })

  useImperativeHandle(props.refInstance, () => ({
    getCacheTime: getCacheTime,
    onStopPlay: onStopPlay,
    onStopListPlay: onStopListPlay,
    updateVideo: updateVideo,
  }))

  useEffect(() => {
    _setVideoLayout(props.isFullScreen)
    if (!isIOS) {
      BackHandler.addEventListener('hardwareBackPress', _onBackPress)
    }
    return () => {
      console.log('video remove')
      if (!isIOS) {
        BackHandler.removeEventListener('hardwareBackPress', _onBackPress)
      }
      clearTimeout(TimeHideConts.current) // 拖动进度条时禁止隐藏控件
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
      dispatch({
        type: 'setState',
        payload: {
          muted: props.muted,
        },
      })
    }
  }, [muted, props.muted]), [props.muted])
  // 获取播放时间
  const getCacheTime = () => {
    return {
      seekTime: nowCurrentTime.current,
      buffer: nowBufferX.current,
      paused: isPaused,
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
  // 其他视频在播放的时候暂停上一个视频
  const onStopListPlay = (opts) => {
    console.log('onStopListPlay 其他视频在播放的时候暂停上一个视频')
    dispatch({
      type: 'setState',
      payload: {
        isPaused: true,
        showControl: false,
        showLoading: false,
        isSuspended: true,
        ...opts,
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
        showPoster: false,
        showPlayBtn: false,
        showVideo: true,
        sliderValue: [seekTime],
        nowTime: formatTime(seekTime)
      },
    })

    _videoRef.current?.seek(seekTime)
  }
  // 安卓返回按钮
  const _onBackPress = () => {
    return true
  }
  // 全屏旋转
  const _setVideoLayout = (fullScreen) => {
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

      paddingX.current = (screenWidth - _width) / 2 // 边距的值
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
  // 显示控制栏
  const _showControl = () => {
    if (!isLoad) {
      // 视频没有初始化的时候，禁止显示控制栏
      return
    }
    if (!showControl) {
      dispatch({
        type: 'setState',
        payload: {
          showControl: true,
        },
      })
      AnimatedOp.current.start()
      _activateAutoHide()
    } else {
      // 快速隐藏控件
      toofastHide.current.start(() => {
        dispatch({
          type: 'setState',
          payload: {
            showControl: false,
          },
        })
      })
    }
  }
  // 隐藏控件
  const _fastHideConts = () => {
    fastHide.current.start(() => {
      dispatch({
        type: 'setState',
        payload: {
          showControl: false,
        },
      })
    })
  }
  // 激活自动隐藏
  const _activateAutoHide = () => {
    // clearTimeout(TimeHideConts.current) // 拖动进度条时禁止隐藏控件
    // TimeHideConts.current = setTimeout(_fastHideConts, 5000)
  }

  const _onSeek = (e) => {
    console.log('_onSeek e:', e)
    props.onSeek && props.onSeek(e)
    dispatch({
      type: 'setState',
      payload: {
        isEnd: false,
      },
    })
  }

  const _onEnd = () => {
    if (!props.repeat) {
      dispatch({
        type: 'setState',
        payload: {
          // showControl: true,
          isPaused: true,
          isEnd: true,
        },
      })
    }
    if (!isPaused) {
      props.onEnd && props.onEnd()
    }
  }
  // 播放进度  包含进度条  以及当前播放时间
  const _onProgress = (e) => {
    props.onProgress && props.onProgress(e)

    if (e.currentTime === nowCurrentTime.current) {
      if (showLoading !== true) { // 减少不必要的刷新
        dispatch({
          type: 'setState',
          payload: {
            showLoading: true,
          },
        })
      }
    } else {
      if (showLoading !== false) { // 减少不必要的刷新
        dispatch({
          type: 'setState',
          payload: {
            showLoading: false,
          },
        })
      }
    }

    if (!isMoveDot.current) {
      nowCurrentTime.current = e.currentTime
      nowBufferX.current = e.playableDuration
    }

    dispatch({
      type: 'setState',
      payload: {
        nowTime: formatTime(e.currentTime),
      },
    })

    if (!isMoveDot.current) {
      dispatch({
        type: 'setState',
        payload: {
          sliderValue: [nowCurrentTime.current],
        },
      })
    }
  }
  // 快进
  const _onFastForward = (values) => {
    console.log('onValuesChangeFinish values:', values)
    nowCurrentTime.current = values[0]
    _videoRef.current?.seek(values[0])
    dispatch({
      type: 'setState',
      payload: {
        sliderValue: values
      },
    })
    isMoveDot.current = false
    // _activateAutoHide() // 手指离开后激活自动隐藏
    navigation && navigation.setParams({ enableGestures: true })
  }

  const _onBuffer = (e) => {
    console.log('_onBuffer e:', e)
    props.onBuffer && props.onBuffer(e)
    dispatch({
      type: 'setState',
      payload: {
        showLoading: !!e.isBuffering,
      },
    })
  }

  const _onLoadStart = () => {
    console.log('_onLoadStart')
    props.onLoadStart && props.onLoadStart()
    dispatch({
      type: 'setState',
      payload: {
        showLoading: true,
      },
    })
  }
  // 视频加载
  const _onLoad = async (data) => {
    console.log('_onLoad:', data);
    // 进度条动画
    // playDotX.current = dotX.current.interpolate({
    //   inputRange: [0, data.duration],
    //   outputRange: [0, progressBarLength.current.width],
    //   extrapolate: 'clamp',
    // })
    // // 缓存条
    // playBufferX.current = bufferX.current.interpolate({
    //   inputRange: [0, data.duration],
    //   outputRange: [0, progressBarLength.current.width],
    //   extrapolate: 'clamp',
    // })
    await dispatch({
      type: 'setState',
      payload: {
        duration: data.duration,
        allTime: formatTime(data.duration),
        isLoad: true,
        showLoading: false,
      },
    })
    props.onLoad && props.onLoad()
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

  const _onReadyForDisplay = () => {
    console.log('_onReadyForDisplay')
    props.onReadyForDisplay && props.onReadyForDisplay()
  }
  // 播放视频
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
  // 继续播放视频
  const _onPlay = async () => {
    const _isPause_ = !isPaused
    console.log('_onPlay isEnd:', isEnd, '_isPause_', _isPause_, 'isSuspended:', isSuspended)
    if (isEnd) {
      // 已经播放结束，重新开始播放
      _videoRef.current?.seek(0)

      await dispatch({
        type: 'setState',
        payload: {
          showPoster: false, // 正在播放不显示海报
          isPaused: false,
          isEnd: false,
          showLoading: !_isPause_,
          sliderValue: [0],
          nowTime: '00:00'
        },
      })
    } else {
      await dispatch({
        type: 'setState',
        payload: {
          showPoster: false, // 正在播放不显示海报
          isPaused: _isPause_,
          showLoading: !_isPause_,
        },
      })
      if (isSuspended) {
        console.log('处于暂停状态，还原播放进度')
        _videoRef.current?.seek(nowCurrentTime.current)

        await dispatch({
          type: 'setState',
          payload: {
            isSuspended: false,
            sliderValue: [nowCurrentTime.current],
            nowTime: formatTime(nowCurrentTime.current)
          },
        })
      }
    }

    props.onPlay && props.onPlay(_isPause_)
  }

  const _onBackButton = () => {
    console.log('_onBackButton')
    if (props.isFullScreen) {
      props.onModalFullScreen && props.onModalFullScreen({
        seekTime: nowCurrentTime.current,
        buffer: nowBufferX.current,
        paused: isPaused,
        isFull: false
      })
    } else {
      if (showControl) {
        props.onBackButton && props.onBackButton()
      }
    }
  }
  // 横屏切换
  const _onTapSwitchButton = () => {
    if (props.isFullScreen) {
      props.onModalFullScreen && props.onModalFullScreen({
        seekTime: nowCurrentTime.current,
        buffer: nowBufferX.current,
        paused: isPaused,
        isFull: false
      })
    } else {
      props.onFullScreen && props.onFullScreen({
        seekTime: nowCurrentTime.current,
        buffer: nowBufferX.current,
        paused: isPaused,
        isFull: true
      })
    }
  }

  // console.log(
  //   'videoPlayer videoTitle:', videoTitle, 'isModal:', props.isModal,
  //   'showVideo:', showVideo, 'isPaused:', isPaused,
  //   'isSuspended:', isSuspended, 'showPoster:', showPoster
  // )

  return (
    <View {..._panResponder.panHandlers}>
      <HeaderView
        statusBar={props.statusBar}
        statusBarBg={props.statusBarBg}
        barStyle={props.barStyle}
        isDark={props.isDark}
      />
      <View
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
            ],
            borderRadius: props.videoBarRadius,
          },
        ]}
      >
        {
          showVideo && videoUrl ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={_showControl}
            >
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
                  borderRadius: props.videoBarRadius,
                  width: videoWidth,
                  height: videoHeight
                }]}
              />
            </TouchableOpacity>
          ) : null
        }
        {
          // 显示封面
          (showPoster && poster !== null) ? (
            <View style={[lineStyles.videoStyles, props.videoStyles, { borderRadius: props.videoBarRadius }]}>
              <Image
                source={{ uri: poster }}
                style={{
                  borderRadius: props.videoBarRadius,
                  width: videoWidth,
                  height: videoHeight,
                }}
              />
            </View>
          ) : null
        }
        {
          !isError && showPlayBtn ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={_onStartPlay}
              style={lineStyles.controlPlayBtn}
            >
              <Image
                style={lineStyles.playButton}
                source={VideoImages.icon_control_play}
              />
            </TouchableOpacity>
          ) : null
        }
        {
          isError
            ? (
              <TouchableOpacity
                activeOpacity={1}
                style={lineStyles.controlPlayBtn}
                onPress={_onBackButton}
              >
                <Text style={{ color: '#fff' }}>视频播放出错暂时无法播放</Text>
              </TouchableOpacity>
            )
            : null
        }
        {
          showControl ? (
            <Animated.View
              style={[lineStyles.positionBar, {
                opacity: opacityControl.current,
                zIndex: 2,
              }]}
            >
              <View
                style={[lineStyles.headerBarStyle, {
                  borderTopLeftRadius: props.videoBarRadius,
                  borderTopRightRadius: props.videoBarRadius,
                  paddingTop: props.isFullScreen ? 30 : props.statusBarTrans ? statusBarHeight + 10 : 10,
                }, props.headerBarStyle]}
              >
                <BackView showBack={props.showBack} isFullScreen={props.isFullScreen} onBackButton={_onBackButton} />
                <TitleView isFullScreen={props.isFullScreen} showMinTitle={props.showMinTitle} videoTitle={videoTitle} />
              </View>
              <TouchableOpacity
                activeOpacity={1}
                style={[lineStyles.gFlexCenter, { flex: 1 }]}
                onPress={_showControl}
              >
                {
                  !showLoading ? (
                    <View style={[lineStyles.gFlexCenter, { flex: 1 }]}>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={lineStyles.playButton}
                        onPress={_onPlay}
                      >
                        <Image
                          style={lineStyles.playButton}
                          source={isPaused ? VideoImages.icon_control_play : VideoImages.icon_control_pause}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null
                }
              </TouchableOpacity>
              <View
                style={[{
                  flexDirection: 'row',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderBottomRightRadius: props.videoBarRadius,
                  borderBottomLeftRadius: props.videoBarRadius,
                }, props.footerBarStyle]}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    height: 50,
                  }}
                >
                  <View style={{ marginLeft: 15, width: 55, justifyContent: 'center', alignItems: 'flex-start' }} >
                    <Text style={{ color: '#ffffff' }}>
                      {nowTime}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }} onLayout={(e) => {
                    console.log('aaaaaa:', e.nativeEvent.layout)
                    dispatch({
                      type: 'setState',
                      payload: {
                        sliderLength: e.nativeEvent.layout.width,
                      },
                    })
                  }}>
                    <MultiSlider
                      // vertical={true}
                      // containerStyle={{
                      //   marginTop: 200 - 30,
                      //   marginLeft: 20,
                      //   left: '-50%',
                      // }}
                      // trackStyle={{
                      // height: 6,
                      // marginTop: -2
                      // }}
                      // onValuesChange={(values) => {
                      // console.log('onValuesChange values:', values)
                      // }}
                      values={sliderValue}
                      min={0}
                      max={duration}
                      sliderLength={sliderLength}
                      markerStyle={{ width: 14, height: 14 }}
                      onValuesChangeFinish={_onFastForward}
                      onValuesChangeStart={() => {
                        console.log('onValuesChangeStart')
                        isMoveDot.current = true
                        clearTimeout(TimeHideConts.current)// 拖动进度条时禁止隐藏控件
                        navigation && navigation.setParams({ enableGestures: false })
                      }}
                    />
                  </View>
                  <View style={{ width: 55, justifyContent: 'center', alignItems: 'flex-end' }} >
                    <Text style={{ color: '#ffffff' }}>
                      {allTime}
                    </Text>
                  </View>
                </View>
                {
                  props.showMuted
                    ? (
                      <TouchableOpacity
                        activeOpacity={1}
                        style={lineStyles.mutedBar}
                        onPress={() => {
                          let _muted_ = !muted
                          dispatch({
                            type: 'setState',
                            payload: {
                              muted: _muted_,
                            },
                          })
                          props.onMuted && props.onMuted(_muted_)
                        }}
                      >
                        <Image
                          style={lineStyles.controlSwitchBtn}
                          source={muted ? VideoImages.muted_off : VideoImages.muted_on}
                        />
                      </TouchableOpacity>
                    )
                    : null
                }
                {
                  props.enableSwitchScreen
                    ? (
                      <TouchableOpacity
                        activeOpacity={1}
                        style={lineStyles.screenBar}
                        onPress={_onTapSwitchButton}
                      >
                        <Image
                          style={lineStyles.controlSwitchBtn}
                          source={!props.isFullScreen
                            ? VideoImages.icon_control_shrink_screen
                            : VideoImages.icon_control_full_screen}
                        />
                      </TouchableOpacity>
                    )
                    : null
                }
              </View>
            </Animated.View>
          ) : null
        }
        <Loading showLoading={showLoading} videoHeight={videoHeight} videoWidth={videoWidth} />
      </View>
    </View>
  )
}

const BackView = memo((props: any) => {
  return useMemo(() => {
    if (!props.showBack && !props.isFullScreen) {
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={lineStyles.backButton}
        onPress={props.onBackButton}
      >
        <Image
          source={VideoImages.icon_back}
          style={{ width: 26, height: 26 }}
        />
      </TouchableOpacity>
    )
  }, [])
})

const TitleView = memo((props: any) => {
  return useMemo(() => {
    let view: React.ReactNode = null
    if (props.isFullScreen || (!props.isFullScreen && props.showMinTitle)) {
      view = (
        <Text
          style={[lineStyles.videoTitle, { fontSize: props.isFullScreen ? 20 : 14 }]}
          numberOfLines={1}
        >{props.videoTitle}</Text>
      )
    }
    return view
  }, [props.videoTitle])
})

const VideoPlayer = (props) => {
  const _showPoster = props.showPoster !== null ? props.showPoster : !props.autoPlay
  const init = {
    videoUrl: props.videoUrl,
    poster: props.poster,
    videoTitle: props.videoTitle,
    isPaused: !props.autoPlay,
    muted: props.muted,
    showPoster: _showPoster,
    showVideo: !_showPoster,
  }

  return (
    <VPlayerProvider init={init}>
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
  rate: [1, 1.5, 2, 3], // 视频播放的速率
  rateIndex: 0, // 播放速率
  isModal: false,
  showPoster: null,
  showMuted: true, // 是否显示静音按钮
  dotWdt: 14, // 圆点直径
  videoBarRadius: 0, // 圆角
  isFullScreen: false, // 是否全屏
}

const Component = VideoPlayer
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: any, ref) => (
  <Component {...props} refInstance={ref} />
))