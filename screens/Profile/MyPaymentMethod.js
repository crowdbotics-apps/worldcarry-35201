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
  FONT1LIGHT,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT2REGULAR,
  FONT2SEMIBOLD
} from '../../constants'
import { AppButton, Header } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon } from 'react-native-elements'
import { getPayMethod } from '../../api/business'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import mastercardWhite from '../../assets/svg/mastercardWhite.svg'
import addcard from '../../assets/svg/addcard.svg'
import MasterIcon from '../../assets/svg/masterCard.svg'
import { SvgXml } from 'react-native-svg'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

function MyPaymentMethod ({ navigation }) {
  // State
  const [state, setState] = useState({
    loading: false,
    isChecked: '',
    paymethods: []
  })

  const { paymethods, isChecked, loading } = state

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
          title={'Payment Method'}
          color={COLORS.darkBlack}
          back
          rightItem={
            <TouchableOpacity
              onPress={() => navigation.navigate('AddPaymentMethod')}
            >
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          }
        />
        <View
          style={{
            backgroundColor: COLORS.blueBG,
            width: '90%',
            padding: 20,
            marginVertical: 20,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}
        >
          <SvgXml xml={mastercardWhite} />
          <View style={styles.rowBetween}>
            <Text style={styles.leftText}>**** **** **** 6578</Text>
          </View>
          <View style={[styles.row, { marginTop: 20 }]}>
            <View style={{ marginRight: 20 }}>
              <Text style={styles.cardText}>Card Holder</Text>
              <Text style={styles.holder}>Rachel Green</Text>
            </View>
            <View>
              <Text style={styles.cardText}>Card Holder</Text>
              <Text style={styles.holder}>Rachel Green</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsBox}>
          <Text style={styles.detailsText}>
            Your card is being verified. will notify you of the status within
            the next few business days
          </Text>
        </View>
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
  cardText: {
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2)
  },
  holder: {
    color: COLORS.white,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2)
  },
  head: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  leftText: {
    color: COLORS.white,
    letterSpacing: 5,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.5),
    marginTop: 20
  },
  detailsText: {
    color: COLORS.darkBlack,
    fontFamily: FONT1LIGHT,
    fontSize: hp(2)
  },
  addText: {
    color: COLORS.primary,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2)
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
  detailsBox: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.primaryLight,
    width: '90%'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default MyPaymentMethod
