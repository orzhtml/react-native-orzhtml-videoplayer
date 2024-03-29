import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'

import { getStatusBarHeight } from '../common/StatusBarHeight'

const Home = (props: any) => {
  const { navigation } = props

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: getStatusBarHeight() }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 15 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('VideoList')
          }}
        >
          <Text style={styles.btnText}>视频列表页面</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('VideoDetails')
          }}
        >
          <Text style={styles.btnText}>视频详情页面</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    height: 40,
    marginBottom: 15
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff'
  }
})

export default Home
