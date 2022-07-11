import { Dimensions, Platform } from 'react-native'

import { getStatusBarHeight } from './StatusBarHeight'

export const statusBarHeight = getStatusBarHeight()
export const screenWidth = Dimensions.get('screen').width
export const screenHeight = Dimensions.get('screen').height
export const defaultVideoHeight = screenWidth * 9 / 16
export const defaultVideoWidth = screenWidth

export const formatTime = (second): string => {
  let result = second
  let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
  let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
  if (Math.floor(result / 3600) === 0) {
    result = `${m}:${s}`
  } else {
    result = `${h}:${m}:${s}`
  }

  return result
}

export function isDownGesture(x, y) {
  return y > 0 && (y > Math.abs(x))
}

export function isUpGesture(x, y) {
  return y < 0 && (Math.abs(x) < Math.abs(y))
}

export function isHorizontalGesture(x, y) {
  return (Math.abs(x) < Math.abs(y))
}

export function isClickGesture(x, y) {
  return x === 0 && y === 0
}

export const isIOS = Platform.OS === 'ios'
