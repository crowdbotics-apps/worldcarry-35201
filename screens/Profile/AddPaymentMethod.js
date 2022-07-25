import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import {
  COLORS,
  FONT1BOLD,
  FONT1LIGHT,
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
import stripe from '../../assets/svg/stripe.svg'
import addcard from '../../assets/svg/addcard.svg'
import cardOrange from '../../assets/svg/cardOrange.svg'
import Svg, { SvgXml } from 'react-native-svg'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'

function AddPaymentMethod ({ navigation }) {
  // State
  const [state, setState] = useState({
    loading: false,
    modalVisible: false,
    country: '',
    paymethods: []
  })

  const { modalVisible, country, loading } = state

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header
        title={'Add Payment Method'}
        color={COLORS.darkBlack}
        cross
        rightEmpty
      />
      <View style={styles.mainBody}>
        <AppInput
          placeholder={'Mail ID'}
          borderColor={COLORS.borderColor1}
          inputLabel={'Email'}
          marginBottom={20}
        />
        <AppInput
          marginBottom={10}
          placeholder={'Card Number'}
          borderColor={COLORS.borderColor1}
          inputLabel={'Debit/Credit Card information'}
        />
        <View style={[styles.rowBetween, { marginBottom: 20 }]}>
          <View style={{ width: '48%' }}>
            <AppInput placeholder={'MM/YY'} borderColor={COLORS.borderColor1} />
          </View>
          <View style={{ width: '48%' }}>
            <AppInput placeholder={'CVC'} borderColor={COLORS.borderColor1} />
          </View>
        </View>
        <View style={styles.billingType}>
          <Menu
            style={{ width: '100%' }}
            rendererProps={{
              placement: 'bottom'
            }}
          >
            <MenuTrigger>
              <View style={styles.menuTrigger}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.menuTriggerText}>
                    {country || 'Choose Country'}
                  </Text>
                </View>
                <Icon name='down' type='antdesign' size={10} />
              </View>
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                width: '85%'
              }}
            >
              {[
                'United State',
                'Egypt',
                'Maxico',
                'United Kingdom',
                'Dubai',
                'Pakistan'
              ].map(el => (
                <MenuOption
                  key={el}
                  onSelect={() => handleChange('country', el)}
                >
                  <Text style={{ fontFamily: FONT1LIGHT }}>{el}</Text>
                </MenuOption>
              ))}
            </MenuOptions>
          </Menu>
        </View>
        <AppInput
          marginBottom={20}
          placeholder={'Enter ZIP'}
          borderColor={COLORS.borderColor1}
        />
        <AppInput
          marginBottom={20}
          placeholder={'Enter name'}
          inputLabel={'Name on Card'}
          borderColor={COLORS.borderColor1}
        />
        <AppButton
          title={'Add card'}
          onPress={() => handleChange('modalVisible', true)}
        />
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.text1}>Powered by</Text>
            <SvgXml xml={stripe} />
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <TouchableOpacity>
              <Text style={[styles.text2, { marginRight: 15 }]}>Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.text2}>Privacy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        // onRequestClose={() => {
        //   setModalVisible()
        // }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.imageView}>
              <SvgXml xml={cardOrange} width={50} height={50} />
            </View>
            <View style={styles.textView}>
              <Text style={styles.textBold}>Credet card</Text>
              <Text style={styles.textBold}>added Successfully</Text>
              <AppButton
                title={'Done'}
                onPress={() => {
                  handleChange('modalVisible', false)
                  navigation.navigate('MyPaymentMethod')
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%'
  },
  mainBody: {
    width: '90%',
    marginTop: 20
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
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  text1: {
    color: COLORS.grey,
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    marginRight: 2
  },
  text2: {
    color: COLORS.grey,
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    textDecorationLine: 'underline'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuTriggerText: {
    color: COLORS.darkGrey,
    fontSize: hp(1.8),
    fontFamily: FONT1LIGHT
  },
  menuTrigger: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  billingType: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor1,
    backgroundColor: COLORS.white,
    height: hp(6),
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
    marginTop: 5
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
  }
})

export default AddPaymentMethod
