import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { Icon } from 'react-native-elements'
import {
  COLORS,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD
} from '../../constants'
import { AppButton, AppInput, Header, SuccessModal } from '../../components'
import Toast from 'react-native-simple-toast'
import logo from '../../assets/svg/logo.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { changePassword } from '../../api/auth'

function ChangeCurrentPassword ({ navigation }) {
  // State
  const [state, setState] = useState({
    c_password: '',
    password: '',
    confirm_password: '',
    invalidPass: false,
    invalidPass1: false,
    loading: false,
    showPassword: false,
    showPassword1: false,
    showConfirmPassword: false,
    modalVisible: false
  })

  const {
    c_password,
    password,
    confirm_password,
    invalidPass,
    showConfirmPassword,
    loading,
    showPassword,
    showPassword1,
    modalVisible,
    invalidPass1
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handlePassword = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      handleChange('loading', true)
      const payload = {
        new_password1: password,
        new_password2: confirm_password
      }
      const res = await changePassword(payload, token)
      handleChange('loading', false)
      handleChange('c_password', '')
      handleChange('password', '')
      handleChange('confirm_password', '')
      Toast.show('Password has been changed')
      navigation.goBack()
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        Toast.show(`Error: ${JSON.stringify(errorText[0])}`)
      } else {
        Toast.show(`Error: ${error.message}`)
      }
    }
  }

  const checkPass = () => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
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

  const checkCurrentPass = () => {
    const regex = /^.{6,}$/
    if (regex.test(c_password)) {
      if (c_password != '') {
        handleChange('invalidPass1', false)
      } else {
        handleChange('c_password', '')
      }
    } else {
      handleChange('invalidPass1', true)
    }
  }

  const handleDone = () => {
    handleChange('modalVisible', false)
    navigation.navigate('AuthLoading')
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Header
          title={'Change Password'}
          color={COLORS.darkBlack}
          cross
          rightItem={
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Text style={styles.activeTabText}>{'Cancel'}</Text>
            </TouchableOpacity>
          }
        />
        <View style={[styles.textInputContainer, { marginTop: 20 }]}>
          <AppInput
            inputLabel={'Password'}
            placeholder={'Current Password'}
            prefixBGTransparent
            name={'c_password'}
            // onBlur={checkCurrentPass}
            postfix={
              <TouchableOpacity
                onPress={() => handleChange('showPassword1', !showPassword1)}
              >
                {showPassword1 ? (
                  <Icon
                    name={'eye-outline'}
                    color={COLORS.darkGrey}
                    type={'ionicon'}
                    size={20}
                  />
                ) : (
                  <Icon
                    name={'eye-off-outline'}
                    color={COLORS.darkGrey}
                    type={'ionicon'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            }
            value={c_password}
            onChange={handleChange}
            secureTextEntry={!showPassword1 && c_password != ''}
          />
        </View>
        {/* {invalidPass1 && (
          <View style={styles.textFieldContainer}>
            <Text style={styles.errorText}>Password at least 8 characters</Text>
          </View>
        )} */}
        <View style={styles.textInputContainer}>
          <AppInput
            label={'New Password'}
            placeholder={'New Password'}
            prefixBGTransparent
            name={'password'}
            onBlur={checkPass}
            postfix={
              <TouchableOpacity
                onPress={() => handleChange('showPassword', !showPassword)}
              >
                {showPassword ? (
                  <Icon
                    name={'eye-outline'}
                    color={COLORS.darkGrey}
                    type={'ionicon'}
                    size={20}
                  />
                ) : (
                  <Icon
                    name={'eye-off-outline'}
                    color={COLORS.darkGrey}
                    type={'ionicon'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            }
            value={password}
            onChange={handleChange}
            secureTextEntry={!showPassword && password != ''}
          />
        </View>
        {invalidPass && (
          <View style={{ width: '90%' }}>
            <Text style={styles.errorText}>
              Password at least 8 characters which contain at least one
              lowercase letter, one uppercase letter, one numeric digit, and one
              special character
            </Text>
          </View>
        )}
        <View style={styles.textInputContainer}>
          <AppInput
            label={'Re-enter New Password'}
            placeholder={'Confirm New Password'}
            prefixBGTransparent
            postfix={
              <TouchableOpacity
                onPress={() =>
                  handleChange('showConfirmPassword', !showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <Icon
                    name={'eye-outline'}
                    color={COLORS.darkGrey}
                    type={'ionicon'}
                    size={20}
                  />
                ) : (
                  <Icon
                    name={'eye-off-outline'}
                    color={COLORS.darkGrey}
                    type={'ionicon'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            }
            name={'confirm_password'}
            value={confirm_password}
            onChange={handleChange}
            secureTextEntry={!showConfirmPassword && password != ''}
          />
        </View>
        {confirm_password && password !== confirm_password ? (
          <View style={styles.textFieldContainer}>
            <Text style={styles.errorText}>Password doesn't match</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.buttonWidth}>
        <AppButton
          title={'Save'}
          loading={loading}
          disabled={
            !c_password ||
            !password ||
            !confirm_password ||
            password !== confirm_password
          }
          onPress={handlePassword}
        />
      </View>
      <SuccessModal modalVisible={modalVisible} setModalVisible={handleDone} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    backgroundColor: COLORS.white,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
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
    width: '90%'
  },
  errorText: {
    width: '100%',
    marginBottom: 10
  },
  remeberContainer: {
    alignItems: 'flex-end',
    width: '90%',
    marginBottom: hp(2)
  },
  forgotText: { color: COLORS.primary, fontFamily: FONT1REGULAR },
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
    marginBottom: 20,
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

export default ChangeCurrentPassword
