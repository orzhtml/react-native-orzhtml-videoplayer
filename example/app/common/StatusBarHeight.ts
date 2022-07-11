import { Dimensions, Platform, StatusBar } from 'react-native'

const STATUSBAR_DEFAULT_HEIGHT = 20
const STATUSBAR_X_HEIGHT = 44
const STATUSBAR_IP12_HEIGHT = 47
const STATUSBAR_IP12MAX_HEIGHT = 47

const X_WIDTH = 375
const X_HEIGHT = 812

const XSMAX_WIDTH = 414
const XSMAX_HEIGHT = 896

const IP12_WIDTH = 390
const IP12_HEIGHT = 844

const IP12MAX_WIDTH = 428
const IP12MAX_HEIGHT = 926

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window')

let statusBarHeight = STATUSBAR_DEFAULT_HEIGHT
let isIPhoneXV = false
let isIPhoneXMaxV = false
let isIPhone12V = false
let isIPhone12MaxV = false
let isIPhoneWithMonobrowV = false

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
  if (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) {
    isIPhoneWithMonobrowV = true
    isIPhoneXV = true
    statusBarHeight = STATUSBAR_X_HEIGHT
  } else if (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT) {
    isIPhoneWithMonobrowV = true
    isIPhoneXMaxV = true
    statusBarHeight = STATUSBAR_X_HEIGHT
  } else if (W_WIDTH === IP12_WIDTH && W_HEIGHT === IP12_HEIGHT) {
    isIPhoneWithMonobrowV = true
    isIPhone12V = true
    statusBarHeight = STATUSBAR_IP12_HEIGHT
  } else if (W_WIDTH === IP12MAX_WIDTH && W_HEIGHT === IP12MAX_HEIGHT) {
    isIPhoneWithMonobrowV = true
    isIPhone12MaxV = true
    statusBarHeight = STATUSBAR_IP12MAX_HEIGHT
  }
}

export const isIPhoneX = () => isIPhoneXV
export const isIPhoneXMax = () => isIPhoneXMaxV
export const isIPhone12 = () => isIPhone12V
export const isIPhone12Max = () => isIPhone12MaxV
export const isIPhoneWithMonobrow = () => isIPhoneWithMonobrowV

const getExpoRoot = () => global.Expo || global.__expo || global.__exponent

export const isExpo = () => getExpoRoot() !== undefined

export function getStatusBarHeight(skipAndroid?: any) {
  return Platform.select({
    ios: statusBarHeight,
    android: skipAndroid ? 0 : StatusBar.currentHeight,
    default: 0,
  })
}
