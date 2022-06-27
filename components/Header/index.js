import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, FONT1BOLD, FONT1SEMIBOLD } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Udderly from '../../assets/svg/udderly.svg'
import profileIcon from '../../assets/svg/profileIcon.svg'
import notificationIcon from '../../assets/svg/notification.svg'
import { SvgXml } from 'react-native-svg'

export default function Header ({
  title,
  back,
  logo,
  rightItem,
  rightEmpty,
  profile,
  notification,
  backPress
}) {
  const navigation = useNavigation()

  return (
    <View
      style={[
        styles.header,
        {
          width: rightItem || profile ? '100%' : '90%',
          paddingHorizontal: '5%',
          alignItems: profile ? 'flex-end' : 'center'
        }
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {profile && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.profile}
          >
            <SvgXml xml={profileIcon} height={60} />
          </TouchableOpacity>
        )}
        {back && (
          <TouchableOpacity
            onPress={() => (backPress ? backPress() : navigation.goBack())}
          >
            <Icon
              name='left'
              type='antdesign'
              color={COLORS.darkGrey}
              size={18}
              containerStyle={{ marginRight: 5 ,marginTop:2}}
            />
          </TouchableOpacity>
        )}
        {logo && <SvgXml xml={Udderly} height={60} />}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      {rightEmpty && <View style={{ width: 50 }} />}
      {rightItem && rightItem}
      {notification && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.login}
        >
          <SvgXml xml={notificationIcon} height={60} />
        </TouchableOpacity>
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
    elevation: 5
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
