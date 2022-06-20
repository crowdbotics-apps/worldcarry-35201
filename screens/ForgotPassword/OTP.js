import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { validateEmail } from '../../utils/ValidateEmail'
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppButton, AppInput } from '../../components'
import Toast from 'react-native-simple-toast'
import AppContext from '../../store/Context'
import logo from '../../assets/svg/logo.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { verifyEmail, resendOTP, forgotpassword } from '../../api/auth'
import OTPInputView from '@twotalltotems/react-native-otp-input'

function OTP ({ navigation, route }) {
  const email = route?.params.email
  // Context
  const context = useContext(AppContext)
  const { setUser } = context

  // State
  const [state, setState] = useState({
    otp: '',
    isEmailValid: false,
    loading: false
  })

  const { otp, loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleVerify = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        email,
        otp
      }
      const res = await verifyEmail(payload)
      console.warn('verifyEmail', res)
      handleChange('loading', false)
      AsyncStorage.removeItem('signupemail')
      navigation.navigate('SetPasswrod', { email })
      setUser(res?.data?.user)
      await AsyncStorage.setItem('token', res?.data?.token)
      Toast.show('Your email has been verified!')
    } catch (error) {
      handleChange('loading', false)
      Toast.show(`Error: Invalid OTP!`)
    }
  }

  const handleResendOTP = async () => {
    try {
      handleChange('loading', true)

      const payload = {
        email
      }
      const res = await forgotpassword(payload)
      console.warn('resendOTP', res)
      handleChange('loading', false)
      Toast.show(`Email has been sent to ${email}`)
    } catch (error) {
      handleChange('loading', false)
      Toast.show(`Error: ${error.message}`)
    }
  }

  return (
    <View style={styles.container}>
      <SvgXml xml={logo} width={100} />
      <View style={styles.top}>
        <Text style={styles.loginText}>
          Verify &{' '}
          <Text style={{ color: COLORS.primary }}>Reset{'\n'}Password</Text>
        </Text>
        <Text style={styles.lightText}>
          A 4 digit OTP has been sent to your mail ID{' '}
          <Text style={{ color: COLORS.darkBlack }}>{email}</Text>
        </Text>
        <View style={styles.textInputContainer}>
          <OTPInputView
            pinCount={4}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            placeholderTextColor={COLORS.black}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={otp => {
              handleChange('otp', otp)
            }}
            style={{ width: '80%' }}
          />
        </View>
        <View style={[styles.remeberContainer, { marginBottom: 10 }]}>
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.forgotText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonWidth}>
        <AppButton
          title={'Reset Password'}
          loading={loading}
          disabled={!otp}
          onPress={handleVerify}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    backgroundColor: COLORS.white,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  top: {
    width: '100%',
    alignItems: 'center'
  },
  backContainer: { width: '90%', alignItems: 'flex-start', marginBottom: 30 },
  header: { width: '90%', marginBottom: '10%' },
  buttonWidth: { width: '90%', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  hLine: { height: 1, width: 100, backgroundColor: COLORS.grey },
  textInputContainer: {
    marginBottom: hp('2%'),
    marginTop: hp('5%'),
    height: hp(6),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    width: '90%'
  },
  underlineStyleBase: {
    width: 50,
    borderRadius: 10,
    height: hp(6),
    borderWidth: 0,
    color: COLORS.black,
    fontFamily: FONT1REGULAR,
    fontSize: hp('2.5%')
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6'
  },
  remeberContainer: {
    alignItems: 'flex-end',
    width: '90%',
    marginBottom: hp(2)
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR,
    textDecorationLine: 'underline'
  },
  orText: {
    color: COLORS.black,
    fontFamily: FONT1REGULAR,
    marginHorizontal: 10
  },
  invalid: {
    color: COLORS.alertButon,
    fontFamily: FONT1REGULAR
  },
  loginText: {
    color: COLORS.black,
    fontSize: hp('4%'),
    textAlign: 'center',
    fontFamily: FONT1SEMIBOLD
  },
  lightText: {
    color: COLORS.grey,
    width: '90%',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  }
})

export default OTP
