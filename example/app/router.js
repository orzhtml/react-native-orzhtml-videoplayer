import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack'

import Home from './view/home'
import VideoList from './view/list'
import VideoDetails from './view/details'

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
      <RootStack.Navigator
        initialRouteName={'Home'}
        screenOptions={{
          headerShown: false
        }}
      >
        <RootStack.Screen name="Home" component={Home}
          options={{
            cardStyleInterpolator: forFade
          }}
        />
        <RootStack.Screen name="VideoList" component={VideoList}
          options={({ route }) => {
            const { params } = route
            return {
              gestureEnabled: params && params.enableGestures,
              ...TransitionPresets.SlideFromRightIOS
            }
          }}
        />
        <RootStack.Screen name="VideoDetails" component={VideoDetails}
          options={({ route }) => {
            const { params } = route
            return {
              gestureEnabled: params && params.enableGestures,
              ...TransitionPresets.SlideFromRightIOS
            }
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default Router