import {
  formatTime, statusBarHeight, screenWidth,
  screenHeight, defaultVideoHeight, defaultVideoWidth
} from './libs/Utils'

import {
  isIPhoneX, isIPhoneXMax, isIPhone12, isIPhone12Max,
  isIPhoneWithMonobrow, getStatusBarHeight
} from './libs/StatusBarHeight'

import VideoPlayer from './src/VideoPlayer'

import VideoModal from './src/VideoModal'

export {
  VideoPlayer,
  VideoModal,

  formatTime,
  statusBarHeight,
  screenWidth,
  screenHeight,
  defaultVideoHeight,
  defaultVideoWidth,

  isIPhoneX,
  isIPhoneXMax,
  isIPhone12,
  isIPhone12Max,
  isIPhoneWithMonobrow,
  getStatusBarHeight
}
