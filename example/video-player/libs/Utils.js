import { Dimensions } from 'react-native'

import { getStatusBarHeight } from './StatusBarHeight'

export const statusBarHeight = getStatusBarHeight()
export const screenWidth = Dimensions.get('screen').width
export const screenHeight = Dimensions.get('screen').height
export const defaultVideoHeight = screenWidth * 9 / 16
export const defaultVideoWidth = screenWidth

export function formatTime (second) {
  let result = parseInt(second)
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
