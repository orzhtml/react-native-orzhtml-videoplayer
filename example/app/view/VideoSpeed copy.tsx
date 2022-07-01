import React, { useEffect, useRef, useState } from "react"
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import MultiSlider from '../libs/videoPlayer/libs/speed/MultiSlider';

import { getStatusBarHeight } from '../common/StatusBarHeight'

const VideoSpeed = (props) => {
  const [value, setValue] = useState(0)
  const _timerRef = useRef<any>(null)
  const [changeRotate, setChangeRotate] = useState(false)
  const [rotate, setRotate] = useState('0deg')

  console.log('value:', value)
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: getStatusBarHeight() }} />
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => {
          clearTimeout(_timerRef.current)
          setValue(value + 10)
        }}
      >
        <Text>点击</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => {
          let _changeRotate = !changeRotate
          setChangeRotate(_changeRotate)
          if (_changeRotate) {
            setRotate('90deg')
          } else {
            setRotate('0deg')
          }
        }}
      >
        <Text>旋转</Text>
      </TouchableOpacity>
      <View style={{
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 300,
        height: 300,
        marginLeft: 30,
        marginTop: 200,
        transform: [
          {
            rotate: rotate,
          },
        ],
      }}>
        <View />
        <View style={{ backgroundColor: 'blue' }}>
          <MultiSlider
            values={value}
            min={0}
            max={1417}
            // enableLabel={true}
            vertical={changeRotate}
            sliderLength={200}
            containerStyle={{ height: 14 }}
            markerStyle={{ width: 14, height: 14 }}
            onValuesChangeFinish={(values) => {
              console.log('onValuesChangeFinish values:', values)
              setValue(values)
            }}
            onValuesChangeStart={() => {
              console.log('onValuesChangeStart')
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default VideoSpeed
