import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { Icon } from 'react-native-elements'
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppButton, AppInput, SuccessModal } from '../../components'
import Toast from 'react-native-simple-toast'
import AppContext from '../../store/Context'
import logo from '../../assets/svg/logo.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setPassword } from '../../api/auth'

function SetPassword ({ navigation, route }) {
  // Context
  const context = useContext(AppContext)
  const { setIsForgot } = context

  // State
  const [state, setState] = useState({
    password: '',
    confirm_password: '',
    invalidPass: false,
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
    modalVisible: false,
  })

  const {
    password,
    confirm_password,
    invalidPass,
    showConfirmPassword,
    loading,
    showPassword,
    modalVisible
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handlePassword = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      handleChange('loading', true)
      const payload = {
        password_1: password,
        password_2: confirm_password
      }
      const res = await setPassword(payload, token)
      handleChange('loading', false)
      handleChange('modalVisible', true)
      Toast.show(res?.data?.detail)
    } catch (error) {
      handleChange('loading', false)
      console.warn('err', error)
      Toast.show(`Error: ${error.message}`)
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

  const handleDone = () => {
    handleChange('modalVisible', false)
    navigation.navigate('AuthLoading')
  }

  return (
    <View style={styles.container}>
      <SvgXml xml={logo} width={100} />
      <View style={styles.top}>
        <Text style={styles.loginText}>
          Reset <Text style={{ color: COLORS.primary }}>Password</Text>
        </Text>

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
            secureTextEntry={!showPassword}
          />
        </View>
        {invalidPass && (
          <View style={styles.textFieldContainer}>
            <Text style={styles.errorText}>Password at least 6 characters</Text>
          </View>
        )}
        <View style={styles.textInputContainer}>
          <AppInput
            label={'Re-enter New Password'}
            placeholder={'Re-enter New Password'}
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
            secureTextEntry={!showConfirmPassword}
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
            !password || !confirm_password || password !== confirm_password
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
    width: '90%'
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

export default SetPassword
