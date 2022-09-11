import React from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import AppButton from '../AppButton'
import CustomModel from '../Modal/CustomModel'
import Header from '../Header'
import { useState } from 'react'
import mastercardWhite from '../../assets/svg/mastercardWhite.svg'
import { SvgXml } from 'react-native-svg'

export default function Step4 ({
  handleChange,
  product_price,
  carrier_reward,
  isChecked,
  navigation,
  paymethods,
  payment_method_id,
  _removePayMethod
}) {
  const [state, setState] = useState({
    openPayMethod: false
  })
  const { openPayMethod } = state
  const handleChangeLocal = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }
  const fee = 7.99
  const pfee = 3.99
  const total = Number(product_price) + Number(carrier_reward) + fee + pfee
  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled
      keyboardShouldPersistTaps={'handled'}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.summary}>Summary</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.type}>Product Price</Text>
        <Text style={styles.value}>${product_price}</Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.type}>Carrier Reward</Text>
        <Text style={styles.value}>${carrier_reward}</Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.type}>WorldCarry Fee</Text>
        <Text style={styles.value}>${7.99}</Text>
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.type}>Processing Fee</Text>
        <Text style={styles.value}>${3.99}</Text>
      </View>
      <View style={styles.hline} />
      <View style={styles.rowBetween}>
        <Text style={styles.total}>Grand Total </Text>
        <Text style={styles.totalvalue}>${total.toFixed(2)}</Text>
      </View>
      <AppButton
        title={'Select Payment Method'}
        backgroundColor={'transparent'}
        color={COLORS.primary}
        onPress={() => handleChangeLocal('openPayMethod', true)}
      />
      {/* <View
        style={{
          width: '90%',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20
        }}
      >
        <BouncyCheckbox
          size={20}
          fillColor={COLORS.primary}
          unfillColor={COLORS.white}
          text=''
          iconStyle={{ borderColor: COLORS.primary, borderRadius: 8 }}
          textStyle={{
            fontFamily: FONT1REGULAR,
            fontSize: hp(2),
            color: COLORS.darkBlack
          }}
          disableBuiltInState={true}
          isChecked={isChecked}
          onPress={() => handleChange('isChecked', !isChecked)}
        />
        <Text style={styles.type}>I agree to the WorldCarry </Text>
        <TouchableOpacity>
          <Text style={[styles.type, { color: COLORS.primary }]}>
            Terms of use.
          </Text>
        </TouchableOpacity>
      </View> */}
      <CustomModel
        height={'100%'}
        width={'100%'}
        visible={openPayMethod}
        isNotBar
        onClose={() => handleChangeLocal('openPayMethod', false)}
      >
        <Header
          title={'Payment Method'}
          rightItem={
            <TouchableOpacity
              onPress={() => {
                handleChangeLocal('openPayMethod', false)
                navigation.navigate('PaymentMethod')
              }}
            >
              <Text style={styles.activeTabText}>{'Add'}</Text>
            </TouchableOpacity>
          }
          color={COLORS.darkBlack}
          back
          backPress={() => handleChangeLocal('openPayMethod', false)}
        />
        <FlatList
          data={paymethods}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20
                  }}
                >
                  <BouncyCheckbox
                    size={20}
                    fillColor={COLORS.primary}
                    unfillColor={COLORS.white}
                    text=''
                    iconStyle={{ borderColor: COLORS.primary, borderRadius: 8 }}
                    textStyle={{
                      fontFamily: FONT1REGULAR,
                      fontSize: hp(2),
                      color: COLORS.darkBlack
                    }}
                    disableBuiltInState={true}
                    isChecked={payment_method_id === item?.id}
                    onPress={() => {
                      if (payment_method_id === item?.id) {
                        handleChange('payment_method_id', '')
                      } else {
                        handleChange('payment_method_id', item?.id)
                      }
                    }}
                  />
                  <Text style={styles.total}>Card {index + 1}</Text>
                </View>
                {payment_method_id !== item?.id && (
                  <View style={{ marginRight: -20, marginTop: 10 }}>
                    <AppButton
                      title={'Remove'}
                      color={COLORS.primary}
                      onPress={() => _removePayMethod(item?.id)}
                      backgroundColor={'transparent'}
                      width={100}
                    />
                  </View>
                )}
              </View>
              <View
                key={index}
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
                  <Text style={styles.leftText}>
                    **** **** **** {item?.card?.last4}
                  </Text>
                </View>
                <View style={[styles.row, { marginTop: 20 }]}>
                  <View style={{ marginRight: 20 }}>
                    <Text style={styles.cardText}>Card Holder</Text>
                    <Text style={styles.holder}>
                      {item?.billing_details?.name}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.cardText}>Expiry Date</Text>
                    <Text style={styles.holder}>
                      {item?.card?.exp_month + '/' + item?.card?.exp_year}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </CustomModel>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '60%',
    marginTop: 20
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10
  },
  type: {
    fontFamily: FONT1LIGHT,
    fontSize: hp(2),
    color: COLORS.darkGrey
  },
  value: {
    fontFamily: FONT1LIGHT,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  total: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.2),
    color: COLORS.darkBlack
  },
  totalvalue: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.5),
    color: COLORS.darkBlack
  },
  summary: {
    fontFamily: FONT1REGULAR,
    marginBottom: 10,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  hline: {
    marginTop: 20,
    width: '100%',
    height: 1,
    backgroundColor: COLORS.grey
  },
  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
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
  }
})
