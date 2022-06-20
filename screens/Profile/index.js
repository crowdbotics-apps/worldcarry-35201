import React, { useContext } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { COLORS, FONT1REGULAR, PROFILEICON } from '../../constants'
import { AppButton, Header } from '../../components'
import AppContext from '../../store/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SvgXml } from 'react-native-svg'
import AccountIcon from '../../assets/svg/account.svg'
import WalletIcon from '../../assets/svg/wallet.svg'
import SubscriptionIcon from '../../assets/svg/subscription.svg'
import TermsIcon from '../../assets/svg/terms.svg'
import PrivacyIcon from '../../assets/svg/privacy.svg'

function Profile ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const setUser = context?.setUser
  const user = context?.user
  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
    navigation.navigate('AuthLoading')
  }

  const list = [
    { title: 'Account', icon: AccountIcon, route: 'Account' },
    // { title: 'Wallet', icon: WalletIcon, route: 'Profile' },
    { title: 'Password', icon: TermsIcon, route: 'EditPassword' },
    { title: 'Terms & Conditions', icon: TermsIcon, route: 'TermsCondition' },
    { title: 'Privacy policy', icon: PrivacyIcon, route: 'PrivacyPolicy' }
  ]

  const listFoodTruck = [
    { title: 'Account', icon: AccountIcon, route: 'Account' },
    // { title: 'Subscription', icon: SubscriptionIcon, route: 'Subscription' },
    // { title: 'Wallet', icon: WalletIcon, route: 'Wallets' },
    { title: 'Password', icon: TermsIcon, route: 'EditPassword' },
    { title: 'Terms & Conditions', icon: TermsIcon, route: 'TermsCondition' },
    { title: 'Privacy policy', icon: PrivacyIcon, route: 'PrivacyPolicy' },
    { title: 'Help', icon: PrivacyIcon, route: 'Help' }
  ]

  const mapList = user?.type === 'Business' ? listFoodTruck : list
  return (
    <View style={styles.container}>
      {/* <Header title={'Profile'} rightEmpty /> */}
      <View style={styles.body}>
        <AppButton
          title={'Logout'}
          outlined
          borderColor={COLORS.black}
          color={COLORS.logout}
          backgroundColor={COLORS.white}
          onPress={logout}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: wp('100%'),
    height: '100%',
    alignItems: 'center'
  },
  header: {
    width: '90%'
  },
  top: { width: '100%' },
  body: {
    width: '90%',
    height: '85%',
    marginTop: 20,
    justifyContent: 'space-between'
  },
  name: {
    color: COLORS.darkBlack,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.2),
    marginLeft: 10
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    resizeMode: 'cover'
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  title: {
    marginLeft: 10,
    fontFamily: FONT1REGULAR,
    color: COLORS.modalBG
  }
})

export default Profile
