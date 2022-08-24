import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import InfoCircle from '../../assets/svg/InfoCircle.svg'
import pinBlack from '../../assets/svg/pinBlack.svg'
import {
  AppButton,
  CustomModel,
  Header,
  JourneyStep1,
  JourneyStep2,
  JourneyStep3
} from '../../components'
import { COLORS, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import AppContext from '../../store/Context'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJourney, createMyAddresses } from '../../api/journey'
import Geocoder from 'react-native-geocoding'
Geocoder.init('AIzaSyCR6w9b59vHgXUpZUhHKu8FW7NG34RiHSU')

function CreateJourney ({ navigation, route }) {
  const activeRoundParams = route?.params?.activeRoundParams
  const [state, setState] = useState({
    loading: false,
    step: 0,
    departure_city: '',
    departure_state: '',
    departure_country: '',
    departure_city_state: '',
    arrival_city: '',
    arrival_city_state: '',
    arrival_state: '',
    arrival_country: '',
    date_of_journey: '',
    date_of_return: '',
    willing_to_carry: [],
    total_weight: '',
    activeRound: activeRoundParams || false,
    isFocus: false,
    isFocus1: false,
    isNotValidWeight: false,
    locationType: '',
    locationOpen: false,
    createdJourney: null
  })

  // Context
  const context = useContext(AppContext)
  const {
    step,
    departure_city,
    departure_state,
    departure_country,
    departure_city_state,
    arrival_city,
    arrival_city_state,
    arrival_state,
    arrival_country,
    date_of_journey,
    date_of_return,
    willing_to_carry,
    isNotValidWeight,
    total_weight,
    loading,
    activeRound,
    isFocus,
    createdJourney,
    arrival_coords,
    departure_coords,
    locationOpen,
    isFocus1,
    locationType
  } = state
  const {
    user,
    mapLocationForPickup,
    mapLocationForArrival,
    setMapLocationForPickup,
    setMapLocationForArrival,
    _getJourneys,
    myAddresses,
    _getMyAddresses
  } = context

  useEffect(() => {
    if (mapLocationForPickup) {
      handleChange('pickup_address', mapLocationForPickup)
      setMapLocationForPickup(null)
    }
    if (mapLocationForArrival) {
      handleChange('arrival_address', mapLocationForArrival)
      setMapLocationForArrival(null)
    }
  }, [mapLocationForPickup, mapLocationForArrival])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }
  const handleOpen = type => {
    handleChange('locationType', type)
    handleChange('locationOpen', true)
  }

  const selectLocation = location => {
    if (locationType === 'departure') {
      handleChange('departure_city', location?.city)
      handleChange('departure_state', location?.state)
      handleChange('departure_country', location?.country)
      handleChange(
        'departure_city_state',
        location?.city + ', ' + location?.country
      )
      handleChange('locationType', '')
    } else {
      handleChange('arrival_city', location?.city)
      handleChange('arrival_state', location?.state)
      handleChange('arrival_country', location?.country)
      handleChange(
        'arrival_city_state',
        location?.city + ', ' + location?.country
      )
      handleChange('locationType', '')
    }
    handleChange('locationOpen', false)
  }

  const handleNext = () => {
    if (step === 0) {
      handleChange('step', 1)
    } else if (step === 1) {
      handleCreate()
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

  const handleCreate = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        type: activeRound ? 'Round Trip' : 'One Way',
        departure_city,
        departure_state,
        departure_country,
        arrival_city,
        arrival_state,
        arrival_country,
        date_of_journey,
        total_weight,
        willing_to_carry
      }
      date_of_return ? (payload['date_of_return'] = date_of_return) : ''
      const res = await createJourney(payload, token)
      const payload1 = {
        city: departure_city,
        state: departure_state,
        country: departure_country,
        coordinates: departure_coords
      }
      const payload2 = {
        city: arrival_city,
        state: arrival_state,
        country: arrival_country,
        coordinates: arrival_coords
      }
      const res1 = await createMyAddresses(payload1, token)
      const res2 = await createMyAddresses(payload2, token)
      _getJourneys('')
      _getMyAddresses()
      handleChange('loading', false)
      handleChange('createdJourney', res?.data)
      handleChange('step', 2)
      Toast.show('Journey Created Successfully!')
      // navigation.navigate('Orders')
    } catch (error) {
      console.warn('error', error)
      handleChange('loading', false)
      console.warn('error?.response?.data', error?.response?.data)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
  }

  const handleSearch = (data, details) => {
    if (details?.geometry?.location) {
      Geocoder.from(
        details?.geometry?.location?.lat?.toFixed(6),
        details?.geometry?.location?.lng?.toFixed(6)
      )
        .then(async json => {
          var address_components = json.results[0].address_components
          let dState = ''
          let country = ''
          let city = ''
          if (address_components !== undefined) {
            const addrComp = address_components
            for (let i = 0; i < addrComp.length; ++i) {
              var typ = addrComp[i].types[0]
              if (typ === 'administrative_area_level_1') {
                dState = addrComp[i].long_name
              } else if (typ === 'locality') {
                city = addrComp[i].long_name
              } else if (typ === 'country') {
                country = addrComp[i].long_name
              } //store the country
            }
          }
          const departure_coords = `Point(${details?.geometry?.location?.lat} ${details?.geometry?.location?.lng})`
          handleChange('departure_coords', departure_coords)
          handleChange('departure_city_state', city + ', ' + dState)
          handleChange('departure_city', city)
          handleChange('departure_country', country)
          handleChange('departure_state', dState)
        })
        .catch(error => alert(error?.origin?.error_message))
    }
  }
  const handleSearch1 = (data, details) => {
    if (details?.geometry?.location) {
      Geocoder.from(
        details?.geometry?.location?.lat,
        details?.geometry?.location?.lng
      )
        .then(async json => {
          var address_components = json.results[0].address_components
          let dState = ''
          let country = ''
          let city = ''
          if (address_components !== undefined) {
            const addrComp = address_components
            for (let i = 0; i < addrComp.length; ++i) {
              var typ = addrComp[i].types[0]
              if (typ === 'administrative_area_level_1') {
                dState = addrComp[i].long_name
              } else if (typ === 'locality') {
                city = addrComp[i].long_name
              } else if (typ === 'country') {
                country = addrComp[i].long_name
              } //store the country
            }
          }
          const arrival_coords = `Point(${details?.geometry?.location?.lat} ${details?.geometry?.location?.lng})`
          handleChange('arrival_coords', arrival_coords)
          handleChange('arrival_city_state', city + ', ' + dState)
          handleChange('arrival_city', city)
          handleChange('arrival_country', country)
          handleChange('arrival_state', dState)
        })
        .catch(error => console.warn('Geocodererror', error))
    }
  }
  const clearForm = () => {
    if (step === 0) {
      handleChange('departure_city', '')
      handleChange('departure_state', '')
      handleChange('departure_country', '')
      handleChange('arrival_city', '')
      handleChange('arrival_state', '')
      handleChange('arrival_country', '')
      handleChange('date_of_journey', '')
    } else if (step === 1) {
      handleChange('willing_to_carry', [])
      handleChange('total_weight', '')
      handleChange('isNotValidWeight', false)
    }
  }
  const disabled =
    step === 0
      ? !departure_city ||
        !departure_state ||
        !departure_country ||
        !arrival_city ||
        !arrival_state ||
        !arrival_country ||
        !date_of_journey
      : willing_to_carry.length === 0 || !total_weight || isNotValidWeight

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <Header
        title={'Add Journey'}
        back
        rightItem={
          <TouchableOpacity
            onPress={() =>
              step === 2 ? navigation.navigate('Journey') : clearForm()
            }
          >
            <Text style={styles.activeTabText}>
              {step === 2 ? 'Done' : 'Clear Form'}
            </Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{
          alignItems: 'center',
          height: step === 2 ? '100%' : '85%'
        }}
      >
        {step === 2 ? (
          <JourneyStep3 createdJourney={createdJourney} />
        ) : (
          <>
            <View style={styles.tabs}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => handleChange('activeRound', false)}
                  style={!activeRound ? styles.activeTab : styles.inavtive}
                >
                  <Text
                    style={!activeRound ? styles.activeTabText : styles.tabText}
                  >
                    One way
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleChange('activeRound', true)}
                  style={activeRound ? styles.activeTab : styles.inavtive}
                >
                  <Text
                    style={activeRound ? styles.activeTabText : styles.tabText}
                  >
                    Round Trip
                  </Text>
                </TouchableOpacity>
                <Text style={styles.tabText}></Text>
              </View>
              <TouchableOpacity style={styles.infoDiv}>
                <SvgXml xml={InfoCircle} />
              </TouchableOpacity>
            </View>
            <Text style={styles.timetext}>
              {step === 0 && 'Step 1. Add Journey Details'}
              {step === 1 && 'Step 2. Carrying Details'}
            </Text>
            <View style={styles.stepView}>
              <View
                style={step === 0 ? styles.activestep : styles.inActivestep}
              >
                <Text
                  style={step === 0 ? styles.activeStepText : styles.stepText}
                >
                  1
                </Text>
              </View>
              <View style={styles.line} />
              <View
                style={step === 1 ? styles.activestep : styles.inActivestep}
              >
                <Text
                  style={step === 1 ? styles.activeStepText : styles.stepText}
                >
                  2
                </Text>
              </View>
            </View>
            {step === 0 && (
              <JourneyStep1
                departure_city={departure_city}
                departure_state={departure_state}
                departure_country={departure_country}
                departure_city_state={departure_city_state}
                arrival_city={arrival_city}
                arrival_city_state={arrival_city_state}
                arrival_state={arrival_state}
                arrival_country={arrival_country}
                date_of_journey={date_of_journey}
                date_of_return={date_of_return}
                activeRound={activeRound}
                handleOpen={handleOpen}
                isFocus={isFocus}
                isFocus1={isFocus1}
                handleChange={handleChange}
                handleSearch={handleSearch}
                handleSearch1={handleSearch1}
              />
            )}
            {step === 1 && (
              <JourneyStep2
                willing_to_carry={willing_to_carry}
                isNotValidWeight={isNotValidWeight}
                total_weight={total_weight}
                handleChange={handleChange}
              />
            )}
          </>
        )}
      </ScrollView>
      {step < 2 && (
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
            title={step === 1 ? 'Add Journey' : 'Next'}
            disabled={disabled}
            loading={loading}
            width={'48%'}
            onPress={handleNext}
          />
        </View>
      )}
      <CustomModel
        visible={locationOpen}
        onClose={() => handleChange('locationOpen', false)}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: '5%',
            marginTop: 10,
            marginBottom: 10
          }}
        >
          <Text
            style={{
              fontFamily: FONT1MEDIUM,
              color: COLORS.darkBlack,
              fontSize: hp(2.2)
            }}
          >
            Choose Location
          </Text>
          <TouchableOpacity onPress={() => handleChange('locationOpen', false)}>
            <Text
              style={{
                fontFamily: FONT1REGULAR,
                color: COLORS.primary,
                fontSize: hp(2)
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
          style={{ width: '100%', height: '100%', marginBottom: 20 }}
        >
          {myAddresses?.map((item, index) => (
            <TouchableOpacity
              onPress={() => selectLocation(item)}
              key={index}
              style={{
                width: '90%',
                borderWidth: 1,
                borderColor: COLORS.borderColor,
                borderRadius: 10,
                marginTop: 10,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.borderColor,
                  marginRight: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SvgXml xml={pinBlack} />
              </View>
              <Text style={{ color: COLORS.black, fontFamily: FONT1REGULAR }}>
                {item?.city}, {item?.country}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </CustomModel>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: '100%',
    height: '80%'
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
  bgImage: {
    width: '100%',
    alignItems: 'center',
    height: 200,
    paddingTop: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
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
  infoDiv: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  headerText: {
    width: '80%',
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  imgStyle: {
    width: '100%',
    height: 200,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  viewAll: {
    textAlign: 'center',
    fontSize: hp(2),
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontFamily: FONT1REGULAR
  },
  timetext: {
    textAlign: 'center',
    fontSize: hp(1.8),
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR
  },
  pricetext: {
    width: '80%',
    fontSize: hp(2.8),
    color: COLORS.darkBlack,
    fontFamily: FONT1REGULAR
  },
  slide: {
    width: '90%',
    justifyContent: 'space-between',
    height: 220,
    borderRadius: 22
  },
  userProfile: {
    borderRadius: 50,
    height: 50,
    width: 50
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
  }
})

export default CreateJourney
