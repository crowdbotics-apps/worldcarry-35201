import React, { useState } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Modal
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import pinBlack from '../../assets/svg/pinBlack.svg'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import calendarIcon from '../../assets/svg/calendarIcon.svg'
import arrivalPlan from '../../assets/svg/arrivalPlan.svg'
import AppInput from '../AppInput'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function PassportStep1 ({
  date,
  gender,
  handleChange,
  name,
  lastname,
  passport_number
}) {
  const [open, setOpen] = useState(false)
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps={'handled'}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.text}>Enter Details in Passport</Text>
      <AppInput
        borderColor={COLORS.borderColor1}
        marginBottom={5}
        value={name}
        name={'name'}
        onChange={handleChange}
        placeholder={'First name*'}
      />
      <AppInput
        borderColor={COLORS.borderColor1}
        marginBottom={5}
        value={lastname}
        name={'lastname'}
        onChange={handleChange}
        placeholder={'Last name'}
      />
      <AppInput
        borderColor={COLORS.borderColor1}
        marginBottom={5}
        value={passport_number}
        name={'passport_number'}
        onChange={handleChange}
        placeholder={'Passport No*'}
      />
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.buttonView}>
        <Text style={styles.buttonText}>
          {moment(date).format('LL') || 'Date of Birth*'}
        </Text>
        <SvgXml xml={calendarIcon} style={{ opacity: 0.6 }} />
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        date={date}
        mode={'date'}
        maximumDate={new Date()}
        onConfirm={date => {
          setOpen(false)
          handleChange('date', date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <Text style={styles.gender}>Gender</Text>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}
      >
        <View style={styles.row}>
          <BouncyCheckbox
            size={18}
            fillColor={COLORS.primary}
            disableBuiltInState={true}
            unfillColor={COLORS.white}
            disableText={true}
            onPress={() => handleChange('gender', 'Male')}
            isChecked={gender === 'Male' ? true : false}
            iconStyle={{ borderColor: COLORS.primary, borderRadius: 20 }}
          />
          <Text style={[styles.text2]}>Male</Text>
        </View>
        <View style={styles.row}>
          <BouncyCheckbox
            size={18}
            fillColor={COLORS.primary}
            disableBuiltInState={true}
            unfillColor={COLORS.white}
            disableText={true}
            onPress={() => handleChange('gender', 'Female')}
            isChecked={gender === 'Female' ? true : false}
            iconStyle={{ borderColor: COLORS.primary, borderRadius: 20 }}
          />
          <Text style={[styles.text2]}>Female</Text>
        </View>
        <View style={styles.row}>
          <BouncyCheckbox
            size={18}
            fillColor={COLORS.primary}
            disableBuiltInState={true}
            unfillColor={COLORS.white}
            disableText={true}
            onPress={() => handleChange('gender', 'Other')}
            isChecked={gender === 'Other' ? true : false}
            iconStyle={{ borderColor: COLORS.primary, borderRadius: 20 }}
          />
          <Text style={[styles.text2]}>Other</Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '60%',
    marginTop: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontFamily: FONT1MEDIUM,
    marginBottom: 10,
    marginTop: 10,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  buttonText: {
    color: COLORS.inputText,
    fontFamily: FONT1LIGHT,
    fontSize: hp(1.8)
  },
  text2: {
    color: COLORS.darkBlack,
    fontFamily: FONT1REGULAR,
    fontSize: hp(1.8),
    marginLeft: 10,
    marginRight: 20
  },
  gender: {
    color: COLORS.darkGrey,
    marginTop: 20,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    marginBottom: 10
  },
  buttonView: {
    width: '100%',
    height: hp(6),
    paddingHorizontal: '5%',
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: COLORS.borderColor1,
    marginTop: hp('1%')
  }
})
