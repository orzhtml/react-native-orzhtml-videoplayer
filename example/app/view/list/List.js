import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'

// import { VideoPlayer } from '../../../video-player'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: [{
        videoUrl: '"http://cloudvideo.thepaper.cn/video/a2f1eb070179444da680d30caef98908/hd/e01de1c4-b064-464f-82a2-a8fe07329ae7-f26e56b3-57ef-cf43-86b0-43bf0ef84122.mp4"',
        videoImage: 'https://imagecloud.thepaper.cn/thepaper/image/105/622/12.jpg?x-oss-process=style/app750-280',
        videoTitle: '英国工党：将支持英欧贸易协议，尽管其“并不完善”',
        autoPlay: false
      }, {
        videoUrl: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/HK9.mp4',
        videoImage: 'https://kavt.oss-cn-shanghai.aliyuncs.com/VIDEO/667.png',
        videoTitle: '这是可全屏的播放组件',
        autoPlay: false
      }, {
        videoUrl: 'http://cloudvideo.thepaper.cn/video/06a0c211da0c46c1983b32e1c8fe93f4/hd/13491eb7-2959-4dfc-b927-8df4025d6a63-88eecb0f-c7d5-099d-5f53-4a0d096e5feb.mp4',
        videoImage: 'https://imagecloud.thepaper.cn/thepaper/image/105/635/474.jpg?x-oss-process=style/app750-280',
        videoTitle: '美媒：蓬佩奥早前隔离因妻子感染新冠病毒',
        autoPlay: false
      }, {
        videoUrl: 'http://cloudvideo.thepaper.cn/video/dfa3d37102c1482d8085e59d88c7a56a/hd/432936ec-3bf5-49f0-a2b3-29eeca13657b-75bd01e2-b1a1-a459-ac19-8d0a21992e7d.mp4',
        videoImage: 'https://imagecloud.thepaper.cn/thepaper/image/105/637/494.jpg?x-oss-process=style/app750-280',
        videoTitle: '英欧贸易协议达成，3分钟回顾英国5年脱欧之路',
        autoPlay: false
      }, {
        videoUrl: 'http://cloudvideo.thepaper.cn/video/79537fc09e5e432ba0d6537bbf287f32/hd/7e71f49d-856c-4e8f-b476-1f8037f6a8e2-df1c3199-eac6-4b6e-eb19-d6962fbf52bc.mp4',
        videoImage: 'https://imagecloud.thepaper.cn/thepaper/image/105/640/344.jpg?x-oss-process=style/app750-280',
        videoTitle: '菲律宾北部发生6.3级地震，首都震感强烈',
        autoPlay: false
      }, {
        videoUrl: 'http://cloudvideo.thepaper.cn/video/9220a11c1c5847368360c0e74f254f69/hd/4e77f397-e381-4145-a4fe-ca31972eaaad-051044b9-bd30-b8f4-cfa1-10b528e2b722.mp4',
        videoImage: 'https://imagecloud.thepaper.cn/thepaper/image/105/640/250.jpg?x-oss-process=style/app750-280',
        videoTitle: '黎巴嫩商贸行业遭遇史上最严重危机，四成商店关门',
        autoPlay: false
      }]
    }
  }

  render () {
    // const { videoUrl, videoImage, videoTitle, autoPlay } = this.state

    return (
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        {
          // <VideoPlayer videoUrl={videoUrl} statusBarTrans={true} videoTitle={videoTitle} autoPlay={autoPlay} poster={videoImage} />
        }
        <ScrollView>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
          <Text>这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件这是可全屏的播放组件</Text>
        </ScrollView>
      </View>
    )
  }
}

export default Home