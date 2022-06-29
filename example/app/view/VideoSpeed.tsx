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
  // const [rotate, setRotate] = useState('0deg')

  // useEffect(() => {
  //   // setRotate('90deg')
  //   _timerRef.current = setTimeout(() => {
  //     clearTimeout(_timerRef.current)
  //     setValue(value + 1)
  //   }, 1000)
  //   return () => {
  //     clearTimeout(_timerRef.current)
  //   }
  // }, [value])

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
      <View style={{
        backgroundColor: 'red',
        width: 300,
        height: 300,
        marginLeft: 30,
        marginTop: 200,
        // transform: [
        //   {
        //     rotate: '90deg',
        //   },
        // ],
      }}>
        {/* <Slider
          style={{
            width: 200,
            backgroundColor: 'orange',
            transform: [{ rotate: '90deg' }]
          }}
          step={1}
          minimumValue={0}
          maximumValue={135}
          value={value}
          onSlidingComplete={(value) => setValue(value)}
          onValueChange={(value) => console.log(value)}
          minimumTrackTintColor={'yellow'}
        /> */}
        <MultiSlider
          values={[value]}
          customMarkerLeft={() => null}
          min={0}
          max={1417}
          vertical={true}
          sliderLength={200}
          containerStyle={{
            marginTop: 200 - 30,
            marginLeft: 20,
            left: '-50%',
          }}
          trackStyle={{ height: 6, marginTop: -2 }}
          markerStyle={{ width: 20, height: 20 }}
          onValuesChangeFinish={(values) => {
            console.log('onValuesChangeFinish values:', values)
          }}
          onValuesChangeStart={(values) => {
            console.log('onValuesChangeStart values:', values)
          }}
          onValuesChange={(values) => {
            console.log('onValuesChange values:', values)
          }}
        />
      </View>
    </View>
  )
}

export default VideoSpeed
