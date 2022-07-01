import React from 'react';

import {
  StyleSheet,
  PanResponder,
  View,
  Platform,
  Dimensions,
  I18nManager,
  ImageBackground,
} from 'react-native';

import DefaultMarker from './DefaultMarker';
import DefaultLabel from './DefaultLabel';
import {createArray, valueToPosition, positionToValue} from './converters';

export default class MultiSlider extends React.Component {
  static defaultProps = {
    values: 0,
    onValuesChangeStart: () => {},
    onValuesChange: values => {},
    onValuesChangeFinish: values => {},
    onMarkersPosition: values => {},
    step: 1,
    min: 0,
    max: 10,
    touchDimensions: {
      height: 50,
      width: 50,
      borderRadius: 15,
      slipDisplacement: 200,
    },
    customMarker: DefaultMarker,
    customLabel: DefaultLabel,
    markerOffsetX: 0,
    markerOffsetY: 0,
    sliderLength: 280,
    onToggle: undefined,
    enabled: true,
    snapped: false,
    vertical: false,
    minMarkerOverlapDistance: 0,
  };

  constructor(props) {
    super(props);

    this.optionsArray =
      this.props.optionsArray ||
      createArray(this.props.min, this.props.max, this.props.step);
    this.stepLength = this.props.sliderLength / this.optionsArray.length;

    var initialValues = valueToPosition(
      this.props.values,
      this.optionsArray,
      this.props.sliderLength
    );

    this.state = {
      value: this.props.values,
      past: initialValues,
      position: initialValues,
      trackBuffer: 0,
    };

    this.subscribePanResponder();
  }

