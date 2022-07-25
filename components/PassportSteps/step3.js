import React, { useState } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Modal
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import pinBlack from '../../assets/svg/pinBlack.svg'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import pickupPlan from '../../assets/svg/pickupPlan.svg'
import ShieldDone from '../../assets/svg/ShieldDone.svg'
import DatePicker from 'react-native-date-picker'
import calendarIcon from '../../assets/svg/calendarIcon.svg'
import moment from 'moment'

export default function PassportStep3 ({ Videodate, handleChange }) {
  const [open, setOpen] = useState(false)
  const timelist = [
    { title: 'Now', value: 'Now' },
    { title: '9:00 AM', value: '9:00 AM' },
    { title: '10:00 AM', value: '10:00 AM' },
    { title: '11:00 AM', value: '11:00 AM' },
    { title: '12:00 PM', value: '12:00 PM' },
    { title: '01:00 PM', value: '01:00 PM' },
    { title: '03:00 PM', value: '03:00 PM' },
    { title: '04:00 PM', value: '04:00 PM' },
    { title: '05:00 PM', value: '05:00 PM' }
  ]
  return (
    <ScrollView
      keyboardShouldPersistTaps={'handled'}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.head}>Schedule video call</Text>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.buttonView}>
        <Text style={styles.buttonText}>
          {moment(Videodate).format('LL') || 'Date of Birth*'}
        </Text>
        <SvgXml xml={calendarIcon} style={{ opacity: 0.6 }} />
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        date={Videodate}
        mode={'date'}
        onConfirm={date => {
          setOpen(false)
          handleChange('Videodate', date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <Text style={[styles.head, { marginTop: 20 }]}>
        Time <Text style={{ color: COLORS.grey }}>(Indian Time)</Text>
      </Text>
      <FlatList
        data={timelist}
        numColumns={3}
        style={{ width: '100%' }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item, index }) => (
          <TouchableOpacity key={index} style={styles.timeBox}>
            <Text style={styles.timeText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.ShieldDoneBox}>
        <SvgXml xml={ShieldDone} />
        <Text style={styles.ShieldDoneText}>
          We will contact you at the time you specified, so please be available
          at that time.
        </Text>
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
  ShieldDoneBox: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: COLORS.successBG,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ShieldDoneText: {
    fontFamily: FONT1REGULAR,
    fontSize: hp(1.8),
    color: COLORS.successBGBorder,
    width: '90%',
    marginLeft: 10
  },
  head: {
    fontFamily: FONT1MEDIUM,
    marginBottom: 10,
    marginTop: 10,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  timeBox: {
    width: '30%',
    marginBottom: 15,
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10
  },
  buttonText: {
    color: COLORS.inputText,
    fontFamily: FONT1LIGHT,
    fontSize: hp(1.8)
  },
  timeText: {
    color: COLORS.darkBlack,
    fontFamily: FONT1LIGHT,
    fontSize: hp(1.8)
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
