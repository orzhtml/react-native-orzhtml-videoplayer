import React, { useReducer, createContext } from 'react'
import { defaultVideoHeight, screenWidth } from '../common/Utils'

interface IProps {
  children: React.ReactNode;
  init: any;
}

const initialState = {
  rotate: '0deg', // 角度
  videoWidth: screenWidth, // 视频可视宽
  videoHeight: defaultVideoHeight, // 视频可视高
  leftHeight: 0, // 修正全屏后距离左边的间距
  poster: null, // 加载视频时要显示的图像
  videoUrl: '', // 视频地址
  videoTitle: '', // 视频标题
  rateIndex: 0, // 播放速率
  muted: false, // 控制音频是否静音
  duration: 0, // 视频的时长
  trackBuffer: 0, // 视频缓存
  allTime: '00:00', // 视频时长显示的值
  nowTime: '00:00', // 时间
  refreshVideo: false, // 是否刷新视频节点
  isPaused: true, // 是否暂停，默认暂停
  isLoad: false, // 视频是否加载完成
  isSuspended: false, // 是否处于暂停状态
  isEnd: false, // 是否播放结束
  isError: false, // 视频无法播放
  showPoster: false, // 是否显示海报
  showLoading: false, // 是否显示正在加载
  showControl: false, // 是否显示控制栏
  showVideo: false, // 检查是否先显示封面，不显示封面则直接显示视频播放器
  showPlayBtn: true, // 默认显示播放按钮
  sliderValue: 0, // 进度条点
  sliderLength: 200, // 进度条默认长度
}

function VPlayerReducer(state: any, action: { type: string; payload: object }) {
  switch (action.type) {
    case 'reset':
      return initialState
    case 'setState':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export const VPlayerContext = createContext({})

export const VPlayerProvider = (props: IProps) => {
  const [state, dispatch] = useReducer(VPlayerReducer, { ...initialState, ...props.init })

  return (
    <VPlayerContext.Provider value={{ state, dispatch }}>
      {props.children}
    </VPlayerContext.Provider>
  )
}
