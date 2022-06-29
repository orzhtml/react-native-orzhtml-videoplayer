import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet } from 'react-native';

const sliderRadius = 3;
const width = 50;
export default class DefaultLabel extends React.Component {
  static propTypes = {

    oneMarkerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    oneMarkerPosition: PropTypes.number,

    oneMarkerPressed: PropTypes.bool,
  };


  render() {
    const {
      oneMarkerValue,
      oneMarkerPosition,
      oneMarkerPressed,
    } = this.props;

    return (
      <View style={{ position: 'relative' }}>
        {Number.isFinite(oneMarkerPosition) &&
          Number.isFinite(oneMarkerValue) && (
            <View
              style={[
                styles.sliderLabel,
                { left: oneMarkerPosition - width / 2 + sliderRadius },
                oneMarkerPressed && styles.markerPressed,
              ]}
            >
              <Text style={styles.sliderLabelText}>{oneMarkerValue}</Text>
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sliderLabel: {
    position: 'absolute',
    bottom: 0,
    minWidth: width,
    padding: 8,
    backgroundColor: '#f1f1f1',
  },
  sliderLabelText: {
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 11,
  },
  markerPressed: {
    borderWidth: 2,
    borderColor: '#999',
  },
});
