import React from "react"
import { StatusBar, View } from "react-native"

import { isIOS, statusBarHeight } from "../common/Utils"

const Header = (props) => {

  if (props.statusBar) {
    return props.statusBar()
  }

  return (
    <View style={{
      backgroundColor: props.statusBarBg || 'transparent',
      height: isIOS ? statusBarHeight : 0,
    }}>
      <StatusBar
        translucent={true}
        barStyle={props.barStyle || props.isDark ? 'light-content' : 'dark-content'}
      />
    </View>
  )
}

export default Header