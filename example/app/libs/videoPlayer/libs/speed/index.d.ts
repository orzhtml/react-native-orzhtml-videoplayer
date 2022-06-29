// Type definitions for @ptomasroos/react-native-multi-slider 0.0
// Project: https://github.com/ptomasroos/react-native-multi-slider#readme
// Definitions by: Edward Sammut Alessi <https://github.com/Slessi>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8
import * as React from "react";
import { ViewStyle } from "react-native";


export interface MarkerProps {
    pressed: boolean;
    pressedMarkerStyle: ViewStyle;
    markerStyle: ViewStyle;
    enabled: boolean;
    currentValue: number;
    valuePrefix: string;
    valueSuffix: string;
}

export interface LabelProps {
    markerValue: string | number;
    markerLeftPosition: number;
    markerPressed: boolean;
}

export interface MultiSliderProps {
    values?: number;

    onValuesChange?: (values: number) => void;
    onValuesChangeStart?: () => void;
    onValuesChangeFinish?: (values: number) => void;

    sliderLength?: number;
    touchDimensions?: {
        height: number;
        width: number;
        borderRadius: number;
        slipDisplacement: number;
    };

    customMarker?: React.ComponentType<MarkerProps>;
    customLabel?: React.ComponentType<LabelProps>;

    isMarkersSeparated?: boolean;

    min?: number;
    max?: number;
    step?: number;

    optionsArray?: number[];

    containerStyle?: ViewStyle;
    trackStyle?: ViewStyle;
    trackTwoStyle?: ViewStyle;
    trackThreeStyle?: ViewStyle;
    selectedStyle?: ViewStyle;
    unselectedStyle?: ViewStyle;
    markerContainerStyle?: ViewStyle;
    markerStyle?: ViewStyle;
    pressedMarkerStyle?: ViewStyle;
    valuePrefix?: string;
    valueSuffix?: string;
    enabled?: boolean;
    onToggle?: () => void;
    snapped?: boolean;
    markerOffsetX?: number;
    markerOffsetY?: number;
    minMarkerOverlapDistance?: number;
    enableLabel?: boolean;
    vertical?: boolean;
}

export default class MultiSlider extends React.Component<MultiSliderProps> {}
