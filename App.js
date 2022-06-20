import React, { useState } from 'react'
import 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { getProfile } from './api/auth'
import RootStackNav from './navigation/RootStackNav'
import AppContext from './store/Context'
import { NavigationContainer } from '@react-navigation/native'

function App () {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState('')

  const _getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const user = await AsyncStorage.getItem('user')
      const userData = JSON.parse(user)
      const res = await getProfile(userData?.id, token)
      console.warn('res?.data', res?.data)
      setUser(res?.data)
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
        setUserType
      }}
    >
      <NavigationContainer>
        <RootStackNav />
      </NavigationContainer>
    </AppContext.Provider>
  )
}
export default App
