# react-native-orzhtml-videoplayer

react-native video 视频控制组件

## screenshots

![](https://raw.githubusercontent.com/orzhtml/react-native-orzhtml-videoplayer/master/screenshots/1.gif)


## Install

`npm install react-native-orzhtml-videoplayer --save` or `yarn add react-native-orzhtml-videoplayer`

`npm install react-native-orientation --save` or `yarn add react-native-orientation`

**For React Native 0.60.0 or higher.**

`npm install react-native-video --save` or `yarn add react-native-video`

**For React Native <= 0.59.x use version 6.1.1 or lower**

`npm install react-native-video@4.4.4 --save` or `yarn add react-native-video@4.4.4`

## Mostly automatic installation

```
react-native link react-native-video

react-native link react-native-orientation
```

## Example

In the react-native-orzhtml-videoplayer package directory:

```
cd example

npm install // or yarn

react-native link
```

To run example on iOS:

`react-native run-ios`

To run example on Android:

`react-native run-android`

## Props

Prop | Description | Type | Required/Default
------ | ------ | ------ | ------
`VideoPlayer`|视频模块||
`defaultVideoHeight`|视频默认竖屏的高度|`number`|
`statusBarHeight`|状态栏高度|`number`
`screenWidth`|屏幕宽度|`number`
`screenHeight`|屏幕高度|`number`