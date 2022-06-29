import React, { forwardRef, useRef, useState, useImperativeHandle, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  Animated,
} from 'react-native'

import { formatTime } from '../common/Utils'

type SpeedProps = {
  ref?: any;
  nowTime?: string;
  panHandlers?: any;
  allTime?: any;
  playDotX?: any;
  playBufferX?: any;
  isMoveDot?: any;
  videoWidth?: number;
  setProgressBarLength?: any;
  dotWdt?: number;
}

// 进度条
const Speed = (props) => {
  const [nowTime, setNowTime] = useState('00:00') // 当前播放时长
  const [dotStart, setDotStart] = useState(false) // 是否按住了进度条上的点
  const [dotWidth, setDotWidth] = useState(0)
  const [progressBarLength, setProgressBarLength] = useState<{
    height?: number;
    width?: number;
  }>({
    width: props.videoWidth - 200,
  })
  const [playDotX, setPlayDotX] = useState(props.playDotX)

  const dotSpeed = useRef<any>(null)
  const _nowTime = useRef<any>()

  useImperativeHandle(props.refInstance, () => ({
    setNativeProps: setNativeProps,
    setSpeed: setSpeed,
    setDotWidth: _setDotWidth,
    setDotStart: _setDotStart,
    getDotWidth: getDotWidth,
  }))

  useEffect(() => {
    setPlayDotX(props.playDotX)
  }, [props.playDotX])

  const setNativeProps = (data) => {
    dotSpeed.current?.setNativeProps(data)
  }

  const _setDotWidth = (_dotWidth) => {
    console.log('setDotWidth:', _dotWidth);
    setDotWidth(_dotWidth)
  }

  const getDotWidth = useCallback(() => {
    return dotWidth
  }, [dotWidth])

  const setSpeed = (e) => {
    if (_nowTime.current !== parseInt(e.currentTime)) {
      _nowTime.current = parseInt(e.currentTime)
      setNowTime(formatTime(e.currentTime))
      if (!props.isMoveDot) {
        setDotStart(false)
      }
    }
  }

  const _setDotStart = (e) => {
    if (e && !dotStart) {
      setDotStart(true)
    }

    if (!e && dotStart) {
      setDotStart(false)
    }
  }

  const onLayout = (e) => {
    console.log('onlayout:', JSON.stringify(e.nativeEvent.layout))
    props.setProgressBarLength && props.setProgressBarLength(e.nativeEvent.layout)
    setProgressBarLength(e.nativeEvent.layout)
  }

  let _left = dotStart ? dotWidth : (playDotX && playDotX !== undefined && playDotX !== null ? playDotX : 0)

  console.log('playDotX:', _left, 'dotStart:', dotStart, 'dotWidth:', dotWidth);

  return (
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
          {nowTime === '00:00' ? props.nowTime : nowTime}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
        onLayout={onLayout}
      >
        {/* 总进度 */}
        <View style={{
          height: 2,
          backgroundColor: 'rgba(137,137,137,0.8)',
          position: 'absolute',
          zIndex: 1,
          left: 0,
          right: 0,
          width: progressBarLength.width,
        }} />
        {/* 缓存条 */}
        <Animated.View style={{
          height: 2,
          backgroundColor: '#aaa',
          position: 'absolute',
          left: 0,
          zIndex: 2,
          width: (props.playBufferX && props.playBufferX !== undefined && props.playBufferX !== null ? props.playBufferX : 0),
        }} />
        {/* 进度条 */}
        <Animated.View
          style={{
            height: 2,
            backgroundColor: '#fff',
            zIndex: 3,
            width: _left,
          }}
        />
        {/* 进度条上的点 */}
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 4,
            left: _left,
            width: props.dotWdt,
            height: props.dotWdt,
            marginLeft: -(props.dotWdt / 2),
          }}
          {...props.panHandlers}
        >
          <View
            ref={dotSpeed}
            style={{
              backgroundColor: 'rgba(255,255,255,1)',
              height: 14,
              width: 14,
              borderRadius: 14,
            }}
          />
        </Animated.View>
      </View>
      <View style={{ width: 55, justifyContent: 'center', alignItems: 'flex-end' }} >
        <Text style={{ color: '#ffffff' }}>
          {props.allTime === null ? '00:00' : props.allTime}
        </Text>
      </View>
    </View>
  )
}

const Component = Speed
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: SpeedProps, ref) => (
  <Component {...props} refInstance={ref} />
))
