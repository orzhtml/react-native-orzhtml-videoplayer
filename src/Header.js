import React from 'react'
import {
  View,
  StatusBar
} from 'react-native'
import { getStatusBarHeight } from '../libs/StatusBarHeight'

function Header ({ trans, isFullScreen }) {
  let backgroundColor = trans ? 'transparent' : '#000'

  return (
    <View style={{
      backgroundColor: backgroundColor,
      height: isFullScreen ? 0 : trans ? 0 : getStatusBarHeight()
    }}>
      <StatusBar translucent={true} backgroundColor={backgroundColor} barStyle={'light-content'} />
    </View>
  )
}

export default Header
