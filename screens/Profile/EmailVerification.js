import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT2REGULAR } from '../../constants'
import { AppButton, AppInput, Header } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getPayMethod } from '../../api/business'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import addcard from '../../assets/svg/mainID.svg'
import { SvgXml } from 'react-native-svg'

function EmailVerification ({ navigation }) {
  // State
  const [state, setState] = useState({
    loading: false,
    isChecked: '',
    paymethods: []
  })

  const { paymethods, isChecked, loading } = state

  useFocusEffect(
    useCallback(() => {
      // _getPayMethod()
    }, [])
  )

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _getPayMethod = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const res = await getPayMethod(token)
      handleChange('loading', false)
      handleChange('paymethods', res?.data?.data)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={'large'} color={COLORS.primary} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Header
          title={'Email Verification'}
          color={COLORS.darkBlack}
          cross
          rightEmpty
        />
        <View style={styles.head}>
          <SvgXml xml={addcard} />
          <Text style={styles.text1}>
            Continue with google or enter your email address to recieve a
            verification code
          </Text>
          <View style={{ width: '90%', marginTop: 20 }}>
            <AppInput placeholder={'Main ID'} />
          </View>
        </View>
      </View>
      <View style={{ width: '90%', marginBottom: 20 }}>
        <AppButton
          title={'Send'}
          onPress={() => navigation.navigate('EmailVerificationOTP')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  name: {
    color: COLORS.darkBlack,
    fontFamily: FONT1BOLD,
    fontSize: hp(2.5)
  },
  head: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  text: {
    color: COLORS.darkBlack,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    marginLeft: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  text1: {
    color: COLORS.grey,
    width: '80%',
    textAlign: 'center',
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    marginTop: 10
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default EmailVerification
