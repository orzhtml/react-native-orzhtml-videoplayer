/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Router from './app/router'

const App = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor='transparent' barStyle={'dark-content'} />
      <Router />
    </SafeAreaProvider>
  )
}

export default App;
