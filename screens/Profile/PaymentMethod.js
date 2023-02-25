import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT2REGULAR } from '../../constants'
import { AppButton, Header } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getPayMethod } from '../../api/business'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import BackAccount from '../../assets/svg/BackAccount.svg'
import addcard from '../../assets/svg/addcard.svg'
import MasterIcon from '../../assets/svg/masterCard.svg'
import VisaIcon from '../../assets/svg/Visa.svg'
import { SvgXml } from 'react-native-svg'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

function PaymentMethod ({ navigation }) {
  // State
  const [state, setState] = useState({
    loading: false,
    isChecked: '',
    paymethods: []
  })

  const { paymethods, isChecked, loading } = state

  useFocusEffect(
    useCallback(() => {
      _getPayMethod()
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
          title={'Add Payment Method'}
          color={COLORS.darkBlack}
          cross
          rightEmpty
        />
        <View style={styles.head}>
          <SvgXml xml={addcard} />
          <Text style={styles.text1}>
            Add a payment method to continue secure transactions in worldcarry.
          </Text>
        </View>
        <FlatList
          data={paymethods}
          style={{ width: '90%' }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.rowBetween,
                {
                  width: '100%',
                  height: 50,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: COLORS.borderColor
                  // paymethods === 'bank' ? COLORS.primary : COLORS.borderColor
                }
              ]}
              onPress={() =>
                navigation.navigate('MyPaymentMethod', { card: item })
              }
            >
              <View style={styles.row}>
                {/* <BouncyCheckbox
                  size={18}
                  fillColor={COLORS.primary}
                  disableBuiltInState={true}
                  unfillColor={COLORS.white}
                  disableText={true}
                  isChecked={paymethods === 'bank' ? true : false}
                  iconStyle={{ borderColor: COLORS.primary, borderRadius: 20 }}
                /> */}
                <Text style={[styles.text]}>
                  **** **** **** {item?.card?.last4}
                </Text>
              </View>
              <SvgXml
                xml={
                  item?.card?.brand?.toLowerCase() === 'visa'
                    ? VisaIcon
                    : MasterIcon
                }
                width={30}
                height={30}
              />
            </TouchableOpacity>
          )}
        />
        {/* <TouchableOpacity
          style={[
            styles.rowBetween,
            {
              width: '90%',
              height: 50,
              borderRadius: 10,
              marginTop: 10,
              paddingHorizontal: 10,
              borderWidth: 1
              // borderColor:
              //   paymethods === 'credit' ? COLORS.primary : COLORS.borderColor
            }
          ]}
          // onPress={() => handleChange('paymethods', 'credit')}
        >
          <View style={styles.row}>
            <BouncyCheckbox
              size={18}
              fillColor={COLORS.primary}
              unfillColor={COLORS.white}
              disableBuiltInState={true}
              disableText={true}
              isChecked={paymethods === 'credit' ? true : false}
              iconStyle={{ borderColor: COLORS.primary, borderRadius: 20 }}
            />
            <Text style={[styles.text]}>Debit / Credit Card</Text>
          </View>
          <SvgXml xml={MasterIcon} width={30} height={30} />
        </TouchableOpacity> */}
      </View>
      <View style={{ width: '90%', marginBottom: 20 }}>
        <AppButton
          title={'Add'}
          onPress={() => navigation.navigate('AddPaymentMethod')}
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

export default PaymentMethod
