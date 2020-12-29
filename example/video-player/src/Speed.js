import React from 'react'
import {
  View,
  Text,
  Animated
} from 'react-native'

import { formatTime } from '../libs/FormatTime'

// 进度条
class Speed extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      nowTime: '00:00', // 当前播放时长
      dotStart: false, // 是否按住了进度条上的点
      dotWidth: 0,
      progressBarLength: {
        width: props.videoWidth - 228
      }
    }
  }

  setNativeProps = (data) => {
    this.dotSpeed.setNativeProps(data)
  }

  setDotWidth = (dotWidth) => {
    this.setState({ dotWidth })
  }

  setSpeed = (e) => {
    if (this.nowTime !== parseInt(e.currentTime)) {
      this.nowTime = parseInt(e.currentTime)
      this.props.isMoveDot
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
    const { dotStart } = this.state
    if (e && !dotStart) {
      this.setState({ dotStart: true })
    }

    if (!e && dotStart) {
      this.setState({ dotStart: false })
    }
  }

  onLayout = (e) => {
    console.log('onlayout:', e.nativeEvent.layout)
    const { setProgressBarLength } = this.props
    setProgressBarLength && setProgressBarLength(e.nativeEvent.layout)
    this.setState({
      progressBarLength: e.nativeEvent.layout
    })
  }

  render () {
    const { props } = this
    const { nowTime, dotStart, dotWidth, progressBarLength } = this.state
    // console.log(`render Speed dotStart:${dotStart} dotWidth:${dotWidth} barwidth:${progressBarLength.width}`)
    // console.log('speed props.playDotX:', props.playDotX)
    // console.log('speed props.playBufferX:', props.playBufferX)
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          paddingLeft: 15,
          height: 50
        }}
        onLayout={(e) => {
          console.log('onlayout bar e:', e.nativeEvent.layout)
        }}
      >
        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
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
            zIndex: 2
          }}
          onLayout={this.onLayout}
        >
          {/* 总进度 */}
          <View style={{
            height: 2,
            backgroundColor: '#aaa',
            position: 'absolute',
            width: progressBarLength.width,
            zIndex: 1,
            left: 0,
            right: 0
          }} />
          {/* 缓存条 */}
          <Animated.View style={{
            width: props.playBufferX || 0,
            height: 2,
            backgroundColor: '#fff',
            position: 'absolute',
            left: 0,
            zIndex: 2
          }} />
          {/* 进度条 */}
          <Animated.View
            style={{
              width: dotStart ? dotWidth : (props.playDotX || 0),
              height: 2,
              backgroundColor: 'red',
              zIndex: 3
            }}
          />
          {/* 进度条上的点 */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              left: -8,
              width: 16,
              height: 16,
              position: 'relative',
              zIndex: 4
            }}
            {...props.panHandlers}
          >
            <View
              ref={ref => this.dotSpeed = ref}
              style={{
                backgroundColor: 'rgba(255,255,255,1)',
                height: 16,
                width: 16,
                borderRadius: 16
              }}
            />
          </View>
        </View>
        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#ffffff' }}>{props.allTime === null ? '00:00' : props.allTime}</Text>
        </View>
      </View>
    )
  }
}

export default Speed
