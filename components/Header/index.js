import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, FONT1BOLD } from '../../constants'
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
  rightImage,
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
          width: rightImage || profile ? '100%' : '90%',
          paddingLeft: rightImage ? '5%' : 0,
          alignItems: rightImage
            ? 'flex-start'
            : profile
            ? 'flex-end'
            : 'center'
        }
      ]}
    >
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
          style={{ marginTop: rightImage ? 30 : 0 }}
          onPress={() => (backPress ? backPress() : navigation.goBack())}
        >
          <Icon name='arrow-back' type='material' color={COLORS.inputBorder} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
      {logo && <SvgXml xml={Udderly} height={60} />}
      {title && <Text style={styles.title}>{title}</Text>}
      {rightEmpty && <View style={{ width: 50 }} />}
      {rightImage && rightImage}
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
    flexDirection: 'row'
  },
  menuView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 45
  },
  title: {
    color: COLORS.darkGrey,
    fontSize: hp('3%'),
    marginLeft: 20,
    fontFamily: FONT1BOLD
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
