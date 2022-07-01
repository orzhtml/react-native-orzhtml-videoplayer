import React from "react"
import { View, Text, Button } from "react-native"
import { useStateCB, useSingleState, useSingleInstanceVar } from "react-native-orzhtml-usecom"

import { getStatusBarHeight } from '../common/StatusBarHeight'

const UseComView = (props) => {
  const instanceVal = useSingleInstanceVar<any>({
    interval: null
  })
  const [getCount, setCount] = useStateCB(0)
  const [state, setState] = useSingleState({
    count: 0,
    time: +new Date()
  })

  const doSomeActions = () => {
    console.log('doSomeActions Current count:', getCount())
  }

  const doSomeActions2 = () => {
    console.log("doSomeActions2 Current count:", state.count)
  }

  const start = () => {
    stop()
    instanceVal.interval = setInterval(
      () => setState({ count: state.count + 1 }),
      1000
    )
  }

  const stop = () => {
    const interval = instanceVal.interval
    interval && clearInterval(interval)
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: getStatusBarHeight() }} />
      <Text>{getCount()}</Text>
      <Button
        onPress={() => {
          setCount(getCount() + 1, doSomeActions)
        }}
        title="demo Increase"
      />
      <Text>useSingleState</Text>
      <Text>{state.count} {state.time}</Text>
      <Button
        onPress={() => {
          setState(
            {
              count: state.count + 1
            },
            doSomeActions2
          )
        }}
        title="Increase"
      />
      <Button
        onPress={() => {
          setState({
            time: +new Date()
          })
        }}
        title="Change Time"
      />
      <Button onPress={start} title="Start" />
      <Button onPress={stop} title="Stop" />
    </View>
  )
}

export default UseComView
