import React from 'react'
import { View, Image, Text, TouchableOpacity, PixelRatio, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Slider from '@react-native-community/slider'

export const onePixel = 1 / PixelRatio.get()

const playRateItems = [1.0, 1.25, 1.5, 2.0]
const endTimeItems = ['不开启', '播完当前', '30:00', '60:00']
const maxVolume = 100

class MoreSettingView extends React.Component {
  static defaultProps = {
    selectedRate: 1.0,
    selectedEndTimeIndex: -1,
    isMuted: false,
    isDownload: false,
    volume: 1.0
  };

  static propTypes = {
    onCloseWindow: PropTypes.func,
    onPlayRateChanged: PropTypes.func,
    onEndTimeSelected: PropTypes.func,
    onFavoriteTapped: PropTypes.func,
    onDownloadTapped: PropTypes.func,
    onMuteVolumeTapped: PropTypes.func,
    onVolumeChange: PropTypes.func
  };

  constructor (props) {
    super(props)
    this.state = {
      isMute: this.props.isMuted,
      isDownload: this.props.isDownload,
      volume: this.props.volume,
      selectedRate: this.props.selectedRate,
      selectedEndTimeIndex: this.props.selectedEndTimeIndex
    }
  }

  _onTapBackground = () => {
    this.props.onCloseWindow && this.props.onCloseWindow()
  };

  _onTapFavorite = () => {
    this.props.onFavoriteTapped && this.props.onFavoriteTapped()
  };

  _onTapDownload = () => {
    this.props.onDownloadTapped && this.props.onDownloadTapped()
  };

  _onTapMute = () => {
    const isMute = !this.state.isMute
    this.props.onMuteVolumeTapped && this.props.onMuteVolumeTapped(isMute)
  };

  _onSliderValueChange = (value) => {
    const isMute = (value === 0)
    this.setState({
      volume: value,
      isMute: isMute
    })
    this.props.onVolumeChange && this.props.onVolumeChange(value)
  };

  onChangeRate (item) {
    this.setState({
      selectedRate: item
    })
    this.props.onPlayRateChanged && this.props.onPlayRateChanged(item)
  }

  onChangeEndTime (index) {
    this.setState({
      selectedEndTimeIndex: index
    })
    this.props.onEndTimeSelected && this.props.onEndTimeSelected()
  }

  render () {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.container, this.props.style]}
        onPress={this._onTapBackground}
      >
        <View style={styles.contentView}>
          <View style={styles.optionView}>
            <TouchableOpacity style={styles.itemView} onPress={this._onTapFavorite}>
              <Image
                source={imgSource.icon_video_favorite}
                style={styles.imageItem}
              />
              <Text style={styles.textItem}>加入收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemView, { marginLeft: 40 }]} onPress={this._onTapDownload}>
              <Image
                source={imgSource.icon_video_download}
                style={styles.imageItem}
              />
              <Text style={styles.textItem}>缓存</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.itemView, { marginLeft: 40 }]} onPress={this._onTapMute}>
              <Image
                source={this.state.isMute ? imgSource.icon_video_muted : imgSource.icon_video_mute}
                style={styles.imageItem}
              />
              <Text style={[styles.textItem, this.state.isMute ? { color: '#ff5500' } : null]}>静音</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.optionView}>
            <Text style={styles.optionText}>多倍速播放</Text>
            {
              playRateItems.map((item, index) => {
                const isSelected = (this.state.selectedRate === item)
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => this.onChangeRate(item)}
                  >
                    <Text style={[styles.optionText, isSelected ? styles.optionText_active : null]}>{item}X</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
          <View style={styles.optionView}>
            <Text style={styles.optionText}>定时关闭</Text>
            {
              endTimeItems.map((item, index) => {
                const isSelected = (this.state.selectedEndTimeIndex === index)
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => this.onChangeEndTime(index)}
                  >
                    <Text style={[styles.optionText, isSelected ? styles.optionText_active : null]}>{item}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
          <View style={styles.optionView}>
            <Text style={styles.optionText}>调整音量</Text>
            <Image
              source={imgSource.icon_volume_off}
              style={{ marginLeft: 40, marginRight: 5, width: 26, height: 26 }}
            />
            <Slider
              style={{ flex: 1 }}
              maximumTrackTintColor={'#999999'}//滑块右侧轨道的颜色
              minimumTrackTintColor={'#ff5500'}//滑块左侧轨道的颜色
              thumbImage={imgSource.icon_control_slider}
              value={this.state.volume}
              minimumValue={0}
              maximumValue={maxVolume}
              onValueChange={this._onSliderValueChange}
            />
            <Image
              source={imgSource.icon_volume_up}
              style={{ marginLeft: 5, marginRight: 5, width: 26, height: 26 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const imgSource = {
  icon_video_favorite: require('./image/icon_video_favorite.png'),
  icon_video_download: require('./image/icon_video_download.png'),
  icon_video_muted: require('./image/icon_video_muted.png'),
  icon_video_mute: require('./image/icon_video_mute.png'),
  icon_volume_off: require('./image/icon_volume_off.png'),
  icon_control_slider: require('./image/icon_control_slider.png'),
  icon_volume_up: require('./image/icon_volume_up.png')
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentView: {
    width: 400,
    alignItems: 'center'
  },
  optionView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: onePixel,
    borderBottomColor: 'white',
    width: 400,
    height: 80
  },
  itemView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageItem: {
    width: 30,
    height: 30
  },
  textItem: {
    fontSize: 14,
    color: 'white',
    marginTop: 5
  },
  optionText: {
    fontSize: 14,
    color: 'white'
  },
  optionText_active: {
    color: '#ff5500'
  },
  optionItem: {
    marginLeft: 40
  }
})

export default MoreSettingView
