import React, { forwardRef, useRef, useState, useImperativeHandle, useEffect } from "react"
import { StyleSheet, StatusBar, View, Animated, Easing, Text, TouchableOpacity } from "react-native"
import Modal from 'react-native-modal'

import { defaultVideoHeight, isIOS, screenHeight, screenWidth, statusBarHeight } from '../common/Utils'

const VideoPlayer = (props) => {
  const [rotate, setRotate] = useState('0deg')
  const [videoWidth, setVideoWidth] = useState(screenWidth)
  const [videoHeight, setVideoHeight] = useState(defaultVideoHeight)
  const [leftHeight, setLeftHeight] = useState(0)
  const [isFullScreen, setIsFulScreen] = useState(props.isFullScreen)

  useImperativeHandle(props.refInstance, () => ({
    onFullScreen: onFullScreen,
  }))

  useEffect(() => {
    if (props.isFullScreen) {
      console.log('isFullScreen:', props.isFullScreen);
      setVideoLayout(props.isFullScreen)
    }
  }, [])

  const setVideoLayout = (screen) => {
    let _width = screenHeight
    let _height = screenWidth
    let _left = -((screenHeight / 2) - (screenWidth / 2))
    let _rotate = '90deg'
    let _isFull = true

    if (!screen) {
      _width = screenWidth
      _height = defaultVideoHeight
      _left = 0
      _rotate = '0deg'
      _isFull = false
    }

    // console.log('_width:', _width);
    // console.log('_height:', _height);
    // console.log('_left:', _left);

    setVideoWidth(_width)
    setVideoHeight(_height)
    setLeftHeight(_left)
    setRotate(_rotate)
    setIsFulScreen(_isFull)
  }

  const onFullScreen = () => {

  }
  console.log('isFullScreenisFullScreen:', isFullScreen);
  return (
    <>
      {
        props.statusBar ? props.statusBar() : (
          <View style={{
            backgroundColor: 'yellow',
            height: isIOS ? statusBarHeight : 0,
          }}>
            <StatusBar hidden={isFullScreen} translucent={true} barStyle={props.isDark ? 'light-content' : 'dark-content'} />
          </View>
        )
      }
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
            ]
          },
        ]}
      >
        <Text style={{ fontSize: 40 }}>测试</Text>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 40 }}>测试</Text>
          <TouchableOpacity
            activeOpacity={1}
            style={lineStyles.btn}
            onPress={() => {
              let _isFullScreen = !isFullScreen
              console.log('_isFullScreen:', _isFullScreen)
              if (isFullScreen) {
                // 显示横屏后调用这个
                props.onModalFullScreen && props.onModalFullScreen(_isFullScreen)
              } else {
                // 非横屏调用这个
                props.onFullScreen && props.onFullScreen(_isFullScreen)
              }
              // spinRotate(!isFullScreen)
            }}
          >
            <Text>全屏</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const lineStyles = StyleSheet.create({
  btn: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 80,
    marginLeft: 30
  },
  videoStyles: {
    backgroundColor: '#00a0e4',
    padding: 10,
    borderWidth: 2,
    borderColor: 'red',
    position: 'relative',
  },
})

const Component = VideoPlayer
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: any, ref) => (
  <Component {...props} refInstance={ref} />
))