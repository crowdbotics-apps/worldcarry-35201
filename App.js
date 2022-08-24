import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { getProfile } from './api/auth'
import RootStackNav from './navigation/RootStackNav'
import AppContext from './store/Context'
import { NavigationContainer } from '@react-navigation/native'
import { MenuProvider } from 'react-native-popup-menu'
import { getNotification, getOrders } from './api/order'
import { getJourneys, getMyAddresses } from './api/journey'
import messaging from '@react-native-firebase/messaging'
import { Alert } from 'react-native'
import { StripeProvider } from '@stripe/stripe-react-native'

function App () {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState('')
  const [mapLocationForPickup, setMapLocationForPickup] = useState(null)
  const [mapLocationForArrival, setMapLocationForArrival] = useState(null)
  const [orders, setOrders] = useState([])
  const [journeys, setJourneys] = useState([])
  const [myAddresses, setMyAddresses] = useState([])
  const [notifications, setNotifications] = useState([])

  const _getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const user = await AsyncStorage.getItem('user')
      const userData = JSON.parse(user)
      const res = await getProfile(userData?.id, token)
      console.warn('getProfile', res?.data)
      setUser(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getNotification = async qs => {
    try {
      const token = await AsyncStorage.getItem('token')
      const payload = qs || ''
      const res = await getNotification(payload, token)
      console.warn('getNotification', res?.data)
      setNotifications(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getOrders = async payload => {
    try {
      const token = await AsyncStorage.getItem('token')
      const qs = payload || ``
      const res = await getOrders(qs, token)
      setOrders(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }
  const _getJourneys = async payload => {
    try {
      const token = await AsyncStorage.getItem('token')
      const qs = payload || ''
      const res = await getJourneys(qs, token)
      setJourneys(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getMyAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getMyAddresses(token)
      setMyAddresses(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  useEffect(() => {
    requestUserPermission()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage)
    })

    return unsubscribe
  }, [])

  async function registerAppWithFCM () {
    const registered = await messaging().registerDeviceForRemoteMessages()
  }

  async function requestUserPermission () {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.warn('Authorization status:', authStatus)
      registerAppWithFCM()
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        _getProfile,
        userType,
        setUserType,
        mapLocationForPickup,
        setMapLocationForPickup,
        mapLocationForArrival,
        setMapLocationForArrival,
        _getOrders,
        orders,
        journeys,
        _getJourneys,
        myAddresses,
        _getMyAddresses,
        notifications,
        _getNotification
      }}
    >
      <StripeProvider
        publishableKey='pk_test_51KZK9jLztvigKU7K5CptuvUpCXeDccpRZ14y9cR5wWl7neG8aj84s6IUl1hRzhOjKrpLit46ZEczBzZnSWqOyJGB00hdoLxDvv'
        merchantIdentifier='merchant.com.worldcarry_35201'
      >
        <NavigationContainer>
          <MenuProvider>
            <RootStackNav />
          </MenuProvider>
        </NavigationContainer>
      </StripeProvider>
    </AppContext.Provider>
  )
}
export default App
