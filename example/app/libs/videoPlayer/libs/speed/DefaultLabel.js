import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet } from 'react-native';

const sliderRadius = 3;
const width = 50;
export default class DefaultLabel extends React.Component {
  static propTypes = {

    markerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    markerPosition: PropTypes.number,

    markerPressed: PropTypes.bool,
  };


  render() {
    const {
      markerValue,
      markerPosition,
      markerPressed,
    } = this.props;

    return (
      <View style={{ position: 'relative' }}>
        {Number.isFinite(markerPosition) &&
          Number.isFinite(markerValue) && (
            <View
              style={[
                styles.sliderLabel,
                { left: markerPosition - width / 2 + sliderRadius },
                markerPressed && styles.markerPressed,
              ]}
            >
              <Text style={styles.sliderLabelText}>{markerValue}</Text>
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
