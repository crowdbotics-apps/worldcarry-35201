import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import {
  COLORS,
  FONT1BOLD,
  FONT1REGULAR,
  FONT2REGULAR,
  FONT2SEMIBOLD
} from '../../constants'
import { Header } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon } from 'react-native-elements'
import { getPayMethod } from '../../api/business'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import WalletIcon from '../../assets/svg/wallet1.svg'
import VisaIcon from '../../assets/svg/Visa.svg'
import MasterIcon from '../../assets/svg/Master.svg'
import { SvgXml } from 'react-native-svg'

function Wallets ({ navigation }) {
  // State
  const [state, setState] = useState({
    loading: false,
    paymethods: []
  })

  const { paymethods, loading } = state

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header title={'Wallet'} rightEmpty />
      {paymethods?.map((method, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.rowBetween,
            {
              width: '90%',
              height: 50,
              borderBottomWidth: index !== paymethods?.length - 1 ? 1 : 0,
              borderBottomColor: COLORS.borderColor
            }
          ]}
          // onPress={() => handleChange('payment_method', method?.id)}
        >
          <View style={styles.row}>
            <SvgXml
              xml={method?.card?.brand === 'visa' ? VisaIcon : MasterIcon}
              width={20}
              height={20}
            />
            <Text
              style={[
                styles.text,
                {
                  marginLeft: 10
                }
              ]}
            >
              **** {method?.card?.last4}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.rowBetween, { width: '90%' }]}
        onPress={() => navigation.navigate('AddCard')}
      >
        <View style={styles.row}>
          <Icon name='plus' type='antdesign' />
          <Text style={[styles.text, { marginLeft: 10, fontSize: hp(2.2) }]}>
            Add Payment Method
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%'
  },
  top: { width: '100%', marginBottom: 20 },
  body: { width: '90%', flex: 1 },
  name: {
    color: COLORS.darkBlack,
    fontFamily: FONT1BOLD,
    fontSize: hp(2.5)
  },
  textWhite: {
    color: COLORS.white,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2)
  },
  hLine: {
    width: '110%',
    height: 1,
    marginVertical: 20,
    backgroundColor: COLORS.borderColor
  },
  blackBox: {
    width: 30,
    height: 30,
    marginRight: 5,
    borderRadius: 6,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
    borderRadius: 6,
    backgroundColor: COLORS.card,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textHead: {
    color: COLORS.darkBlack,
    fontFamily: FONT2SEMIBOLD,
    fontSize: hp(3)
  },
  textHead1: {
    color: COLORS.darkGrey,
    fontFamily: FONT2SEMIBOLD,
    fontSize: hp(3)
  },
  text: {
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.5),
    marginRight: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  text1: {
    color: COLORS.darkBlack,
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    marginLeft: 10
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmButton: {
    width: '90%',
    marginTop: 20
  }
})

export default Wallets
