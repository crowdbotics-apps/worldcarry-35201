import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { validateEmail } from '../../utils/ValidateEmail'
import { COLORS, FONT1BOLD, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppButton, AppInput } from '../../components'
import Toast from 'react-native-simple-toast'
import { forgotpassword, resendOTP } from '../../api/auth'
import AppContext from '../../store/Context'
import { Icon } from 'react-native-elements'
import logo from '../../assets/svg/logo.svg'
function ForgotPassword ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { setIsForgot } = context

  // State
  const [state, setState] = useState({
    email: '',
    isEmailValid: false,
    loading: false
  })

  const { email, loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const isEmailValid = () => {
    const isValid = validateEmail(state.email)
    if (!isValid) {
      handleChange('email', '')
      Toast.show('Email is not valid!')
    } else {
      handleChange('isEmailValid', true)
    }
  }

  const onSubmit = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        email
      }
      const res = await forgotpassword(payload)
      handleChange('loading', false)
      Toast.show(`Email has been sent to ${email}`)
      navigation.navigate('OTP', { email })
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText?.length > 0) {
        Toast.show(`Error: ${errorText[0]}`)
      } else {
        Toast.show(`Error: ${error.message}`)
      }
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <SvgXml xml={logo} width={100} />
      <View style={styles.top}>
        <Text style={styles.loginText}>
          Enter <Text style={{ color: COLORS.primary }}>Mail ID</Text>
        </Text>
        <Text style={styles.lightText}>
          We'll send a four-digit OTP to this mail ID
        </Text>
        <View style={styles.textInputContainer}>
          <AppInput
            label={'Mail ID'}
            placeholder={'Mail ID'}
            name={'email'}
            prefixBGTransparent
            value={state.email}
            onChange={handleChange}
            onBlur={isEmailValid}
            isValid={state.isEmailValid}
          />
        </View>
      </View>
      <View style={styles.buttonWidth}>
        <AppButton
          title={'Get OTP'}
          loading={loading}
          disabled={!email}
          onPress={() => onSubmit()}
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
    width: '90%'
  },
  remeberContainer: {
    alignItems: 'flex-end',
    width: '90%',
    marginBottom: hp('2%')
  },
  forgotText: { color: COLORS.black, fontFamily: FONT1REGULAR },
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
    fontFamily: FONT1SEMIBOLD
  },
  lightText: {
    color: COLORS.grey,
    marginTop: 10,
    lineHeight: 22,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  }
})

export default ForgotPassword
