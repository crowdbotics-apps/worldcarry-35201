import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { CheckBox } from 'react-native-elements'
import { validateEmail } from '../../utils/ValidateEmail'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import { SvgXml } from 'react-native-svg'
// import signupBG from '../../assets/svg/signupBG.svg'
import { AppButton, AppInput } from '../../components'
import Toast from 'react-native-simple-toast'
import { Icon } from 'react-native-elements'
import { signupUser } from '../../api/auth'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage'

function Signup ({ navigation, route }) {
  // State
  const [state, setState] = useState({
    email: '',
    password: '',
    phone: '',
    confirm_password: '',
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
    invalidPass: false,
    isEmailValid: false,
    modalVisible: false,
    accepted: false,
    type: 'Both'
  })

  const {
    isEmailValid,
    loading,
    accepted,
    email,
    name,
    showConfirmPassword,
    showPassword,
    confirm_password,
    modalVisible,
    password,
    phone,
    type
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _isEmailValid = () => {
    const isValid = validateEmail(email)
    if (!isValid) {
      handleChange('email', '')
      Toast.show('Email is not valid!')
    } else {
      handleChange('isEmailValid', true)
    }
  }
  const handleSignup = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        email,
        name,
        phone,
        type,
        password
      }
      const res = await signupUser(payload)
      handleChange('loading', false)
      await AsyncStorage.setItem('token', res?.data?.token)
      await AsyncStorage.setItem('user', JSON.stringify(res?.data?.user))
      Toast.show('Signed up Successfully!')
      navigation.navigate('Subscriptions')
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        Toast.show(`Error: ${errorText[0]}`)
      } else {
        Toast.show(`Error: ${error}`)
      }
    }
  }

  const checkPass = () => {
    const regex = /^.{6,}$/
    if (regex.test(password)) {
      if (password != '') {
        handleChange('invalidPass', false)
      } else {
        handleChange('password', '')
      }
    } else {
      handleChange('invalidPass', true)
    }
  }

  const setModalVisible = () => {
    handleChange('modalVisible', !modalVisible)
  }

  const allowClick = () => {
    navigation.navigate('Drawers')
    setModalVisible()
  }

  const goBack = () => {
    navigation.goBack()
  }

  const handleClick = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url)
      } else {
        console.log("Don't know how to open URI: " + url)
      }
    })
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={{
        alignItems: 'center',
        height: '100%',
        justifyContent: 'space-between'
      }}
    >
      <View style={styles.top}>
        <View style={styles.header}>
          <View style={{ width: 50 }} />
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.login}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.loginText1}>Sign up</Text>
        <View style={styles.textInputContainer}>
          <AppInput
            label={'Username'}
            placeholder={'Username'}
            prefixBGTransparent
            name={'name'}
            value={name}
            onChange={handleChange}
          />
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            label={'Email'}
            placeholder={'Email'}
            name={'email'}
            prefixBGTransparent
            value={email}
            onChange={handleChange}
            onBlur={_isEmailValid}
            isValid={isEmailValid}
          />
        </View>
        <View style={styles.rowPassword}>
          <View style={[styles.textInputContainer, { width: '48%' }]}>
            <AppInput
              label={'Create password'}
              placeholder={'Create password'}
              name={'password'}
              value={password}
              prefixBGTransparent
              onBlur={checkPass}
              postfix={
                <TouchableOpacity
                  onPress={() => handleChange('showPassword', !showPassword)}
                >
                  {showPassword ? (
                    <Icon name={'eye-outline'} type={'ionicon'} size={20} />
                  ) : (
                    <Icon
                      name={'eye-off-outline'}
                      color={COLORS.black}
                      type={'ionicon'}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
              }
              onChange={handleChange}
              secureTextEntry={!showPassword}
            />
          </View>
          <View style={[styles.textInputContainer, { width: '48%' }]}>
            <AppInput
              label={'Password'}
              placeholder={'Confirm Password'}
              postfix={
                <TouchableOpacity
                  onPress={() =>
                    handleChange('showConfirmPassword', !showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <Icon name={'eye-outline'} type={'ionicon'} size={20} />
                  ) : (
                    <Icon
                      name={'eye-off-outline'}
                      color={COLORS.black}
                      type={'ionicon'}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
              }
              name={'confirm_password'}
              value={confirm_password}
              onChange={handleChange}
              secureTextEntry={!showConfirmPassword}
            />
          </View>
        </View>
        {confirm_password && password !== confirm_password ? (
          <View style={styles.textFieldContainer}>
            <Text style={styles.errorText}>Password doesn't match</Text>
          </View>
        ) : null}
        <View style={styles.remeberContainer}>
          <Text style={styles.dontacount}>
            I have read{' '}
            <Text
              onPress={() =>
                handleClick('https://www.crowdbotics.com/terms-of-service')
              }
              style={styles.signUp}
            >
              Terms and Conditions{' '}
            </Text>
            and
            <Text
              onPress={() =>
                handleClick('https://www.crowdbotics.com/privacy-policy')
              }
              style={styles.signUp}
            >
              {' '}
              Privacy Policy
            </Text>
          </Text>
          <CheckBox
            title={''}
            checkedIcon={
              <Icon
                name={'checkbox-marked'}
                type={'material-community'}
                color={COLORS.primary}
              />
            }
            containerStyle={styles.checkedBox}
            uncheckedIcon={
              <Icon
                name={'checkbox-blank-outline'}
                type={'material-community'}
                color={COLORS.inputBorder}
              />
            }
            onPress={() => handleChange('accepted', !accepted)}
            checked={accepted}
          />
        </View>
        <View style={styles.buttonWidth}>
          <AppButton
            disabled={
              !email ||
              !name ||
              !password ||
              !confirm_password ||
              password != confirm_password ||
              !accepted
            }
            loading={loading}
            title={'Sign Up'}
            onPress={handleSignup}
          />
        </View>
      </View>
      {/* <SvgXml
        xml={signupBG}
        width={'110%'}
        style={{ right: '2%', bottom: 0, position: 'absolute' }}
      /> */}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.backgroud,
    height: '100%'
  },
  top: {
    width: '100%',
    alignItems: 'center'
  },
  buttonWidth: { width: 150, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowPassword: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hLine: { height: 1, width: 100, backgroundColor: COLORS.grey },
  textInputContainer: { marginBottom: hp('2%'), width: '90%' },
  remeberContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%'
  },
  login: {
    backgroundColor: COLORS.white,
    width: 90,
    height: 65,
    borderTopLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 100,
    marginRight: -20,
    borderBottomRightRadius: 100
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 30
  },
  loginText1: {
    color: COLORS.secondary,
    fontSize: hp(3),
    fontFamily: FONT1BOLD
  },
  loginText: {
    color: COLORS.secondary,
    marginRight: 20,
    fontSize: hp(2),
    fontFamily: FONT1BOLD
  },
  dontacount: {
    color: COLORS.secondary,
    fontSize: hp(1.8),
    flexDirection: 'row',
    fontFamily: FONT1REGULAR
  },
  checkedBox: {
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  signUp: {
    color: COLORS.navy,
    fontFamily: FONT1REGULAR
  }
})

export default Signup