  subscribePanResponder = () => {
    var customPanResponder = (start, move, end) => {
      return PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => start(),
        onPanResponderMove: (evt, gestureState) => move(gestureState),
        onPanResponderTerminationRequest: (evt, gestureState) => false,
        onPanResponderRelease: (evt, gestureState) => end(gestureState),
        onPanResponderTerminate: (evt, gestureState) => end(gestureState),
        onShouldBlockNativeResponder: (evt, gestureState) => true,
      });
    };

    this._panResponder = customPanResponder(
      this.onPanGrant,
      this.onPanMove,
      this.onPanEnd
    );
  };

  onPanGrant = () => {
    if (this.props.enabled) {
      this.props.onValuesChangeStart();
      this.setState({
        pressed: !this.state.pressed,
      });
    }
  };

  onPanMove = gestureState => {
    if (!this.props.enabled) {
      return;
    }

    const accumDistance = this.props.vertical
      ? gestureState.dy
      : gestureState.dx;
    const accumDistanceDisplacement = this.props.vertical
      ? -gestureState.dx
      : gestureState.dy;

    const unconfined = I18nManager.isRTL
      ? this.state.past - accumDistance
      : accumDistance + this.state.past;
    var bottom = 0;
    var top = this.props.sliderLength;
    var confined =
      unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    var slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      var value = positionToValue(
        confined,
        this.optionsArray,
        this.props.sliderLength
      );
      var snapped = valueToPosition(
        value,
        this.optionsArray,
        this.props.sliderLength
      );
      this.setState({
        position: this.props.snapped ? snapped : confined,
      });

      if (value !== this.state.value) {
        this.setState(
          {
            value: value,
          },
          () => {
            var change = this.state.value;

            this.props.onValuesChange(change);

            this.props.onMarkersPosition(this.state.position);
          }
        );
      }
    }
  };

  onPanEnd = gestureState => {
    if (gestureState.moveX === 0 && this.props.onToggle) {
      this.props.onToggle();
      return;
    }

    this.setState(
      {
        past: this.state.position,
        pressed: !this.state.pressed,
      },
      () => {
        var change = this.state.value;

        this.props.onValuesChangeFinish(change);
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const {position: prevPosition} = prevState;

    const {position, trackBuffer} = this.state;
    if (prevProps.trackBuffer !== this.props.trackBuffer) {
      // 缓存条
      const _trackBuffer = valueToPosition(
        this.props.trackBuffer,
        this.optionsArray,
        this.props.sliderLength
      );
      this.setState({trackBuffer: _trackBuffer});
    }

    if (typeof position === 'undefined') {
      return;
    }

    if (position !== prevPosition) {
      this.props.onMarkersPosition(position);
    }

    if (this.state.pressed) {
      return;
    }

    let nextState = {};
    if (
      prevProps.min !== this.props.min ||
      prevProps.max !== this.props.max ||
      prevProps.step !== this.props.step ||
      prevProps.values !== this.props.values ||
      prevProps.sliderLength !== this.props.sliderLength
    ) {
      this.optionsArray =
        this.props.optionsArray ||
        createArray(this.props.min, this.props.max, this.props.step);

      this.stepLength = this.props.sliderLength / this.optionsArray.length;

      const position = valueToPosition(
        this.props.values,
        this.optionsArray,
        this.props.sliderLength
      );
      nextState.value = this.props.values;
      nextState.past = position;
      nextState.position = position;

      this.setState(nextState);
    }
  }

  render() {
    const {position, trackBuffer} = this.state;
    const {
      selectedStyle,
      unselectedStyle,
      sliderLength,
      markerOffsetX,
      markerOffsetY,
    } = this.props;

    const trackLength = position;
    const trackStyle = selectedStyle || styles.selectedTrack;
    const trackThreeStyle = unselectedStyle;
    const trackTwoLength = sliderLength - trackLength;
    const trackTwoStyle = unselectedStyle;
    const Marker = this.props.customMarker;
    const Label = this.props.customLabel;

    const {slipDisplacement, height, width, borderRadius} =
      this.props.touchDimensions;
    const touchStyle = {
      borderRadius: borderRadius || 0,
    };

    const markerContainer = {
      top: markerOffsetY - 24,
      left: trackLength + markerOffsetX - 24,
    };

    const containerStyle = [styles.container, this.props.containerStyle];

    const body = (
      <React.Fragment>
        <View
          style={[
            styles.fullTrack,
            {width: sliderLength, position: 'relative'},
          ]}>
          <View
            style={[
              styles.track,
              this.props.trackStyle,
              trackStyle,
              {width: trackLength},
            ]}
          />
          <View
            style={[
              styles.track,
              styles.trackTwoStyle,
              this.props.trackTwoStyle,
              trackTwoStyle,
              {width: trackTwoLength},
            ]}
          />
          <View
            style={[
              styles.track,
              styles.trackThreeStyle,
              this.props.trackThreeStyle,
              trackThreeStyle,
              {width: trackBuffer},
            ]}
          />
          <View
            style={[
              styles.markerContainer,
              markerContainer,
              this.props.markerContainerStyle,
              position > sliderLength / 2 && styles.topMarkerContainer,
            ]}>
            <View
              style={[styles.touch, touchStyle]}
              ref={component => (this._marker = component)}
              {...this._panResponder.panHandlers}>
              <Marker
                pressed={this.state.pressed}
                pressedMarkerStyle={this.props.pressedMarkerStyle}
                disabledMarkerStyle={this.props.disabledMarkerStyle}
                markerStyle={this.props.markerStyle}
                enabled={this.props.enabled}
                currentValue={this.state.value}
                valuePrefix={this.props.valuePrefix}
                valueSuffix={this.props.valueSuffix}
              />
            </View>
          </View>
        </View>
      </React.Fragment>
    );

    return (
      <View>
        {this.props.enableLabel && (
          <Label
            markerValue={this.state.value}
            markerPosition={position}
            markerPressed={this.state.pressed}
          />
        )}
        <View style={containerStyle}>{body}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
  },
  fullTrack: {
    flexDirection: 'row',
  },
  track: {
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(137,137,137,0.8)',
    position: 'relative',
    zIndex: 3,
  },
  trackTwoStyle: {
    zIndex: 2,
  },
  trackThreeStyle: {
    backgroundColor: '#aaa',
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  selectedTrack: {
    backgroundColor: '#fff',
  },
  markerContainer: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  topMarkerContainer: {
    zIndex: 4,
  },
  touch: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});
