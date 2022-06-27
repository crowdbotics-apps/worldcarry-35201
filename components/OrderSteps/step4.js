import React from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import location from '../../assets/svg/location.svg'
import globe from '../../assets/svg/globe.svg'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import AppButton from '../AppButton'
import { useNavigation } from '@react-navigation/native'
import pinBlack from '../../assets/svg/pinBlack.svg'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

export default function Step4 ({
  handleChange,
  product_price,
  carrier_reward,
  isChecked
}) {
  const fee = 7.99
  const pfee = 3.99
  const total = Number(product_price) + Number(carrier_reward) + fee + pfee
  return (
    <ScrollView
      style={styles.container}
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
      <View
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
          isChecked={isChecked}
          onPress={() => handleChange('isChecked', !isChecked)}
        />
        <Text style={styles.type}>I agree to the WorldCarry </Text>
        <TouchableOpacity>
          <Text style={[styles.type, { color: COLORS.primary }]}>
            Terms of use.
          </Text>
        </TouchableOpacity>
      </View>
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
  }
})
