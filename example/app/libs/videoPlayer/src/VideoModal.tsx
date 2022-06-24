import React, { useState } from "react"
import { StatusBar, View } from "react-native"
import Modal from 'react-native-modal'

import VideoPlayer from './VideoPlayer'

const VideoModal = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const onFullScreen = (isFull) => {
    console.log('VideoModal onFullScreen:', isFull);
    setModalVisible(isFull)
  }

  const onModalFullScreen = (isFull) => {
    console.log('VideoModal onModalFullScreen:', isFull);
    setModalVisible(isFull)
  }

  return (
    <View>
      <VideoPlayer {...props} isFullScreen={false} isModal={false} onFullScreen={onFullScreen} />
      {
        isModalVisible ? (
          <Modal
            {...props}
            style={{ margin: 0 }}
            isVisible={true}
            statusBarTranslucent={true}
            animationInTiming={10}
            animationOutTiming={10}
            backdropOpacity={0}
          >
            <VideoPlayer
              isFullScreen={true}
              statusBar={() => <StatusBar hidden={true} translucent={true} />}
              isModal={true}
              onModalFullScreen={onModalFullScreen}
            />
          </Modal>
        ) : null
      }
    </View>
  )
}

export default VideoModal
