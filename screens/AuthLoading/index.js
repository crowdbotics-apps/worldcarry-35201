import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useContext, useEffect } from "react"
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { COLORS } from "../../constants"
import AppContext from "../../store/Context"
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import PushNotification, { Importance } from "react-native-push-notification"
import messaging from "@react-native-firebase/messaging"
import { registerDevice } from "../../api/order"
import { Platform } from "react-native"

function AuthLoading({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const {
    user,
    setUser,
    _getProfile,
    _getOrders,
    _getJourneys,
    _getMyAddresses,
    _getNotification,
    _getByMeReviews,
    _getForMeReviews,
    _getMyJourneys
    // requestUserPermission
  } = context

  useEffect(() => {
    // _bootstrapAsync()
    navigation.addListener("focus", () => {
      _bootstrapAsync()
    })
  }, [])

  async function requestUserPermission(active, userData) {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      registerAppWithFCM(active, userData)
      setOnMessage()
    }
  }

  async function registerAppWithFCM(active, user) {
    await messaging().deleteToken()
    const token = await messaging().getToken()
    const tokenA = await AsyncStorage.getItem("token")
    await messaging().registerDeviceForRemoteMessages()
    const payload = {
      name: user?.name,
      registration_id: token,
      device_id: token,
      active: active,
      type: Platform.OS
    }
    console.warn("payload", payload)
    await registerDevice(payload, tokenA)
  }

  const setOnMessage = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.warn("onMessage", remoteMessage)
      var localNotification = {
        id: 0, // (optional) Valid unique 32 bit integer specified as string.
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body, // (required)
        data: remoteMessage.data
      }

      Platform.OS == "android" &&
        (localNotification = {
          ...localNotification,
          priority: "high",
          playSound: true,
          vibrate: true,
          vibration: 300,
          priority: "high",
          channelId: "com.worldcarry_35201" // (required) channelId, if the channel doesn't exist, notification will not trigger.
        })
      PushNotification.localNotification(localNotification)
      PushNotification.configure({
        onRegister: function (token) {
          console.log("TOKEN:", token)
        },
        onNotification: function (notification) {
          console.warn("onNotification", notification)
          const { data, title } = notification
          handleNotification(title, remoteMessage.data)
          notification.finish(PushNotificationIOS.FetchResult.NoData)
        },
        onRegistrationError: function (err) {
          console.error(err.message, err)
        },
        senderID: "487049617739",
        permissions: {
          alert: true,
          badge: true,
          sound: true
        },
        popInitialNotification: true,
        requestPermissions: true
      })

      PushNotification.popInitialNotification(notification => {
        console.warn("Initial Notification", notification)
      })
      PushNotification.getChannels(function (channel_ids) {
        console.log("channel_ids", channel_ids) // ['channel_id_1']
      })
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.warn("onNotificationOpenedApp", remoteMessage)
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage
      )
      handleNotification(remoteMessage.notification.title, remoteMessage.data)
    })

    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          setTimeout(() => {
            if (remoteMessage?.notification?.title) {
              handleNotification(
                remoteMessage.notification.title,
                remoteMessage.data
              )
            }
          }, 1000)
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage
          )
        }
      })
      .catch(error => console.log("failed", error))
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log("Message handled in the background!", remoteMessage)
    })
  }

  const handleNotification = (title, data) => {
    console.warn("data", data)
    if (data?.type === "order_accepted_request") {
      navigation.navigate("Orders", {
        object_id: data?.object_id,
        type: data?.type
      })
    }
    if (data?.type === "order_delivery") {
      navigation.navigate("Orders", {
        object_id: data?.object_id,
        type: data?.type
      })
    }
    if (data?.type === "journey_request") {
      navigation.navigate("OrderDetails", {
        item: { id: data?.object_id }
      })
    }
    if (data?.type === "order_request") {
      navigation.navigate("JourneyDetails", {
        item: { id: data?.object_id },
        type: data?.type
      })
    }
  }

  const _bootstrapAsync = async () => {
    const userUID = await AsyncStorage.getItem("token")
    const user = await AsyncStorage.getItem("user")
    if (userUID && user) {
      const userData = JSON.parse(user)
      setUser(userData)
      requestUserPermission(true, userData)
      _getProfile()
      _getNotification(`?user=${userData?.id}`)
      _getOrders(`?user=${userData?.id}`)
      _getOrders(`?user=${userData?.id}&status=Received`, true)
      _getJourneys("")
      _getMyJourneys("")
      _getMyAddresses()
      _getByMeReviews(userData?.id)
      _getForMeReviews(userData?.id)
      // if(userData?.)
      navigation.navigate("MainTabNav")
    } else {
      navigation.navigate("GettingStarted")
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default AuthLoading
