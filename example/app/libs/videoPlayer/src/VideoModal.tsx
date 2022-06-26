import React, { useRef, useState } from "react"
import { StatusBar } from "react-native"
import Modal from 'react-native-modal'

import VideoPlayer from './VideoPlayer'

const VideoModal = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const videoPlayerRef = useRef<any>(null)
  const _videoModalRef = useRef<any>(null)

  const onFullScreen = (isFull) => {
    // console.log('VideoModal onFullScreen:', isFull);
    videoPlayerRef.current?.onStopPlay()
    setModalVisible(isFull)
  }

  const onModalFullScreen = (isFull) => {
    // console.log('VideoModal onModalFullScreen:', isFull);
    _videoModalRef.current?.onStopPlay()
    setModalVisible(isFull)
  }

  return (
    <>
      <VideoPlayer
        {...props}
        ref={videoPlayerRef}
        isFullScreen={false}
        onFullScreen={onFullScreen}
      />
      {
        isModalVisible ? (
          <Modal
            {...props}
            style={{ margin: 0, position: 'relative', zIndex: 2 }}
            isVisible={true}
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
              onModalFullScreen={onModalFullScreen}
            />
          </Modal>
        ) : null
      }
    </>
  )
}

export default VideoModal
