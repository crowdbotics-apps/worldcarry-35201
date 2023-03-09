import React, { useEffect, useState } from "react"
import "react-native-gesture-handler"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-simple-toast"
import { getMyReviews, getProfile } from "./api/auth"
import RootStackNav from "./navigation/RootStackNav"
import AppContext from "./store/Context"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { MenuProvider } from "react-native-popup-menu"
import {
  createNotification,
  getNotification,
  getOrders,
  registerDevice
} from "./api/order"
import { getJourneys, getMyAddresses, getMyJourneys } from "./api/journey"
import messaging from "@react-native-firebase/messaging"
import { Alert, Platform, SafeAreaView } from "react-native"
import { StripeProvider } from "@stripe/stripe-react-native"
import { getDeviceId } from "react-native-device-info"
import PushNotification, { Importance } from "react-native-push-notification"

function App() {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState("")
  const [mapLocationForPickup, setMapLocationForPickup] = useState(null)
  const [mapLocationForArrival, setMapLocationForArrival] = useState(null)
  const [orders, setOrders] = useState([])
  const [journeys, setJourneys] = useState([])
  const [myjourneys, setMyJourneys] = useState([])
  const [myAddresses, setMyAddresses] = useState([])
  const [forMeReviews, setForMeReviews] = useState([])
  const [byMeReviews, setByMeReviews] = useState([])
  const [notifications, setNotifications] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])

  const _getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const user = await AsyncStorage.getItem("user")
      const userData = JSON.parse(user)
      const res = await getProfile(userData?.id, token)
      setUser(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getNotification = async qs => {
    try {
      const token = await AsyncStorage.getItem("token")
      const payload = qs || ""
      const res = await getNotification(payload, token)
      setNotifications(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getOrders = async (payload, completed) => {
    try {
      const token = await AsyncStorage.getItem("token")
      const qs = payload || ``
      const res = await getOrders(qs, token)
      if (completed) {
        setCompletedOrders(res?.data)
      } else {
        setOrders(res?.data)
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }
  const _getJourneys = async payload => {
    try {
      const token = await AsyncStorage.getItem("token")
      const qs = payload || ""
      const res = await getJourneys(qs, token)
      setJourneys(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getMyJourneys = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const res = await getMyJourneys(token)
      setMyJourneys(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getMyAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const res = await getMyAddresses(token)
      setMyAddresses(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getForMeReviews = async id => {
    try {
      const token = await AsyncStorage.getItem("token")
      const payload = `?target_user=${id}`
      const res = await getMyReviews(payload, token)
      setForMeReviews(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getByMeReviews = async id => {
    try {
      const token = await AsyncStorage.getItem("token")
      const payload = `?added_by=${id}`
      const res = await getMyReviews(payload, token)
      setByMeReviews(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _createNotification = async payload => {
    try {
      const token = await AsyncStorage.getItem("token")
      const res = await createNotification(payload, token)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  
  

  
  useEffect(() => {
    // requestUserPermission()
    PushNotification.createChannel({
      channelId: "com.worldcarry_35201",
      channelName: "com.worldcarry_35201",
      importance: Importance.HIGH
    })
  }, [])

 

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
        _getNotification,
        _getByMeReviews,
        _getForMeReviews,
        forMeReviews,
        byMeReviews,
        _createNotification,
        completedOrders,
        _getMyJourneys,
        myjourneys
      }}
    >
      <StripeProvider
        publishableKey="pk_test_51LaIRSLRdM0d7A3Koho53E3XIgxxlEY9YARYPa1fQHH08d9JWRTMaQ28NbBnKGKav470rhSuqegPyUg1kDIDl6AC00x4JQSwzv"
        merchantIdentifier="merchant.com.worldcarry_35201"
      >
        <NavigationContainer>
          <MenuProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <RootStackNav />
            </SafeAreaView>
          </MenuProvider>
        </NavigationContainer>
      </StripeProvider>
    </AppContext.Provider>
  )
}
export default App
