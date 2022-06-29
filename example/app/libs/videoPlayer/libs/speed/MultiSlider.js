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
    values: [0],
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
    onToggleOne: undefined,
    enabledOne: true,
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

    var initialValues = this.props.values.map(value =>
      valueToPosition(value, this.optionsArray, this.props.sliderLength)
    );

    this.state = {
      pressedOne: true,
      valueOne: this.props.values[0],
      pastOne: initialValues[0],
      positionOne: initialValues[0],
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

    this._panResponderOne = customPanResponder(
      this.startOne,
      this.moveOne,
      this.endOne
    );
  };

  startOne = () => {
    if (this.props.enabledOne) {
      this.props.onValuesChangeStart();
      this.setState({
        onePressed: !this.state.onePressed,
      });
    }
  };

  moveOne = gestureState => {
    if (!this.props.enabledOne) {
      return;
    }

    const accumDistance = this.props.vertical
      ? gestureState.dy
      : gestureState.dx;
    const accumDistanceDisplacement = this.props.vertical
      ? -gestureState.dx
      : gestureState.dy;

    const unconfined = I18nManager.isRTL
      ? this.state.pastOne - accumDistance
      : accumDistance + this.state.pastOne;
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
        positionOne: this.props.snapped ? snapped : confined,
      });

      if (value !== this.state.valueOne) {
        this.setState(
          {
            valueOne: value,
          },
          () => {
            var change = [this.state.valueOne];

            this.props.onValuesChange(change);

            this.props.onMarkersPosition([this.state.positionOne]);
          }
        );
      }
    }
  };

  endOne = gestureState => {
    if (gestureState.moveX === 0 && this.props.onToggleOne) {
      this.props.onToggleOne();
      return;
    }

    this.setState(
      {
        pastOne: this.state.positionOne,
        onePressed: !this.state.onePressed,
      },
      () => {
        var change = [this.state.valueOne];

        this.props.onValuesChangeFinish(change);
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const {positionOne: prevPositionOne} = prevState;

    const {positionOne, trackBuffer} = this.state;
    if (prevProps.trackBuffer !== this.props.trackBuffer) {
      // 缓存条
      const _trackBuffer = valueToPosition(
        this.props.trackBuffer,
        this.optionsArray,
        this.props.sliderLength
      );
      this.setState({trackBuffer: _trackBuffer});
    }

    if (typeof positionOne === 'undefined') {
      return;
    }

    if (positionOne !== prevPositionOne) {
      this.props.onMarkersPosition([positionOne]);
    }

    if (this.state.onePressed) {
      return;
    }

    let nextState = {};
    if (
      prevProps.min !== this.props.min ||
      prevProps.max !== this.props.max ||
      prevProps.step !== this.props.step ||
      prevProps.values[0] !== this.props.values[0] ||
      prevProps.sliderLength !== this.props.sliderLength ||
      prevProps.values[1] !== this.props.values[1] ||
      (prevProps.sliderLength !== this.props.sliderLength &&
        prevProps.values[1])
    ) {
      this.optionsArray =
        this.props.optionsArray ||
        createArray(this.props.min, this.props.max, this.props.step);

      this.stepLength = this.props.sliderLength / this.optionsArray.length;

      const positionOne = valueToPosition(
        this.props.values[0],
        this.optionsArray,
        this.props.sliderLength
      );
      nextState.valueOne = this.props.values[0];
      nextState.pastOne = positionOne;
      nextState.positionOne = positionOne;

      this.setState(nextState);
    }
  }

  render() {
    const {positionOne, trackBuffer} = this.state;
    const {
      selectedStyle,
      unselectedStyle,
      sliderLength,
      markerOffsetX,
      markerOffsetY,
    } = this.props;

    const trackOneLength = positionOne;
    const trackOneStyle = selectedStyle || styles.selectedTrack;
    const trackThreeStyle = unselectedStyle;
    const trackTwoLength = sliderLength - trackOneLength;
    const trackTwoStyle = unselectedStyle;
    const Marker = this.props.customMarker;
    const Label = this.props.customLabel;

    const {slipDisplacement, height, width, borderRadius} =
      this.props.touchDimensions;
    const touchStyle = {
      borderRadius: borderRadius || 0,
    };

    const markerContainerOne = {
      top: markerOffsetY - 24,
      left: trackOneLength + markerOffsetX - 24,
    };

    const containerStyle = [styles.container, this.props.containerStyle];

    // if (this.props.vertical) {
    //   containerStyle.push({
    //     transform: [{rotate: '90deg'}],
    //   });
    // }

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
              trackOneStyle,
              {width: trackOneLength, position: 'relative', zIndex: 3},
            ]}
          />
          <View
            style={[
              styles.track,
              this.props.trackStyle,
              trackTwoStyle,
              {width: trackTwoLength, position: 'relative', zIndex: 2},
            ]}
          />
          <View
            style={[
              styles.track,
              this.props.trackStyle,
              trackThreeStyle,
              {
                width: trackBuffer,
                backgroundColor: '#aaa',
                position: 'absolute',
                left: 0,
                zIndex: 2,
              },
            ]}
          />
          <View
            style={[
              styles.markerContainer,
              markerContainerOne,
              this.props.markerContainerStyle,
              positionOne > sliderLength / 2 && styles.topMarkerContainer,
              {zIndex: 4},
            ]}>
            <View
              style={[styles.touch, touchStyle]}
              ref={component => (this._markerOne = component)}
              {...this._panResponderOne.panHandlers}>
              <Marker
                enabled={this.props.enabledOne}
                pressed={this.state.onePressed}
                markerStyle={this.props.markerStyle}
                pressedMarkerStyle={this.props.pressedMarkerStyle}
                disabledMarkerStyle={this.props.disabledMarkerStyle}
                currentValue={this.state.valueOne}
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
            oneMarkerValue={this.state.valueOne}
            oneMarkerPosition={positionOne}
            oneMarkerPressed={this.state.onePressed}
          />
        )}
        {this.props.imageBackgroundSource && (
          <ImageBackground
            source={this.props.imageBackgroundSource}
            style={[{width: '100%', height: '100%'}, containerStyle]}>
            {body}
          </ImageBackground>
        )}
        {!this.props.imageBackgroundSource && (
          <View style={containerStyle}>{body}</View>
        )}
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
    ...Platform.select({
      ios: {
        height: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(137,137,137,0.8)',
      },
      android: {
        height: 2,
        backgroundColor: 'rgba(137,137,137,0.8)',
      },
      web: {
        height: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(137,137,137,0.8)',
      },
    }),
  },
  selectedTrack: {
    ...Platform.select({
      ios: {
        backgroundColor: '#fff',
      },
      android: {
        backgroundColor: '#fff',
      },
      web: {
        backgroundColor: '#fff',
      },
    }),
  },
  markerContainer: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMarkerContainer: {
    zIndex: 1,
  },
  touch: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});
