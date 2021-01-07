import React from 'react'
import {
  View,
  Text,
  Animated
} from 'react-native'

import { formatTime } from '../libs/Utils'

// 进度条
class Speed extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      nowTime: '00:00', // 当前播放时长
      dotStart: false, // 是否按住了进度条上的点
      dotWidth: 0,
      progressBarLength: {
        width: props.videoWidth - 200
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
    console.log('onlayout:', JSON.stringify(e.nativeEvent.layout))
    const { setProgressBarLength } = this.props
    setProgressBarLength && setProgressBarLength(e.nativeEvent.layout)
    this.setState({
      progressBarLength: e.nativeEvent.layout
    })
  }

  render () {
    const { props } = this
    const { nowTime, dotStart, dotWidth, progressBarLength } = this.state
    // console.log(`render Speed dotStart:${dotStart} dotWidth:${dotWidth}`)
    // console.log('speed props.playDotX:', props.playDotX)
    // console.log('speed props.playBufferX:', props.playBufferX)
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          height: 50
        }}
        onLayout={(e) => {
          console.log('onlayout bar e:', JSON.stringify(e.nativeEvent.layout))
        }}
      >
        <View
          style={{ marginLeft: 15, width: 90, justifyContent: 'center' }}
          onLayout={(e) => {
            console.log('onlayout bar time e:', JSON.stringify(e.nativeEvent.layout))
          }}
        >
          <Text style={{ color: '#ffffff' }}>
            {nowTime === '00:00' ? props.nowTime : nowTime}/{props.allTime === null ? '00:00' : props.allTime}
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
            marginRight: 5
          }}
          onLayout={this.onLayout}
        >
          {/* 总进度 */}
          <View style={{
            height: 2,
            backgroundColor: 'rgba(137,137,137,0.8)',
            position: 'absolute',
            width: progressBarLength.width,
            zIndex: 1,
            left: 0,
            right: 0
          }} />
          {/* 缓存条 */}
          <Animated.View style={{
            width: (props.playBufferX && props.playBufferX !== undefined && props.playBufferX !== null ? props.playBufferX : 0),
            height: 2,
            backgroundColor: '#aaa',
            position: 'absolute',
            left: 0,
            zIndex: 2
          }} />
          {/* 进度条 */}
          <Animated.View
            style={{
              width: dotStart ? dotWidth : (props.playDotX && props.playDotX !== undefined && props.playDotX !== null ? props.playDotX : 0),
              height: 2,
              backgroundColor: '#fff',
              zIndex: 3
            }}
          />
          {/* 进度条上的点 */}
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              left: dotStart ? dotWidth : (props.playDotX && props.playDotX !== undefined && props.playDotX !== null ? props.playDotX : 0),
              width: props.dotWdt,
              height: props.dotWdt,
              marginLeft: -(props.dotWdt / 2),
              position: 'absolute',
              zIndex: 4
            }}
            {...props.panHandlers}
          >
            <View
              ref={ref => this.dotSpeed = ref}
              style={{
                backgroundColor: 'rgba(255,255,255,1)',
                height: 14,
                width: 14,
                borderRadius: 14
              }}
            />
          </Animated.View>
        </View>
      </View>
    )
  }
}

export default Speed
