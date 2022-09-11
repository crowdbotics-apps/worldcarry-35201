import React, { useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native'
import { COLORS, FONT1BOLD, FONT1LIGHT, FONT1SEMIBOLD } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import shareIcon from '../../assets/svg/share.svg'
import logoutIcon from '../../assets/svg/logout.svg'
import notificationIcon from '../../assets/svg/notification.svg'
import menuIcon from '../../assets/svg/menuJourney.svg'
import help from '../../assets/svg/profileIcon.svg'
import feedback from '../../assets/svg/feedback.svg'
import settingsIcon from '../../assets/svg/settingsIcon.svg'
import { SvgXml } from 'react-native-svg'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import AppContext from '../../store/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function Header ({
  title,
  back,
  logo,
  rightItem,
  rightEmpty,
  profile,
  notification,
  backPress,
  backgroundColor,
  color,
  menu,
  cross
}) {
  const navigation = useNavigation()
  // Context
  const context = useContext(AppContext)
  const setUser = context?.setUser
  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
    navigation.navigate('AuthLoading')
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React'
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const menuSetting = [
    { title: 'Settings', image: settingsIcon, route: 'Settings' },
    { title: 'Share With Friends', image: shareIcon },
    { title: 'Help & Support', image: help, route: 'FAQ' },
    { title: 'Feedback', image: feedback, route: 'FeedBack' },
    { title: 'Logout', image: logoutIcon, route: '' }
  ]

  return (
    <View
      style={[
        styles.header,
        {
          width: '100%',
          paddingHorizontal: '5%',
          alignItems: 'center',
          backgroundColor: backgroundColor || COLORS.white
        }
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {back && (
          <TouchableOpacity
            onPress={() => (backPress ? backPress() : navigation.goBack())}
          >
            <Icon
              name='left'
              type='antdesign'
              color={color || COLORS.darkGrey}
              size={18}
              containerStyle={{ marginRight: 5, marginTop: 2 }}
            />
          </TouchableOpacity>
        )}
        {cross && (
          <TouchableOpacity
            onPress={() => (backPress ? backPress() : navigation.goBack())}
          >
            <Icon
              name='close'
              type='antdesign'
              color={color || COLORS.darkGrey}
              size={18}
              containerStyle={{ marginRight: 5, marginTop: 2 }}
            />
          </TouchableOpacity>
        )}
        {title && (
          <Text style={[styles.title, { color: color || COLORS.darkGrey }]}>
            {title}
          </Text>
        )}
      </View>
      {rightEmpty && <View style={{ width: 50 }} />}
      {rightItem && rightItem}
      {notification && (
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <SvgXml xml={notificationIcon} height={60} />
        </TouchableOpacity>
      )}
      {menu && (
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <SvgXml xml={menuIcon} height={60} />
        </TouchableOpacity>
      )}
      {profile && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => navigation.navigate('Notifications')}
          >
            <SvgXml xml={notificationIcon} height={60} />
          </TouchableOpacity>
          <Menu
            rendererProps={{
              placement: 'bottom'
            }}
          >
            <MenuTrigger>
              <SvgXml xml={menuIcon} />
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                width: '50%',
                backgroundColor: COLORS.menuBG
              }}
            >
              {menuSetting.map(el => (
                <MenuOption
                  key={el}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 2
                  }}
                  onSelect={() =>
                    el.title === 'Share With Friends'
                      ? onShare()
                      : el.title === 'Logout'
                      ? logout()
                      : el.route
                      ? navigation.navigate(el.route)
                      : alert('Coming Soon')
                  }
                >
                  <SvgXml xml={el.image} />
                  <Text
                    style={{
                      fontFamily: FONT1SEMIBOLD,
                      color: COLORS.white,
                      marginLeft: 10
                    }}
                  >
                    {el.title}
                  </Text>
                </MenuOption>
              ))}
            </MenuOptions>
          </Menu>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: hp(9),
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3
  },
  menuView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 45
  },
  title: {
    color: COLORS.darkGrey,
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD
  },
  backText: {
    color: COLORS.inputBorder,
    fontFamily: FONT1BOLD
  },
  login: {
    backgroundColor: COLORS.white,
    width: 90,
    height: 65,
    borderTopLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100
  },
  profile: {
    backgroundColor: COLORS.white,
    width: 60,
    height: 65,
    borderTopLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 50
  }
})
