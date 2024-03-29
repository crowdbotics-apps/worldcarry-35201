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
import Settings from '../screens/Profile/Settings'
import PaymentMethod from '../screens/Profile/PaymentMethod'
import AddPaymentMethod from '../screens/Profile/AddPaymentMethod'
import MyPaymentMethod from '../screens/Profile/MyPaymentMethod'
import EmailVerification from '../screens/Profile/EmailVerification'
import EmailVerificationOTP from '../screens/Profile/EmailVerificationOTP'
import PhoneVerification from '../screens/Profile/PhoneVerification'
import PhoneVerificationOTP from '../screens/Profile/PhoneVerificationOTP'
import PassportVerification from '../screens/Profile/PassportVerification'
import FAQ from '../screens/Profile/FAQ'
import Support from '../screens/Profile/Support'
import FeedBack from '../screens/Profile/FeedBack'
import ChangePassword from '../screens/ForgotPassword/ChangePassword'
import AddAddress from '../screens/Profile/AddAddress'
import ScanQR from '../screens/Journey/ScanQR'
import JourneyOrderDetails from '../screens/Journey/JourneyOrderDetails'
import Chat from '../screens/Chat'
import EditUsername from '../screens/Profile/EditUsername'
import EditNumber from '../screens/Profile/EditNumber'
import EditMail from '../screens/Profile/EditMail'
import ChangeCurrentPassword from '../screens/Profile/ChangeCurrentPassword'

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
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen name='PaymentMethod' component={PaymentMethod} />
      <Stack.Screen name='AddPaymentMethod' component={AddPaymentMethod} />
      <Stack.Screen name='MyPaymentMethod' component={MyPaymentMethod} />
      <Stack.Screen name='EmailVerification' component={EmailVerification} />
      <Stack.Screen name='EmailVerificationOTP' component={EmailVerificationOTP} />
      <Stack.Screen name='PhoneVerification' component={PhoneVerification} />
      <Stack.Screen name='PhoneVerificationOTP' component={PhoneVerificationOTP} />
      <Stack.Screen name='PassportVerification' component={PassportVerification} />
      <Stack.Screen name='FAQ' component={FAQ} />
      <Stack.Screen name='Support' component={Support} />
      <Stack.Screen name='FeedBack' component={FeedBack} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} />
      <Stack.Screen name='AddAddress' component={AddAddress} />
      <Stack.Screen name='ScanQR' component={ScanQR} />
      <Stack.Screen name='JourneyOrderDetails' component={JourneyOrderDetails} />
      <Stack.Screen name='Chat' component={Chat} />
      <Stack.Screen name='EditUsername' component={EditUsername} />
      <Stack.Screen name='EditNumber' component={EditNumber} />
      <Stack.Screen name='EditMail' component={EditMail} />
      <Stack.Screen name='ChangeCurrentPassword' component={ChangeCurrentPassword} />
    </Stack.Navigator>
  )
}

export default MainStackNav
