import { StyleSheet } from 'react-native'

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
  positionBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerBarStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  gFlexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedBar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingLeft: 10,
    paddingRight: 15,
  },
  screenBar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingRight: 15,
  },
  loadingBar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRadius: 6,
  },
})
