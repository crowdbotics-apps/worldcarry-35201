import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { COLORS, FONT1MEDIUM, FONT1REGULAR, PROFILEICON } from '../../constants'
import { Header } from '../../components'
import AppContext from '../../store/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SvgXml } from 'react-native-svg'
import cameraIcon from '../../assets/svg/cameraIcon.svg'
import editSetting from '../../assets/svg/editSetting.svg'
import mailSetting from '../../assets/svg/mailSetting.svg'
import passwordSetting from '../../assets/svg/passwordSetting.svg'
import paymentSetting from '../../assets/svg/paymentSetting.svg'
import notiSetting from '../../assets/svg/notiSetting.svg'
import languageSetting from '../../assets/svg/languageSetting.svg'
import logoutSetting from '../../assets/svg/logoutSetting.svg'
import profileSetting from '../../assets/svg/profileSetting.svg'
import { Icon, Switch } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import { updateProfile } from '../../api/auth'
import Toast from 'react-native-simple-toast'

function Settings ({ navigation }) {
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

  const [state, setState] = useState({
    avatarSourceURL: '',
    loading: false,
    isNotification: user?.profile?.send_notification || false
  })

  const { avatarSourceURL, isNotification } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  const _uploadImage = async type => {
    handleChange('uploading', true)
    let OpenImagePicker =
      type == 'camera'
        ? ImagePicker.openCamera
        : type == ''
        ? ImagePicker.openPicker
        : ImagePicker.openPicker

    OpenImagePicker({
      width: 300,
      height: 300,
      cropping: true
    })
      .then(async response => {
        if (!response.path) {
          handleChange('uploading', false)
        } else {
          console.warn('response', response)
          const uri = response.path
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri
          const photo = {
            uri: uploadUri,
            name: 'userimage1.png',
            type: response.mime
          }
          handleChange('avatarSourceURL', uploadUri)
          handleProfile(photo)
          handleChange('uploading', false)
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  const handleProfile = async (photo, notification, notificationValue) => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const user_id = user?.id
      const formData = new FormData()
      if (photo) {
        formData.append('profile.photo', photo)
      }
      if (notification) {
        formData.append('profile.send_notification', notificationValue)
      }
      const res = await updateProfile(formData, user_id, token)
      if (res?.status === 200) {
        context?.setUser(res?.data)
        await AsyncStorage.setItem('user', JSON.stringify(res?.data))
        handleChange('loading', false)
        Toast.show(notification?'Notification Setting Update Successfully':'Profile Picture Update Successfully')
      } else {
        handleChange('loading', false)
        Toast.show('Something went wrong!')
      }
    } catch (error) {
      handleChange('loading', false)
      console.warn('err', error)
      const showWError = Object.values(error.response?.data)
      Toast.show(`Error: ${showWError[0]}`)
    }
  }
  console.warn('user', user)

  const list1 = [
    {
      title: 'Edit Name',
      right: user?.name,
      icon: profileSetting,
      route: 'EditUsername'
    },
    {
      title: 'Edit Number',
      icon: editSetting,
      right: user?.phone,
      route: 'EditNumber'
    },
    {
      title: 'Change Mail ID',
      icon: mailSetting,
      right: user?.email,
      route: 'EditMail'
    },
    {
      title: 'Change Password',
      icon: passwordSetting,
      right: '',
      route: 'ChangeCurrentPassword'
    },
    {
      title: 'Edit Payment Method',
      icon: paymentSetting,
      right: '',
      route: 'PaymentMethod'
    }
  ]
  const list2 = [
    {
      title: 'Notifications',
      right: '',
      switch: true,
      icon: notiSetting
    },
    // {
    //   title: 'Language',
    //   icon: languageSetting,
    //   right: 'English'
    // },
    {
      title: 'Logout',
      logout: true,
      icon: logoutSetting,
      right: ''
    }
  ]

  return (
    <View style={styles.container}>
      <Header title={'Settings'} back color={COLORS.darkBlack} />
      <ScrollView
        style={styles.mainBody}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <View style={styles.profileHead}>
          <TouchableOpacity
            onPress={_uploadImage}
            style={{
              width: '90%',
              marginTop: 20,
              alignItems: 'center'
            }}
          >
            <Image
              source={{
                uri: user?.profile?.photo || avatarSourceURL || PROFILEICON
              }}
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
            <SvgXml
              xml={cameraIcon}
              style={{ marginTop: -30, marginRight: -50 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <Text style={styles.head}>Profile</Text>
          {list1.map((item, index) => (
            <TouchableOpacity
              onPress={() => item?.route && navigation.navigate(item?.route)}
              key={index}
              style={styles.listView}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <SvgXml xml={item.icon} />
                <Text
                  style={[
                    styles.name,
                    {
                      marginLeft: 10,
                      fontSize: hp(2),
                      color: COLORS.darkBlack
                    }
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text style={styles.rightText}>
                  {item.right?.slice(0, 15) +
                    (item.right?.length > 15 ? '...' : '')}
                </Text>
                <Icon
                  name='right'
                  type='antdesign'
                  color={COLORS.darkGrey}
                  size={12}
                />
              </View>
            </TouchableOpacity>
          ))}
          <Text style={styles.head}>preference</Text>
          {list2.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                item.logout
                  ? logout()
                  : item?.route
                  ? navigation.navigate(item?.route)
                  : alert('Coming Soon')
              }
              key={index}
              style={styles.listView}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '80%'
                }}
              >
                <SvgXml xml={item.icon} />
                <Text
                  style={[
                    styles.name,
                    {
                      marginLeft: 10,
                      fontSize: hp(2),
                      color: COLORS.darkBlack
                    }
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text style={styles.rightText}>
                  {item.right?.slice(0, 15) +
                    (item.right?.length > 15 ? '...' : '')}
                </Text>
                {item?.switch && (
                  <Switch
                    value={user?.profile?.send_notification}
                    onChange={() =>
                      handleProfile(
                        false,
                        true,
                        !user?.profile?.send_notification
                      )
                    }
                  />
                )}
                {!item?.switch && !item?.logout && (
                  <Icon
                    name='right'
                    type='antdesign'
                    color={COLORS.darkGrey}
                    size={12}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: wp('100%'),
    height: '100%',
    alignItems: 'center'
  },
  header: {
    width: '90%'
  },
  rightText: {
    marginRight: 5,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(1.8),
    color: COLORS.grey
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor1,
    height: 50,
    backgroundColor: COLORS.white
  },
  profileHead: {
    height: 150,
    backgroundColor: COLORS.white,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2
  },
  mainBody: {
    width: '100%'
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
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.2)
  },
  price: {
    color: COLORS.white,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.2)
  },
  current: {
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2)
  },
  head: {
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    textTransform: 'uppercase',
    width: '90%',
    marginVertical: 10
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
  address: {
    fontFamily: FONT1REGULAR,
    color: COLORS.grey,
    fontSize: hp(1.8),
    marginLeft: 5
  }
})

export default Settings
