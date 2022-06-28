import { StyleSheet } from "react-native"

export const lineStyles = StyleSheet.create({
  videoStyles: {
    backgroundColor: '#000',
    position: 'relative',
  },
  playButton: {
    width: 60,
    height: 60,
  },
  controlPlayBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  backButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 14,
    color: 'white',
    flex: 1,
    marginHorizontal: 10,
    lineHeight: 26,
  },
  controlSwitchBtn: {
    width: 25,
    height: 25,
  },
})