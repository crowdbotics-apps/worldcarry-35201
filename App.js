import React, { useState } from 'react'
import 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { getProfile } from './api/auth'
import RootStackNav from './navigation/RootStackNav'
import AppContext from './store/Context'
import { NavigationContainer } from '@react-navigation/native'
import { MenuProvider } from 'react-native-popup-menu'
import { getOrders } from './api/order'
import { getJourneys, getMyAddresses } from './api/journey'

function App () {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState('')
  const [mapLocationForPickup, setMapLocationForPickup] = useState(null)
  const [mapLocationForArrival, setMapLocationForArrival] = useState(null)
  const [orders, setOrders] = useState([])
  const [journeys, setJourneys] = useState([])
  const [myAddresses, setMyAddresses] = useState([])

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

  const _getOrders = async payload => {
    try {
      const token = await AsyncStorage.getItem('token')
      const qs = payload || ''
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
        _getMyAddresses
      }}
    >
      <NavigationContainer>
        <MenuProvider>
          <RootStackNav />
        </MenuProvider>
      </NavigationContainer>
    </AppContext.Provider>
  )
}
export default App
