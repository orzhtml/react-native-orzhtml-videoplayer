# react-native-orzhtml-videoplayer

react-native video 视频控制组件

## 示例图

![](https://raw.githubusercontent.com/orzhtml/react-native-orzhtml-videoplayer/master/screenshots/1.gif)


## 安装

`yarn add react-native-orzhtml-videoplayer`

`yarn add react-native-video`

`yarn add react-native-orzhtml-slider`

`yarn add react-native-modal`

## 提示

如果 react-native 0.69 + 以上版本，react-native-video 需要升级到 v6.0.0 以上

`yarn add react-native-video@v6.0.0-alpha.1`

## 例子

在 react-native-orzhtml-videoplayer 包目录下:

```
cd example

yarn ins
yarn start

// 如果是 MacBook pro M1 + 就用下面的命令
yarn im2
yarn start
```

## 可用组件，更多功能可以参考 example 里面的例子

Prop | Description | Type | Required/Default
------ | ------ | ------ | ------
`VideoPlayer`|视频模块|      |
`VideoModal`|全屏 Modal 视频模块|      |
`defaultVideoWidth`|视频默认竖屏的宽度|`number`|
`defaultVideoHeight`|视频默认竖屏的高度|`number`|
`statusBarHeight`|状态栏高度|`number`
`screenWidth`|屏幕宽度|`number`
`screenHeight`|屏幕高度|`number`
