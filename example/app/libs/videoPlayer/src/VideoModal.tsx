import React, { useEffect, useRef, useState } from "react"
import { StatusBar, View } from "react-native"
import Modal from 'react-native-modal'

import { defaultVideoHeight, screenWidth } from "../common/Utils"

import VideoPlayer from './VideoPlayer'

const VideoModal = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const videoPlayerRef = useRef<any>(null)
  const _videoModalRef = useRef<any>(null)

  const onFullScreen = (isFull) => {
    // console.log('VideoModal onFullScreen:', isFull);
    setModalVisible(isFull)
  }

  const onModalFullScreen = (isFull) => {
    // console.log('VideoModal onModalFullScreen:', isFull);
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
            style={{ margin: 0 }}
            ref={_videoModalRef}
            isVisible={true}
            statusBarTranslucent={true}
            animationInTiming={10}
            animationOutTiming={10}
            backdropOpacity={0}
          >
            <VideoPlayer
              {...props}
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
