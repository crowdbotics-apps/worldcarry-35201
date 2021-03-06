import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  Modal
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import passportVerification from '../../assets/svg/passportVerification.svg'
import pinBlack from '../../assets/svg/pinBlack.svg'
import verified from '../../assets/svg/verified.svg'
import {
  AppButton,
  Header,
  PassportStep1,
  PassportStep2,
  PassportStep3
} from '../../components'
import { COLORS, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import AppContext from '../../store/Context'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import calendarIcon from '../../assets/svg/calendarIcon.svg'
import timeIcon from '../../assets/svg/time.svg'
import moment from 'moment'

function PassportVerification ({ navigation }) {
  const [state, setState] = useState({
    loading: false,
    modalVisible: false,
    step: 0,
    date: new Date(),
    Videodate: new Date(),
    gender: ''
  })

  // Context
  const context = useContext(AppContext)
  const { step, loading, modalVisible, date, Videodate, gender } = state
  const {} = context

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleNext = () => {
    if (step === 0) {
      handleChange('step', 1)
    } else if (step === 1) {
      handleChange('step', 2)
    } else if (step === 2) {
      handleChange('modalVisible', true)
    }
  }

  const handlePrevious = () => {
    if (step === 1) {
      handleChange('step', 0)
    } else if (step === 2) {
      handleChange('step', 1)
    } else if (step === 3) {
      handleChange('step', 2)
    }
  }

  const disabled = false

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <Header color={COLORS.darkBlack} title={'Passport Verification'} cross />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{
          alignItems: 'center',
          height: '85%'
        }}
      >
        <SvgXml
          xml={passportVerification}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
        <Text style={styles.timetext}>
          {step === 0 && 'Step 1. Personal informations'}
          {step === 1 && 'Step 2. Upload Documents'}
          {step === 2 && 'Step 3. Schedule video call to verify your passport.'}
        </Text>
        <View style={styles.stepView}>
          <View style={step === 0 ? styles.activestep : styles.inActivestep}>
            <Text style={step === 0 ? styles.activeStepText : styles.stepText}>
              1
            </Text>
          </View>
          <View style={styles.line} />
          <View style={step === 1 ? styles.activestep : styles.inActivestep}>
            <Text style={step === 1 ? styles.activeStepText : styles.stepText}>
              2
            </Text>
          </View>
          <View style={styles.line} />
          <View style={step === 2 ? styles.activestep : styles.inActivestep}>
            <Text style={step === 2 ? styles.activeStepText : styles.stepText}>
              3
            </Text>
          </View>
        </View>
        {step === 0 && (
          <PassportStep1
            date={date}
            gender={gender}
            handleChange={handleChange}
          />
        )}
        {step === 1 && <PassportStep2 handleChange={handleChange} />}
        {step === 2 && (
          <PassportStep3 Videodate={Videodate} handleChange={handleChange} />
        )}
      </ScrollView>
      {step < 3 && (
        <View style={styles.bottom}>
          {step === 0 ? (
            <View style={{ width: '48%' }} />
          ) : (
            <AppButton
              title={'Previous'}
              onPress={handlePrevious}
              backgroundColor={COLORS.backgroud}
              outlined
              color={COLORS.primary}
              width={'48%'}
            />
          )}
          <AppButton
            title={step === 2 ? 'Schedule' : 'Next'}
            disabled={disabled}
            loading={loading}
            width={'48%'}
            onPress={handleNext}
          />
        </View>
      )}
      <Modal animationType='slide' transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.imageView}>
              <SvgXml xml={verified} width={100} height={100} />
            </View>
            <View style={styles.textView}>
              <Text style={styles.textBold}>
                The request for passport verification was successfully
                submitted. your passport verification call scheduled to...
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <View style={styles.greyBox}>
                  <SvgXml xml={calendarIcon} />
                  <Text style={styles.dateText}>
                    {moment(Videodate).format('YYYY-MM-DD')}
                  </Text>
                </View>
                <View style={styles.greyBox}>
                  <SvgXml xml={timeIcon} />
                  <Text style={styles.dateText}>
                    {'9:AM'}
                  </Text>
                </View>
              </View>
              <AppButton
                title={'Done'}
                onPress={() => {
                  handleChange('modalVisible', false)
                  navigation.navigate('Profile')
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '80%'
  },
  greyBox: {
    width: '48%',
    marginTop: 10,
    height: hp(6),
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightgrey
  },
  stepView: {
    width: '90%',
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottom: {
    flexDirection: 'row',
    width: '90%',
    height: '10%',
    position: 'absolute',
    marginLeft: '5%',
    bottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activestep: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: COLORS.stepGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timetext: {
    textAlign: 'center',
    fontSize: hp(1.8),
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR
  },
  dateText: {
    textAlign: 'center',
    fontSize: hp(1.8),
    color: COLORS.darkBlack,
    marginLeft: 10,
    fontFamily: FONT1REGULAR
  },
  inActivestep: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: COLORS.backgroud,
    borderWidth: 1,
    borderColor: COLORS.stepGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeStepText: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    color: COLORS.white
  },
  stepText: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    color: COLORS.stepGreen
  },
  line: {
    width: '15F%',
    height: 1,
    backgroundColor: COLORS.stepGreen
  },
  hline: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.tripBoxBorder
  },

  row: { flexDirection: 'row', alignItems: 'center' },
  tabs: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: '5%',
    height: hp(7),
    marginBottom: 20
  },
  tab: {
    width: '50%',
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: COLORS.lightblue,
    borderRadius: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  tabText: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },

  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  inavtive: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center'
  },
  active: {
    borderWidth: 0,
    marginRight: 5,
    backgroundColor: COLORS.white,
    width: 10,
    height: 10,
    borderRadius: 10
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
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
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
    width: '90%',
    alignItems: 'center',
    marginTop: 20
  },
  textBold: {
    fontFamily: FONT1REGULAR,
    color: COLORS.darkBlack,
    fontSize: hp(2),
    textAlign: 'center'
  }
})

export default PassportVerification
