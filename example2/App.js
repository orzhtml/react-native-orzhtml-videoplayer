/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react'
import {
  StatusBar
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Orientation from 'react-native-orientation-locker'

import Router from './app/router'

const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait()
  }, [])

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor='transparent' barStyle={'dark-content'} />
      <Router />
    </SafeAreaProvider>
  )
}

export default App
