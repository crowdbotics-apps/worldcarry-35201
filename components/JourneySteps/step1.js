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
import pickupPlan from '../../assets/svg/pickupPlan.svg'
import arrivalPlan from '../../assets/svg/arrivalPlan.svg'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import AppButton from '../AppButton'
import Toast from 'react-native-simple-toast'

export default function JourneyStep1 ({
  handleChange,
  departure_city_state,
  arrival_city_state,
  activeRound,
  handleSearch1,
  handleSearch,
  date_of_return,
  date_of_journey,
  isFocus,
  isFocus1,
  handleOpen
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [showReturnCalendar, setShowReturnCalendar] = useState(false)
  const [markedDates, setMarkedDates] = useState({})
  const [markedDates1, setMarkedDates1] = useState({})
  const getSelectedDayEvents = date => {
    let markedDates = {}
    markedDates[date] = {
      selected: true,
      color: '#00B0BF',
      textColor: '#FFFFFF',
      customStyles: {
        container: {
          borderRadius: 5
        }
      }
    }
    let serviceDate = moment(date)
    serviceDate = serviceDate.format('YYYY-MM-DD')
    handleChange('date_of_journey', serviceDate)
    setMarkedDates(markedDates)
  }
  const getSelectedDayEvents1 = date => {
    let markedDates = {}
    markedDates[date] = {
      selected: true,
      color: '#00B0BF',
      textColor: '#FFFFFF',
      customStyles: {
        container: {
          borderRadius: 5
        }
      }
    }
    let serviceDate = moment(date)
    serviceDate = serviceDate.format('YYYY-MM-DD')
    handleChange('date_of_return', serviceDate)
    setMarkedDates1(markedDates)
  }
  return (
    <ScrollView
      keyboardShouldPersistTaps={'handled'}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100%',
          marginVertical: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: COLORS.borderColor,
          backgroundColor: COLORS.white
        }}
      >
        <SvgXml
          xml={pickupPlan}
          fillOpacity={0.6}
          style={{ marginLeft: 10, marginTop: hp(2) }}
        />
        <View style={{ width: '90%' }}>
          <GooglePlacesAutocomplete
            placeholder={'Departure City'}
            fetchDetails={true}
            onPress={(data, details) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details)
              handleSearch(data, details)
            }}
            textInputProps={{
              placeholderTextColor: COLORS.placeholder,
              value: departure_city_state,
              onFocus: () => handleChange('isFocus', true),
              onBlur: () => handleChange('isFocus', false),
              onChangeText: text => handleChange('departure_city_state', text)
            }}
            styles={{
              // container: styles.textInput,
              textInput: {
                // flex: 1,
                fontSize: hp(1.8),
                backgroundColor: 'transparent',
                // width: '85%',
                height: '100%',
                color: COLORS.darkGrey,
                fontFamily: FONT1REGULAR
              },
              poweredContainer: { backgroundColor: COLORS.white },
              row: { backgroundColor: COLORS.white }
            }}
            query={{
              key: 'AIzaSyAEmKGJ68eGUiasdk3A3Ws5PJ2VvB0wSPg',
              language: 'en'
            }}
            GooglePlacesDetailsQuery={{
              fields: 'geometry'
            }}
            filterReverseGeocodingByTypes={['locality']}
            keyboardShouldPersistTaps={'handled'}
            listViewDisplayed={false}
            enablePoweredByContainer={false}
            renderRow={data => {
              return (
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      backgroundColor: COLORS.grey,
                      marginRight: 10,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SvgXml xml={pinBlack} />
                  </View>
                  <Text
                    style={{ color: COLORS.black, fontFamily: FONT1REGULAR }}
                  >
                    {data.description}
                  </Text>
                </View>
              )
            }}
            debounce={200}
            currentLocation={false}
            currentLocationLabel='Current location'
            nearbyPlacesAPI='GooglePlacesSearch'
          />
          {isFocus && (
            <TouchableOpacity
              onPress={() => handleOpen('departure')}
              style={{ width: '90%', marginBottom: 10, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: FONT1REGULAR, color: COLORS.primary }}>
                Choose from Address
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100%',
          marginVertical: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: COLORS.borderColor,
          backgroundColor: COLORS.white
        }}
      >
        <SvgXml
          xml={arrivalPlan}
          fillOpacity={0.6}
          style={{ marginLeft: 10, marginTop: hp(2) }}
        />
        <View style={{ width: '90%' }}>
          <GooglePlacesAutocomplete
            placeholder={'Arrival City'}
            fetchDetails={true}
            onPress={(data, details) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details)
              handleSearch1(data, details)
            }}
            textInputProps={{
              placeholderTextColor: COLORS.placeholder,
              value: arrival_city_state,
              onFocus: () => handleChange('isFocus1', true),
              onBlur: () => handleChange('isFocus1', false),
              onChangeText: text => handleChange('arrival_city_state', text)
            }}
            styles={{
              // container: styles.textInput,
              textInput: {
                // flex: 1,
                fontSize: hp(1.8),
                backgroundColor: 'transparent',
                // width: '85%',
                height: '100%',
                color: COLORS.darkGrey,
                fontFamily: FONT1REGULAR
              },
              poweredContainer: { backgroundColor: COLORS.white },
              row: { backgroundColor: COLORS.white }
            }}
            query={{
              key: 'AIzaSyAEmKGJ68eGUiasdk3A3Ws5PJ2VvB0wSPg',
              language: 'en'
            }}
            GooglePlacesDetailsQuery={{
              fields: 'geometry'
            }}
            filterReverseGeocodingByTypes={['locality']}
            keyboardShouldPersistTaps={'handled'}
            listViewDisplayed={false}
            renderRow={data => (
              <View style={{ width: '100%', flexDirection: 'row' }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    backgroundColor: COLORS.grey,
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SvgXml xml={pinBlack} />
                </View>
                <Text style={{ color: COLORS.black, fontFamily: FONT1REGULAR }}>
                  {data.description}
                </Text>
              </View>
            )}
            debounce={200}
            currentLocation={false}
            currentLocationLabel='Current location'
            nearbyPlacesAPI='GooglePlacesSearch'
          />
          {isFocus1 && (
            <TouchableOpacity
              onPress={() => handleOpen('')}
              style={{ width: '90%', marginBottom: 10, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: FONT1REGULAR, color: COLORS.primary }}>
                Choose from Address
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
          height: hp(7),
          marginVertical: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: COLORS.borderColor,
          backgroundColor: COLORS.white
        }}
      >
        <SvgXml
          xml={arrivalPlan}
          fillOpacity={0.6}
          style={{ marginLeft: 10 }}
        />
        <Text
          style={{
            fontFamily: FONT1REGULAR,
            fontSize: hp(2),
            marginLeft: 10,
            color: date_of_journey ? COLORS.black : COLORS.grey
          }}
        >
          {date_of_journey || 'Date of Journey'}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {activeRound ? (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowReturnCalendar(false)
                  }}
                  style={
                    !showReturnCalendar ? styles.activeTab : styles.inavtive
                  }
                >
                  <Text
                    style={
                      !showReturnCalendar
                        ? styles.activeTabText
                        : styles.tabText
                    }
                  >
                    Journey Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowReturnCalendar(true)
                  }}
                  style={
                    showReturnCalendar ? styles.activeTab : styles.inavtive
                  }
                >
                  <Text
                    style={
                      showReturnCalendar ? styles.activeTabText : styles.tabText
                    }
                  >
                    Return Date
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.headText}>Journey Date</Text>
            )}
            <View style={styles.hline} />
            <View style={{ paddingTop: 0 }}>
              <Calendar
                markedDates={showReturnCalendar ? markedDates1 : markedDates}
                onDayPress={day => {
                  showReturnCalendar
                    ? getSelectedDayEvents1(day.dateString)
                    : getSelectedDayEvents(day.dateString)
                }}
                style={{ width: '100%' }}
                monthFormat={'MMMM yyyy'}
                theme={{
                  calendarBackground: COLORS.backgroundColor,
                  arrowColor: COLORS.darkBlack,
                  todayTextColor: '#fff',
                  todayBackgroundColor: COLORS.primary
                }}
                minDate={new Date()}
                markingType={'custom'}
                enableSwipeMonths={true}
                firstDay={1}
              />
            </View>
            <View style={styles.hline} />
            <View style={styles.rowButton}>
              <AppButton
                title={'Cancel'}
                width={'48%'}
                onPress={() => setModalVisible(false)}
                backgroundColor={COLORS.white}
                titleLight
                color={COLORS.grey}
              />
              <AppButton
                title={activeRound && !showReturnCalendar ? 'Next' : 'Done'}
                onPress={() => {
                  if (showReturnCalendar) {
                    if (date_of_return) {
                      setShowReturnCalendar(false)
                      setModalVisible(false)
                    } else {
                      Toast.show('Select Return Date First!')
                    }
                  }
                  if (date_of_journey) {
                    if (activeRound) {
                      setShowReturnCalendar(true)
                    } else {
                      setModalVisible(false)
                    }
                  } else {
                    Toast.show('Select Date First!')
                  }
                }}
                width={'48%'}
                backgroundColor={COLORS.white}
                titleLight
                color={COLORS.primary}
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
    width: '90%',
    height: '60%',
    marginTop: 20
  },
  rowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  hline: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderColor,
    opacity: 0.4,
    marginTop: 10
  },
  headText: {
    fontFamily: FONT1REGULAR,
    color: COLORS.primary,
    fontSize: hp(2.2)
  },
  activeTab: {
    backgroundColor: COLORS.lightblue,
    borderRadius: 12,
    width: '45%',
    marginRight: 10,
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  tabText: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
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
    borderColor: COLORS.borderColor,
    backgroundColor: COLORS.white,
    height: hp(6),
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
    marginTop: 5
  },
  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  expectedTime: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  menuTriggerText: {
    color: COLORS.darkGrey,
    fontSize: hp(1.8),
    fontFamily: FONT1LIGHT
  },
  inavtive: {
    marginRight: 10,
    marginVertical: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 12,
    width: '45%',
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
  profileIcon: {
    width: '40%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.modalBG
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
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
  }
})
