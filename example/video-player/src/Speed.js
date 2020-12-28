import React from 'react'
import {
  View,
  Animated,
  Text
} from 'react-native'

import { formatTime } from '../libs/FormatTime'

// 进度条
class Speed extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      allTime: '00:00', // 总时长
      nowTime: '00:00', // 当前播放时长
      dotStart: false, // 是否按住了进度条上的点
      dotWidth: 0
    }
  }

  setNativeProps = (data) => {
    this.refs.dotspeed.setNativeProps(data)
  }

  setDotWidth = (dotWidth) => {
    this.setState({ dotWidth })
  }

  setSpeed = (e) => {
    if (this.nowTime !== parseInt(e.currentTime)) {
      this.nowTime = parseInt(e.currentTime)

      this.props.ismoveDot
        ? this.setState({
          nowTime: formatTime(e.currentTime)

        })
        : this.setState({
          nowTime: formatTime(e.currentTime),
          dotStart: false
        })
    }
  }

  setDotStart = (e) => {
    const dotStart = this.state.dotStart
    if (e && !dotStart) {
      this.setState({ dotStart: true })
    }

    if (!e && dotStart) {
      this.setState({ dotStart: false })
    }
  }

  render () {
    const { props } = this
    const { nowTime, dotStart, dotWidth } = this.state
    return (
      <View style={{
        flex: 1,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap'
      }}>
        <Text style={{ color: '#ffffff' }}>
          {props.admRePlay ? '00:00' : (nowTime === '00:00' ? props.nowTime : nowTime)}
        </Text>

        <View style={{
          width: props.videoWidth - 180,
          paddingHorizontal: 10,
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* 进度条 */}
          <Animated.View style={{
            width: dotStart ? dotWidth : props.admRePlay ? 0 : (props.playDotX === null ? 0 : props.playDotX),
            height: 2,
            backgroundColor: '#e54602'
          }} />
          {/* 缓存条 */}
          <Animated.View style={{
            width: props.playBufferX === null ? 0 : props.admRePlay ? 0 : props.playBufferX,
            height: 2,
            backgroundColor: '#ffffff',
            position: 'absolute',
            left: 10
          }} />
          {/* 进度条上的点 */}
          <View
            style={{
              padding: 12,
              left: -14,
              backgroundColor: 'rgba(0,0,0,0)'
            }}
            {...props.panHandlers}
          >
            <View
              ref={'dotspeed'}
              style={{
                height: 10,
                width: 10,
                borderRadius: 10,
                backgroundColor: '#e54602',
                borderWidth: 4,
                padding: 4,
                left: -2,
                borderColor: 'rgba(255,255,255,0)'
              }}
            />
          </View>
          {/* 总进度 */}
          <View style={{
            height: 2,
            backgroundColor: 'rgba(0,0,0,0.4)',
            position: 'absolute',
            width: props.videoWidth - 200,
            zIndex: 9,
            left: 10
          }} />
        </View>
        <Text style={{ color: '#ffffff' }}>{props.admRePlay ? '00:00' : props.allTime}</Text>
      </View>
    )
  }
}

export default Speed
