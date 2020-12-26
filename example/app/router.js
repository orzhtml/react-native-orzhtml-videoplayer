import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator
  // TransitionPresets
} from '@react-navigation/stack'

import Home from './view/home/Home'
import List from './view/list/List'

const RootStack = createStackNavigator()

// 渐变屏幕的配置
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress
  }
})

function Router () {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={'List'} screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Home" component={Home}
          options={{
            cardStyleInterpolator: forFade // CardStyleInterpolators.forFadeFromBottomAndroid
          }}
        />
        <RootStack.Screen name="List" component={List}
          options={{
            cardStyleInterpolator: forFade // CardStyleInterpolators.forFadeFromBottomAndroid
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default Router
