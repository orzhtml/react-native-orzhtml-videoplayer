import React, { useCallback, useRef, useState } from "react"
import { View, FlatList, TouchableOpacity, Text } from "react-native"

import { getStatusBarHeight } from '../common/StatusBarHeight'

import VideoCell from './VideoCell'

const VideoList = (props: any) => {
  const [videoList, setVideoList] = useState([{
    newsId: '1111',
    videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
    poster: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
    videoTitle: '英国工党：将支持英欧贸易协议，尽管其“并不完善”',
    isPaused: true,
    isModal: false
  }, {
    newsId: '1112',
    videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
    poster: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
    videoTitle: '这是可全屏的播放组件',
    isPaused: true,
    isModal: true
  }, {
    newsId: '1113',
    videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
    poster: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
    videoTitle: '美媒：蓬佩奥早前隔离因妻子感染新冠病毒',
    isPaused: true,
    isModal: false
  }, {
    newsId: '1114',
    videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
    poster: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
    videoTitle: '英欧贸易协议达成，3分钟回顾英国5年脱欧之路',
    isPaused: true,
    isModal: true
  }, {
    newsId: '1115',
    videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
    poster: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
    videoTitle: '菲律宾北部发生6.3级地震，首都震感强烈',
    isPaused: true,
    isModal: false
  }, {
    newsId: '1116',
    videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
    poster: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
    videoTitle: '黎巴嫩商贸行业遭遇史上最严重危机，四成商店关门',
    isPaused: true,
    isModal: true
  }, {
    newsId: '1117',
    videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
    poster: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
    videoTitle: '女子手卡绞肉机，正献血消防员飞奔出警',
    isPaused: true,
    isModal: false
  }])
  const [curPlayId, setCurPlayId] = useState('') // 记录当前正在播放的视频
  const _flatListRef = useRef<FlatList>(null)
  const { navigation } = props

  const _renderItemComponent = useCallback(({ item, index }) => {
    return (
      <VideoCell
        navigation={navigation}
        data={item}
        idx={index}
        stopOtherPlayer={stopOtherPlayer}
        isPaused={!(item.newsId === curPlayId)}
      />
    )
  }, [curPlayId])

  const stopOtherPlayer = (id) => {
    console.log('stopOtherPlayer:', id);
    setCurPlayId(id)
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: getStatusBarHeight() }} />
      <FlatList
        ref={_flatListRef}
        style={{ position: 'relative', zIndex: 1 }}
        extraData={[videoList, curPlayId]}
        ListHeaderComponent={(
          <TouchableOpacity
            style={{
              backgroundColor: 'red', height: 40, paddingHorizontal: 10,
              alignItems: 'center', justifyContent: 'center'
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff' }}>返回</Text>
          </TouchableOpacity>
        )}
        data={videoList}
        renderItem={_renderItemComponent}
        keyExtractor={(item, index) => `item-${item.newsId}-${index}`}
      />
    </View>
  )
}

export default VideoList
