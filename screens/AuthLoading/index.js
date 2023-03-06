import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useContext, useEffect } from "react"
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { COLORS } from "../../constants"
import AppContext from "../../store/Context"

function AuthLoading({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const {
    setUser,
    _getProfile,
    _getOrders,
    _getJourneys,
    _getMyAddresses,
    _getNotification,
    _getByMeReviews,
    _getForMeReviews,
    _getMyJourneys,
    requestUserPermission
  } = context

  useEffect(() => {
    // _bootstrapAsync()
    navigation.addListener("focus", () => {
      _bootstrapAsync()
    })
  }, [])
  const _bootstrapAsync = async () => {
    const userUID = await AsyncStorage.getItem("token")
    const user = await AsyncStorage.getItem("user")
    if (userUID && user) {
      const userData = JSON.parse(user)
      setUser(userData)
      requestUserPermission(true)
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
