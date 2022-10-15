import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import {
  COLORS,
  FONT1BOLD,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD,
  FONT2REGULAR,
  FONT2SEMIBOLD
} from '../../constants'
import { AppButton, AppInput, Header } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon } from 'react-native-elements'
import { getPayMethod } from '../../api/business'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import BackAccount from '../../assets/svg/BackAccount.svg'
import addcard from '../../assets/svg/phoneVerification.svg'
import searchIcon from '../../assets/svg/searchIcon.svg'
import { SvgXml } from 'react-native-svg'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { COUNTRY } from '../../constants/countrylist'
import { sendOTPForVerification } from '../../api/auth'

function PhoneVerification ({ navigation }) {
  // State
  const [state, setState] = useState({
    loading: false,
    modalVisible: false,
    phone_number: '',
    countryName: '',
    searchText: '',
    filteredList: COUNTRY
  })

  const {
    phone_number,
    countryName,
    searchText,
    filteredList,
    modalVisible,
    loading
  } = state

  useFocusEffect(
    useCallback(() => {
      // _getPayMethod()
    }, [])
  )

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _sendOTPForVerification = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const body = {
        phone: phone_number
      }
      await sendOTPForVerification(body, token)
      handleChange('loading', false)
      Toast.show(`OTP has been sent.`)
      navigation.navigate('PhoneVerificationOTP', { phone: phone_number })
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      console.warn('errorText', errorText)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const filtered = (key, value) => {
    handleChange(key, value)
    if (value) {
      const re = new RegExp(value, 'i')
      var filtered = COUNTRY?.filter(entry => entry.name.includes(value))
      handleChange('filteredList', filtered)
    } else {
      handleChange('filteredList', COUNTRY)
    }
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
          <View style={{ width: '90%', marginTop: 20 }}>
            <TouchableOpacity
              style={[
                styles.rowBetween,
                {
                  width: '100%',
                  height: hp(6),
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginTop: 20,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: COLORS.borderColor1
                }
              ]}
              onPress={() => handleChange('modalVisible', true)}
            >
              <Text style={[styles.text2]}>
                {countryName || 'Choose your Country'}
              </Text>
              <Icon
                name={'chevron-small-down'}
                type='entypo'
                size={20}
                color={COLORS.grey}
              />
            </TouchableOpacity>
            <AppInput
              placeholder={'phone number'}
              value={phone_number}
              keyboardType='phone-pad'
              name={'phone_number'}
              returnKeyType='done'
              onChange={handleChange}
              borderColor={COLORS.borderColor1}
            />
          </View>
        </View>
      </View>
      <View style={{ width: '90%', marginBottom: 20 }}>
        <AppButton
          title={'Send'}
          loading={loading}
          disabled={!phone_number}
          onPress={_sendOTPForVerification}
        />
      </View>
      <Modal animationType='slide' transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.textBold}>Choose Country</Text>
            </View>
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View style={{ width: searchText !== '' ? '80%' : '100%' }}>
                <AppInput
                  placeholder={'Search'}
                  backgroundColor={COLORS.searchgrey}
                  value={searchText}
                  name={'searchText'}
                  onChange={filtered}
                  borderColor={'transparent'}
                  prefix={<SvgXml xml={searchIcon} style={{ opacity: 0.6 }} />}
                />
              </View>
              {searchText !== '' && (
                <TouchableOpacity
                  onPress={() => {
                    handleChange('searchText', '')
                    handleChange('filteredList', COUNTRY)
                  }}
                >
                  <Text style={[styles.text, { color: COLORS.primary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={filteredList}
              style={{ width: '90%' }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{ height: 40, justifyContent: 'center' }}
                  key={index}
                  onPress={() => {
                    handleChange('phone_number', item.dial_code)
                    handleChange('countryName', item.name)
                    handleChange('modalVisible', false)
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
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
  text2: {
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    fontSize: hp(1.8),
    marginLeft: 5
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
    height: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 20,
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
    width: '100%'
  },
  textBold: {
    fontFamily: FONT1SEMIBOLD,
    color: COLORS.darkBlack,
    fontSize: hp(2.5),
    marginLeft: '5%'
  },
  header: {
    width: '100%',
    height: hp(7),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor1
  }
})

export default PhoneVerification
