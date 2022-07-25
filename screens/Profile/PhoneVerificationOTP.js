import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import {
  COLORS,
  FONT1BOLD,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD,
  FONT2REGULAR
} from '../../constants'
import { AppButton, Header } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getPayMethod } from '../../api/business'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import addcard from '../../assets/svg/OTPlock.svg'
import verified from '../../assets/svg/verified.svg'
import { SvgXml } from 'react-native-svg'
import OTPInputView from '@twotalltotems/react-native-otp-input'

function PhoneVerificationOTP ({ navigation }) {
  // State
  const [state, setState] = useState({
    loading: false,
    modalVisible: false,
    isChecked: '',
    paymethods: []
  })

  const { loading, modalVisible } = state

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
          title={'Phone Number Verification'}
          color={COLORS.darkBlack}
          cross
          rightEmpty
        />
        <View style={styles.head}>
          <SvgXml xml={addcard} />
          <Text style={styles.text1}>
            Enter your mobile number to be verified, and we will send you an
            OTP.
          </Text>
          <View style={{ width: '90%', alignItems: 'center', marginTop: 20 }}>
            <OTPInputView
              pinCount={4}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              placeholderTextColor={COLORS.black}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={otp => {
                handleChange('otp', otp)
              }}
              style={{ width: '90%', height: hp(7) }}
            />
          </View>
        </View>
      </View>
      <View style={{ width: '90%', marginBottom: 20 }}>
        <AppButton
          title={'Resend Code'}
          backgroundColor={'transparent'}
          color={COLORS.primary}
          // onPress={() => navigation.navigate('AddPhoneVerificationOTP')}
        />
        <AppButton
          title={'Verify'}
          onPress={() => handleChange('modalVisible', true)}
        />
      </View>
      <Modal animationType='slide' transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.imageView}>
              <SvgXml xml={verified} width={100} height={100} />
            </View>
            <View style={styles.textView}>
              <Text style={styles.textBold}>
                Phone number verified successfully.
              </Text>
              <AppButton
                title={'Done'}
                onPress={() => {
                  handleChange('modalVisible', false)
                  navigation.navigate('Profile')
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  },
  underlineStyleBase: {
    width: 50,
    borderRadius: 10,
    height: hp(6),
    borderWidth: 1,
    // borderColor: COLORS.primary,
    color: COLORS.black,
    fontFamily: FONT1REGULAR,
    fontSize: hp('2.5%')
  },
  underlineStyleHighLighted: {
    borderColor: COLORS.primary
  },
  centeredView: {
    flex: 1,
    backgroundColor: COLORS.modalBG,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageView: {
    width: '100%',
    alignItems: 'center'
  },
  modalView: {
    width: '90%',
    backgroundColor: COLORS.backgroud,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textView: {
    width: '90%',
    alignItems: 'center',
    marginTop: 20
  },
  textBold: {
    fontFamily: FONT1SEMIBOLD,
    color: COLORS.darkBlack,
    fontSize: hp(2.5),
    textAlign: 'center'
  }
})

export default PhoneVerificationOTP
