import React, { forwardRef, useRef, useState, useImperativeHandle, useEffect } from "react"
import { StyleSheet, StatusBar, View, Animated, Easing, Text, TouchableOpacity } from "react-native"

import { defaultVideoHeight, isIOS, screenHeight, screenWidth, statusBarHeight } from '../common/Utils'

const VideoPlayer = (props) => {
  let _spinValue = useRef<any>(new Animated.Value(1)).current
  const [rotate, setRotate] = useState('0deg')
  const [videoWidth, setVideoWidth] = useState(screenWidth)
  const [videoHeight, setVideoHeight] = useState(defaultVideoHeight)
  const [topHeight, setTopHeight] = useState(statusBarHeight)
  const [leftHeight, setLeftHeight] = useState(0)
  const [isFullScreen, setIsFulScreen] = useState(props.isFullScreen)

  useImperativeHandle(props.refInstance, () => ({
    onFullScreen: onFullScreen,
  }))

  useEffect(() => {
    if (props.isFullScreen) {
      console.log('isFullScreen:', props.isFullScreen);
      spinRotate(props.isFullScreen)
    }
  }, [])

  const spinRotate = (screen) => {
    _spinValue.setValue(0)
    Animated.timing(_spinValue, {
      toValue: 1, // 最终值 为1，这里表示最大旋转 360度
      duration: 0,
      useNativeDriver: false,
      easing: Easing.linear
    }).start(() => {
      setSpinAnimated(screen)
    })
  }

  const setSpinAnimated = (screen) => {
    let _width = [screenWidth, screenHeight]
    let _height = [defaultVideoHeight, screenWidth]
    let _top = [statusBarHeight, (screenHeight / 2) - (screenWidth / 2)]
    let _left = [0, -((screenHeight / 2) - (screenWidth / 2))]
    let _rotate = ['0deg', '90deg']
    let _isFull = true

    if (!screen) {
      _width = [screenHeight, screenWidth]
      _height = [screenWidth, defaultVideoHeight]
      _top = [(screenHeight / 2) - (screenWidth / 2), statusBarHeight]
      _left = [-((screenHeight / 2) - (screenWidth / 2)), 0]
      _rotate = ['90deg', '0deg']
      _isFull = false
    }

    console.log('_width:', _width);
    console.log('_height:', _height);
    console.log('_left:', _left);
    console.log('_top:', _top);

    const rot = _spinValue.interpolate({
      inputRange: [0, 1],//输入值
      outputRange: _rotate
    })
    let width = _spinValue.interpolate({
      inputRange: [0, 1],//输入值
      outputRange: _width //输出值
    })
    let height = _spinValue.interpolate({
      inputRange: [0, 1],//输入值
      outputRange: _height //输出值
    })
    let top = _spinValue.interpolate({
      inputRange: [0, 1],//输入值
      outputRange: _top //输出值
    })
    let left = _spinValue.interpolate({
      inputRange: [0, 1],//输入值
      outputRange: _left //输出值
    })

    setVideoWidth(width)
    setVideoHeight(height)
    setTopHeight(top)
    setLeftHeight(left)
    setRotate(rot)
    setIsFulScreen(_isFull)
    // props.changeFullScreen && props.changeFullScreen(_isFull)
  }

  const onFullScreen = () => {

  }

  return (
    <>
      {
        props.statusBar ? props.statusBar() : (
          <View style={{
            backgroundColor: 'yellow',
            height: isIOS ? statusBarHeight : 0,
          }}>
            <StatusBar translucent={true} barStyle={props.isDark ? 'light-content' : 'dark-content'} />
          </View>
        )
      }
      <Animated.View
        style={[
          lineStyles.videoStyles,
          props.videoStyles,
          {
            width: videoWidth,
            height: videoHeight,
            top: props.statusHeight ? props.statusHeight() : topHeight,
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
              props.onFullScreen && props.onFullScreen(_isFullScreen)
              setIsFulScreen(_isFullScreen)
              // spinRotate(!isFullScreen)
            }}
          >
            <Text>全屏</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    position: 'absolute',
    zIndex: 99
  },
})

const Component = VideoPlayer
// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: any, ref) => (
  <Component {...props} refInstance={ref} />
))