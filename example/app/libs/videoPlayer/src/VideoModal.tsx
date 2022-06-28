import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { StatusBar, View } from "react-native"
import Modal from 'react-native-modal'

import VideoPlayer from './VideoPlayer'

const VideoModal = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const videoPlayerRef = useRef<any>(null)
  const _videoModalRef = useRef<any>(null)
  const seekTime = useRef(0)
  const buffer = useRef(0)
  const paused = useRef<any>(true)

  useImperativeHandle(props.refInstance, () => ({
    onStopPlay: onStopPlay,
    onStopListPlay: onStopListPlay,
    onFullScreen: switchFullScreen
  }))

  const onFullScreen = (obj) => {
    console.log('VideoModal onFullScreen:', obj);
    videoPlayerRef.current?.onStopPlay()
    seekTime.current = obj.seekTime
    buffer.current = obj.buffer
    paused.current = obj.paused
    setModalVisible(obj.isFull)
  }

  const onModalFullScreen = (obj) => {
    console.log('VideoModal onModalFullScreen:', obj);
    _videoModalRef.current?.onStopPlay()
    seekTime.current = obj.seekTime
    buffer.current = obj.buffer
    paused.current = obj.paused
    console.log('Modal seekTime.current:', seekTime.current);
    console.log('Modal buffer.current:', buffer.current);
    console.log('Modal paused.current:', paused.current);
    setModalVisible(obj.isFull)
    videoPlayerRef.current && videoPlayerRef.current.updateVideo({
      seekTime: Math.max(0, obj.seekTime - 1),
      buffer: buffer.current,
      paused: paused.current,
    })
  }

  // 全屏加载完视频 dom
  const onModalLoad = () => {
    console.log('samll seekTime.current:', seekTime.current);
    console.log('samll buffer.current:', buffer.current);
    console.log('samll paused.current:', paused.current);
    _videoModalRef.current && _videoModalRef.current.updateVideo({
      seekTime: Math.max(0, seekTime.current - 1),
      buffer: buffer.current,
      paused: paused.current,
    })
  }

  const switchFullScreen = () => {
    videoPlayerRef.current?.onStopPlay()
    let cacheTime = videoPlayerRef.current?.getCacheTime()
    console.log('switchFullScreen:', cacheTime);
    seekTime.current = cacheTime.seekTime
    buffer.current = cacheTime.buffer
    paused.current = cacheTime.paused
    setModalVisible(true)
  }

  const onStopPlay = () => {
    console.log('VideoModal onStopPlay')
    videoPlayerRef.current && videoPlayerRef.current.onStopPlay()
  }

  const onStopListPlay = () => {
    console.log('VideoModal onStopListPlay')
    videoPlayerRef.current && videoPlayerRef.current.onStopListPlay()
  }

  return (
    <>
      <VideoPlayer
        {...props}
        ref={videoPlayerRef}
        onFullScreen={onFullScreen}
      />
      <Modal
        style={{ margin: 0 }}
        isVisible={isModalVisible}
        statusBarTranslucent={true}
        animationInTiming={10}
        animationOutTiming={10}
        backdropOpacity={0}
      >
        <VideoPlayer
          {...props}
          ref={_videoModalRef}
          isFullScreen={true}
          statusBar={() => <StatusBar hidden={true} translucent={true} />}
          isModal={true}
          autoPlay={false}
          onModalFullScreen={onModalFullScreen}
          onLoadStart={onModalLoad}
          showPoster={false}
        />
      </Modal>
    </>
  )
}

const Component = VideoModal

// 注意：这里不要在Component上使用ref;换个属性名字比如refInstance；不然会导致覆盖
export default forwardRef((props: any, ref) => (
  <Component {...props} refInstance={ref} />
))
