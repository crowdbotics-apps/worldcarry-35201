import React, { useCallback, useContext, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { Icon } from 'react-native-elements'
import { COLORS, FONT1BOLD, PROFILEICON } from '../../constants'
import { AppButton, AppInput } from '../../components'
import { updateProfile } from '../../api/auth'
import Toast from 'react-native-simple-toast'
import AppContext from '../../store/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import ImagePicker from 'react-native-image-crop-picker'

function Account ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { user } = context

  // State
  const [state, setState] = useState({
    email: '',
    name: '',
    username: '',
    phone: '',
    avatarSourceURL: '',
    photo: null,
    loading: false
  })

  const {
    loading,
    email,
    name,
    username,
    phone,
    avatarSourceURL,
    photo
  } = state

  useFocusEffect(
    useCallback(() => {
      if (user) {
        if (user?.type === 'Business') {
          handleChange('name', user?.business?.name)
          handleChange('username', user?.username)
          handleChange('phone', user?.phone)
          handleChange('avatarSourceURL', user?.business?.photo)
        } else {
          handleChange('email', user?.email)
          handleChange('phone', user?.phone)
          handleChange('avatarSourceURL', user?.customer?.photo)
          handleChange('username', user?.username)
        }
      }
    }, [user])
  )

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
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
      cropping: true,
      forceJpg: true
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
          handleChange('photo', photo)
          handleChange('uploading', false)
          Toast.show('Profile Add Successfully')
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  const handleProfile = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const user_id = user?.id
      const formData = new FormData()
      if (photo) {
        formData.append(
          user?.type === 'Business' ? 'business.photo' : 'customer.photo',
          photo
        )
      }
      if (user?.type === 'Business') {
        formData.append('business.name', name)
      } else {
        formData.append('email', email)
      }
      formData.append('phone', phone)
      formData.append('username', username)
      const res = await updateProfile(formData, user_id, token)
      console.warn('else res', res)
      if (res?.status === 200) {
        context?.setUser(res?.data)
        await AsyncStorage.setItem('user', JSON.stringify(res?.data))
        handleChange('loading', false)
        Toast.show(`Your profile has been updated!`)
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

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.header}>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={goBack}>
              <Icon name='arrow-back' type='material' />
            </TouchableOpacity>
          </View>
          <Text style={styles.loginText}>Edit Account</Text>
        </View>
        <TouchableOpacity
          onPress={_uploadImage}
          style={user?.type === 'Business' ? styles.businessProfileIcon : {}}
        >
          <Image
            source={{ uri: avatarSourceURL ? avatarSourceURL : PROFILEICON }}
            style={
              user?.type === 'Business'
                ? styles.businessProfileIcon
                : styles.profileIcon
            }
          />
        </TouchableOpacity>
        <View style={styles.textInputContainer}>
          {user?.type === 'Business' ? (
            <AppInput
              label={'Food Truck Name'}
              placeholder={'Food Truck Name'}
              name={'name'}
              value={name}
              prefixBGTransparent
              onChange={handleChange}
            />
          ) : (
            <AppInput
              label={'Email address'}
              placeholder={'Email address'}
              name={'email'}
              value={email}
              prefixBGTransparent
              onChange={handleChange}
            />
          )}
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            label={'Phone number'}
            placeholder={'Phone number'}
            name={'phone'}
            value={phone}
            keyboardType={'phone-pad'}
            prefixBGTransparent
            onChange={handleChange}
          />
        </View>
        <View style={styles.textInputContainer}>
          <AppInput
            label={'Username'}
            placeholder={'Username'}
            name={'username'}
            value={username}
            prefixBGTransparent
            onChange={handleChange}
          />
        </View>
      </View>
      <View style={styles.buttonWidth}>
        <AppButton
          title={'Save'}
          loading={loading}
          disabled={
            (user?.type === 'Business' ? !name : !email) || !phone || !username
          }
          onPress={handleProfile}
        />
        <AppButton
          title={'Cancel'}
          backgroundColor={COLORS.white}
          color={COLORS.black}
          onPress={goBack}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    backgroundColor: COLORS.white,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  top: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  backContainer: { width: '25%', alignItems: 'flex-start', marginRight: 10 },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    width: '90%',
    alignItems: 'center'
  },
  buttonWidth: { width: '90%', marginBottom: 20 },
  textInputContainer: { marginBottom: hp('2%'), width: '90%' },
  loginText: {
    color: COLORS.darkGrey,
    fontSize: hp('3%'),
    fontFamily: FONT1BOLD
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 100,
    resizeMode: 'cover',
    marginBottom: 40
  },
  businessProfileIcon: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 40
  }
})

export default Account
