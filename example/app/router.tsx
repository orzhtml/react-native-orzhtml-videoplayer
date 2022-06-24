import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

import Home from './view/Home'
import VideoDetails from './view/VideoDetails'
import VideoList from './view/VideoList'
import ListDetails from './view/ListDetails'
import VModal from './view/VModal'

const RootStack = createStackNavigator()

// 渐变屏幕的配置
const forFade = (configs: any) => ({
  cardStyle: {
    opacity: configs.current.progress,
  },
})

const Router = () => {
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
          options={(configs: any) => {
            const { params } = configs.route
            return {
              gestureEnabled: params && params.enableGestures,
              ...TransitionPresets.SlideFromRightIOS
            }
          }}
        />
        <RootStack.Screen name="VideoDetails" component={VideoDetails}
          options={(configs: any) => {
            const { params } = configs.route
            return {
              gestureEnabled: params && params.enableGestures,
              ...TransitionPresets.SlideFromRightIOS
            }
          }}
        />
        <RootStack.Screen name="ListDetails" component={ListDetails}
          options={(configs: any) => {
            const { params } = configs.route
            return {
              gestureEnabled: params && params.enableGestures,
              ...TransitionPresets.SlideFromRightIOS
            }
          }}
        />
        <RootStack.Screen name="VModal" component={VModal}
          options={(configs: any) => {
            const { params } = configs.route
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
