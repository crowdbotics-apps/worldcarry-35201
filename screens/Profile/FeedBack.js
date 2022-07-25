import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Icon } from 'react-native-elements'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import faqIcon from '../../assets/svg/faq.svg'
import { AppButton, AppInput, Header } from '../../components'
import { SvgXml } from 'react-native-svg'
import whatsapp from '../../assets/svg/whatsapp.svg'
import attachment from '../../assets/svg/attachment.svg'

function FeedBack ({ navigation, route }) {
  // Context
  const [state, setState] = useState({
    questions: [],
    activeSections: []
  })
  const { questions, activeSections } = state
  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Header
          back
          color={COLORS.darkBlack}
          title={'Feedback'}
        />
        <View style={{ width: '90%', marginTop: 20, marginBottom: 15 }}>
          <AppInput
            placeholder={'Your Name'}
            inputLabel={'Your Name'}
            borderColor={COLORS.borderColor1}
            backgroundColor={COLORS.white}
            // value={searchText}
            // name={'searchText'}
            // onChange={filtered}
          />
        </View>
        <View style={{ width: '90%', marginTop: 10, marginBottom: 15 }}>
          <AppInput
            placeholder={'Enter email'}
            inputLabel={'Email'}
            backgroundColor={COLORS.white}
            borderColor={COLORS.borderColor1}
            // value={searchText}
            // name={'searchText'}
            // onChange={filtered}
          />
        </View>
        <View style={{ width: '90%', marginTop: 10, marginBottom: 15 }}>
          <AppInput
            placeholder={'Write here'}
            multiline
            height={100}
            inputLabel={'How can we help you?'}
            backgroundColor={COLORS.white}
            borderColor={COLORS.borderColor1}
            // value={searchText}
            // name={'searchText'}
            // onChange={filtered}
          />
        </View>
        <View style={{ width: '90%' }}>
          <TouchableOpacity style={styles.attachmentBox}>
            <SvgXml
              xml={attachment}
              width={hp(2.5)}
              style={{ marginRight: 10 }}
            />
            <Text
              style={[styles.text, { color: COLORS.primary, fontSize: hp(2) }]}
            >
              Attachments (if any)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ width: '90%', marginBottom: 20 }}>
        <AppButton
          title={'Submit'}
          onPress={() => handleChange('modalVisible', true)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  top: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  backContainer: { width: '40%', alignItems: 'flex-start', marginRight: 10 },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    width: '90%',
    alignItems: 'center'
  },
  attachmentBox: {
    width: '60%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  loginText: {
    color: COLORS.darkGrey,
    fontSize: hp('3%'),
    fontFamily: FONT1REGULAR
  },
  heading: {
    color: COLORS.primary,
    fontSize: hp('3%'),
    fontFamily: FONT1BOLD
  },
  heading1: {
    color: COLORS.darkBlack,
    fontSize: hp(2.2),
    fontFamily: FONT1REGULAR,
    marginTop: 20,
    marginBottom: 10
  },
  text: {
    color: COLORS.darkGrey,
    fontSize: hp(2.2),
    fontFamily: FONT1REGULAR
  },
  body: {
    width: '90%'
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.tripBoxBorder,
    paddingHorizontal: '5%'
  },
  content: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: '5%'
  },
  headerText: {
    width: '80%',
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor1,
    height: 50,
    backgroundColor: COLORS.white
  }
})

export default FeedBack
