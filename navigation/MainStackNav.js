import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Splash from '../screens/Splash'
import LoginScreen from '../screens/LoginScreen'
import ForgotPassword from '../screens/ForgotPassword'
import Signup from '../screens/Signup'
import Onboard from '../screens/Signup/Onboard'
import GettingStarted from '../screens/GettingStarted'
import SetPasswrod from '../screens/ForgotPassword/SetPassword'
import AuthLoading from '../screens/AuthLoading'
import MainTabNav from './MainTabNav'
import EditPassword from '../screens/Profile/EditPassword'
import Account from '../screens/Profile/Account'
import Notifications from '../screens/Notifications'
import OTP from '../screens/ForgotPassword/OTP'
import CreateOrder from '../screens/Order/CreateOrder'
import PickupLocation from '../screens/Order/PickupLocation'
import ArrivalLocation from '../screens/Order/ArrivalLocation'
import CreateJourney from '../screens/Journey/CreateJourney'
import JourneyDetails from '../screens/Journey/Details'
import OrderDetails from '../screens/Order/Details'

const Stack = createStackNavigator()
function MainStackNav () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name='Splash' component={Splash} />
      <Stack.Screen name='GettingStarted' component={GettingStarted} />
      <Stack.Screen name='Onboard' component={Onboard} />
      <Stack.Screen name='Notifications' component={Notifications} />
      <Stack.Screen name='OTP' component={OTP} />
      <Stack.Screen name='SetPasswrod' component={SetPasswrod} />
      <Stack.Screen name='EditPassword' component={EditPassword} />
      <Stack.Screen name='Account' component={Account} />
      <Stack.Screen name='AuthLoading' component={AuthLoading} />
      <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='Signup' component={Signup} />
      <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
      <Stack.Screen name='PickupLocation' component={PickupLocation} />
      <Stack.Screen name='ArrivalLocation' component={ArrivalLocation} />
      <Stack.Screen name='MainTabNav' component={MainTabNav} />
      <Stack.Screen name='CreateOrder' component={CreateOrder} />
      <Stack.Screen name='CreateJourney' component={CreateJourney} />
      <Stack.Screen name='JourneyDetails' component={JourneyDetails} />
      <Stack.Screen name='OrderDetails' component={OrderDetails} />
    </Stack.Navigator>
  )
}

export default MainStackNav
