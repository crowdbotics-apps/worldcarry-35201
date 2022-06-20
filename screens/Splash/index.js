import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import logo from '../../assets/svg/logo.svg'
import { COLORS, FONT1LIGHT } from '../../constants'
import { Slider } from 'react-native-elements'

function Splash ({ navigation }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setValue(pre => pre + 1)
    }, 300)
    setTimeout(() => {
      navigation.navigate('AuthLoading')
    }, 3000)
  }, [])
  return (
    <View style={styles.container}>
      <View style={{ height: 50 }} />
      <SvgXml xml={logo} />
      <View style={styles.slider}>
        <Slider
          value={value}
          maximumValue={10}
          minimumTrackTintColor={COLORS.primary}
          thumbTintColor={COLORS.primary}
          minimumValue={1}
          thumbStyle={{ width: 0, height: 0 }}
          style={{ width: '100%' }}
        />
        <Text style={styles.loadingText}>version 1.0</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  slider: {
    alignItems: 'center',
    width: '90%'
  },
  loadingText: {
    fontFamily: FONT1LIGHT,
    fontSize: hp(2),
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20
  }
})

export default Splash
