import React, { FC } from 'react'
import { StatusBar, View } from 'react-native'

import { isIOS, statusBarHeight } from '../common/Utils'

interface HeaderProps {
  [p: string]: any;
  statusBar: () => any;
  statusBarBg: any;
  barStyle: any;
  isDark: any;
}

const Header: FC<HeaderProps> = (props) => {
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
