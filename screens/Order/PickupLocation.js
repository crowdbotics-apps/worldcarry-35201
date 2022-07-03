import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  PermissionsAndroid,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps' // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from '@react-native-community/geolocation'
import {
  COLORS,
  FONT1LIGHT,
  FONT1REGULAR,
  FONT1SEMIBOLD,
  mapStyle
} from '../../constants'
import AppContext from '../../store/Context'
import { useFocusEffect } from '@react-navigation/native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import searchIcon from '../../assets/svg/searchIcon.svg'
import mapPin from '../../assets/svg/mapPin.svg'
import pinBlack from '../../assets/svg/pinBlack.svg'
import currentLcoation from '../../assets/svg/currentLcoation.svg'
import compass from '../../assets/svg/compass.svg'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppButton, Header } from '../../components'
import Svg, { SvgXml } from 'react-native-svg'
import { Icon } from 'react-native-elements'
import Geocoder from 'react-native-geocoding'
Geocoder.init('AIzaSyAEmKGJ68eGUiasdk3A3Ws5PJ2VvB0wSPg')

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = 0.0922
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

function PickupLocation ({ navigation }) {
  var mapRef = useRef(null)
  const [state, setState] = useState({
    loading: false,
    truckLocation: null,
    street: '',
    isFocus: false,
    isSearch: false
  })

  // Context
  const context = useContext(AppContext)
  const { loading, truckLocation, street, isFocus, isSearch } = state
  const { setMapLocationForPickup } = context

  useFocusEffect(
    useCallback(() => {
      requestGeolocationPermission()
    }, [])
  )

  useEffect(() => {
    requestGeolocationPermission()
  }, [])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleNext = () => {
    if (!street) {
      Geocoder.from(truckLocation?.latitude, truckLocation?.longitude)
        .then(async json => {
          var addressComponent = json.results[0].address_components[0]
          const payload = {
            pickup_address_street_one: addressComponent.short_name,
            pickup_address_coordinates: truckLocation
          }
          setMapLocationForPickup(payload)
          navigation.goBack()
        })
        .catch(error => console.warn('Geocodererror', error))
    } else {
      const payload = {
        pickup_address_street_one: street,
        pickup_address_coordinates: truckLocation
      }
      setMapLocationForPickup(payload)
      navigation.goBack()
    }
  }

  const handleSearch = (data, details) => {
    if (details?.geometry?.location) {
      const region = {
        latitude: details?.geometry?.location.lat,
        longitude: details?.geometry?.location?.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      handleChange('street', data.description)
      mapRef && mapRef?.current?.animateToRegion(region)
      handleChange('truckLocation', region)
    }
  }

  async function requestGeolocationPermission () {
    try {
      if (Platform.OS === 'ios') {
        getCurrentLocation()
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'World Carry Geolocation Permission',
          message: 'World Carry needs access to your current location.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation()
      } else {
        console.log('Geolocation permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const getCurrentLocation = async () => {
    // geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude)
        var long = parseFloat(position.coords.longitude)
        const region = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        handleChange('truckLocation', region)
        mapRef && mapRef?.current?.animateToRegion(region)
      },
      error => console.log('Error', JSON.stringify(error)),
      {
        enableHighAccuracy: Platform.OS === 'ios' ? false : true,
        timeout: 20000,
        maximumAge: 1000
      }
    )
    Geolocation.watchPosition(position => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)
      const region = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      setState(pre => ({ ...pre, initialRegion: region }))
      mapRef && mapRef?.current?.animateToRegion(region)
    })
  }

  const onMapPress = loc => {
    const coordinates = loc?.coordinate
    const location = {
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }
    handleChange('truckLocation', location)
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps={'handled'}
      contentContainerStyle={{ alignItems: 'center', height: '100%' }}
    >
      <View style={[styles.header, { height: isFocus ? '100%' : '13%' }]}>
        {isSearch ? (
          <View
            style={{
              flexDirection: 'row',
              // alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between'
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                width: '80%',
                marginVertical: 10,
                borderRadius: 10,
                backgroundColor: COLORS.backgroud
              }}
            >
              <View
                style={{
                  width: 50,
                  borderRightWidth: 1,
                  height: 22,
                  marginTop: 11
                }}
              >
                <SvgXml
                  xml={searchIcon}
                  fillOpacity={0.5}
                  width={20}
                  style={{
                    width: 50,
                    marginLeft: 10
                  }}
                />
              </View>
              <GooglePlacesAutocomplete
                placeholder={'Search...'}
                fetchDetails={true}
                onPress={(data, details) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(data, details)
                  handleSearch(data, details)
                }}
                textInputProps={{
                  placeholderTextColor: COLORS.placeholder,
                  value: street,
                  onFocus: () => handleChange('isFocus', true),
                  onBlur: () => handleChange('isFocus', false),
                  onChangeText: text => handleChange('street', text)
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
                filterReverseGeocodingByTypes={[
                  'locality',
                  'administrative_area_level_3'
                ]}
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
                    <Text
                      style={{ color: COLORS.black, fontFamily: FONT1REGULAR }}
                    >
                      {data.description}
                    </Text>
                  </View>
                )}
                debounce={200}
                currentLocation={false}
                currentLocationLabel='Current location'
                nearbyPlacesAPI='GooglePlacesSearch'
              />
            </View>
            <TouchableOpacity
              style={styles.homeOutline}
              onPress={() => {
                handleChange('isFocus', false)
                handleChange('isSearch', false)
              }}
            >
              <Text style={styles.homeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingTop: 10,
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  name='left'
                  type='antdesign'
                  color={COLORS.darkGrey}
                  size={18}
                  containerStyle={{ marginRight: 5, marginTop: 2 }}
                />
              </TouchableOpacity>
              <Text style={styles.title}>{'Choose Pickup Address'}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleChange('isSearch', true)}
              style={{
                width: 50,
                height: 22
              }}
            >
              <SvgXml
                xml={searchIcon}
                fillOpacity={0.5}
                width={20}
                style={{
                  width: 50,
                  marginLeft: 10
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {!isFocus && (
        <View style={styles.mainBody}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle={mapStyle}
            initialRegion={truckLocation}
            onPress={props => onMapPress(props.nativeEvent)}
            onRegionChange={() => console.log('')}
            ref={mapRef}
          >
            {truckLocation && (
              <Marker
                title={'My Location'}
                style={{ alignItems: 'center' }}
                // onPress={() => handleClickFood(truck)}
                coordinate={{
                  latitude: truckLocation?.latitude,
                  longitude: truckLocation?.longitude
                }}
              >
                <SvgXml xml={mapPin} />
              </Marker>
            )}
          </MapView>
        </View>
      )}
      <View style={{ bottom: 20, position: 'absolute', width: '90%' }}>
        <View style={{ width: '100%', alignItems: 'flex-end' }}>
          <TouchableOpacity style={[styles.pinButton, { marginBottom: 15 }]}>
            <SvgXml xml={compass} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pinButton}
            onPress={getCurrentLocation}
          >
            <SvgXml xml={currentLcoation} />
          </TouchableOpacity>
        </View>
        <AppButton
          title={'Done'}
          disabled={!truckLocation}
          onPress={handleNext}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  title: {
    color: COLORS.darkBlack,
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD
  },
  mainBody: {
    height: '87%',
    width: '100%',
    // zIndex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    overflow: 'hidden'
  },
  map: {
    height: '100%',
    width: '100%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  },
  header: {
    backgroundColor: COLORS.white,
    width: '100%',
    paddingLeft: '5%',
    paddingTop: hp(2)
  },
  homeOutline: {
    width: '20%',
    marginTop: 20
  },
  homeText: {
    fontFamily: FONT1LIGHT,
    color: COLORS.primary,
    fontSize: hp(2),
    marginLeft: 10
  },
  pinButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
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
  }
})

export default PickupLocation
