import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  FlatList
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { Header } from '../../components'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import Geolocation from '@react-native-community/geolocation'
import AppContext from '../../store/Context'
import { updateProfile } from '../../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
let LATITUDE_DELTA = 0.0922
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

function Home ({ navigation }) {
  var mapRef = useRef(null)
  const [state, setState] = useState({
    loading: false,
    truckLocation: null,
    openTip: false,
    openMap: false,
    isList: false,
    isBuyer: true
  })

  // Context
  const context = useContext(AppContext)
  const { loading, isBuyer, isList, openTip, openMap, truckLocation } = state
  const { user, milkRequest, _getProfile } = context

  useEffect(() => {
    requestGeolocationPermission()
    getCurrentLocation()
  }, [])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  async function requestGeolocationPermission () {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'FoodTruck Geolocation Permission',
          message: 'FoodTruck needs access to your current location.'
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
        handleProfile(lat, long)
        mapRef && mapRef?.current?.animateToRegion(region)
      },
      error => console.log('Error', JSON.stringify(error))
      // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
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

  const handleProfile = async (lat, lng) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const id = user?.id
      const formData = new FormData()
      const location = {
        type: 'Point',
        coordinates: [lat, lng]
      }
      formData.append('location', JSON.stringify(location))
      await updateProfile(formData, id, token)
      _getProfile()
    } catch (error) {
      console.warn('err', error)
      Toast.show(`Error: ${error.message}`)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: '100%',
    height: '100%'
  },
  row: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20
  },
  zoomText: {
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.5),
    color: COLORS.navy
  },
  mapView: {
    width: '90%',
    height: 200,
    borderRadius: 30,
    marginTop: 20,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
    overflow: 'hidden'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  mainBody: {
    width: '90%',
    marginBottom: 20,
    alignItems: 'center'
  },
  filterView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20
  },
  buttonWidth: {
    width: '60%'
  },
  tipText: {
    fontFamily: FONT1BOLD,
    fontSize: hp(2.5),
    color: COLORS.navy,
    marginTop: 20
  },
  filterText: {
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.5),
    color: COLORS.navy,
    marginLeft: 10
  },
  filteredText: {
    fontFamily: FONT1BOLD,
    fontSize: hp(3),
    color: COLORS.secondary
  }
})

export default Home
