import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import { AppButton, AppInput, Header } from '../../components'
import { SvgXml } from 'react-native-svg'
import attachment from '../../assets/svg/attachment.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ImagePicker from 'react-native-image-crop-picker'
import Toast from 'react-native-simple-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { postFeedback } from '../../api/auth'

function FeedBack ({ navigation, route }) {
  // Context
  const [state, setState] = useState({
    questions: [],
    avatarSourceURL: [],
    message: '',
    email: '',
    name: '',
    file: [],
    loading: false
  })
  const {
    questions,
    loading,
    avatarSourceURL,
    message,
    email,
    name,
    file
  } = state
  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  const _postFeedback = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const payload = new FormData()
      payload.append('name', name)
      payload.append('email', email)
      payload.append('message', message)
      file && file.map((fil, index) => payload.append('file', fil))
      const res = await postFeedback(payload, token)
      handleChange('loading', false)
      Toast.show(`Feedback has been submitted`)
      navigation.goBack()
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
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
      cropping: true,
      multiple: true,
      forceJpg: true
    })
      .then(async response => {
        if (!response.length) {
          handleChange('uploading', false)
        } else {
          const photos = []
          const avatarSourceURLs = []
          for (let i = 0; i < response.length; i++) {
            const element = response[i]
            const uri = element.path
            const uploadUri =
              Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            const photo = {
              uri: uploadUri,
              name: `userimage${i}.png`,
              type: element.mime
            }
            photos.push(photo)
            avatarSourceURLs.push(uploadUri)
          }
          handleChange('avatarSourceURL', avatarSourceURLs)
          handleChange('file', photos)
          handleChange('uploading', false)

          Toast.show('Attachment Add Successfully')
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Header back color={COLORS.darkBlack} title={'Feedback'} />
        <View style={{ width: '90%', marginTop: 20, marginBottom: 15 }}>
          <AppInput
            placeholder={'Your Name'}
            inputLabel={'Your Name'}
            borderColor={COLORS.borderColor1}
            backgroundColor={COLORS.white}
            value={name}
            name={'name'}
            onChange={handleChange}
          />
        </View>
        <View style={{ width: '90%', marginTop: 10, marginBottom: 15 }}>
          <AppInput
            placeholder={'Enter email'}
            inputLabel={'Email'}
            backgroundColor={COLORS.white}
            borderColor={COLORS.borderColor1}
            value={email}
            name={'email'}
            onChange={handleChange}
          />
        </View>
        <View style={{ width: '90%', marginTop: 10, marginBottom: 15 }}>
          <AppInput
            placeholder={'Write here'}
            multiline
            height={100}
            inputLabel={'How can we help you?'}
            backgroundColor={COLORS.white}
            borderColor={COLORS.borderColor1}
            value={message}
            name={'message'}
            onChange={handleChange}
          />
        </View>
        <FlatList
          data={avatarSourceURL}
          numColumns={2}
          scrollEnabled={false}
          style={{ width: '90%', marginTop: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item, index }) => {
            return (
              <Image
                key={index}
                source={{ uri: item?.image || item }}
                style={styles.profileIcon}
              />
            )
          }}
        />
        <View style={{ width: '90%' }}>
          <TouchableOpacity style={styles.attachmentBox} onPress={_uploadImage}>
            <SvgXml
              xml={attachment}
              width={hp(2.5)}
              style={{ marginRight: 10 }}
            />
            <Text
              style={[styles.text, { color: COLORS.primary, fontSize: hp(2) }]}
            >
              Attachments (if any)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ width: '90%', marginBottom: 20 }}>
        <AppButton
          title={'Submit'}
          loading={loading}
          disabled={!name || !email || !message}
          onPress={_postFeedback}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    height: '100%'
  },
  top: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  backContainer: { width: '40%', alignItems: 'flex-start', marginRight: 10 },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    width: '90%',
    alignItems: 'center'
  },
  attachmentBox: {
    width: '60%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  loginText: {
    color: COLORS.darkGrey,
    fontSize: hp('3%'),
    fontFamily: FONT1REGULAR
  },
  heading: {
    color: COLORS.primary,
    fontSize: hp('3%'),
    fontFamily: FONT1BOLD
  },
  heading1: {
    color: COLORS.darkBlack,
    fontSize: hp(2.2),
    fontFamily: FONT1REGULAR,
    marginTop: 20,
    marginBottom: 10
  },
  text: {
    color: COLORS.darkGrey,
    fontSize: hp(2.2),
    fontFamily: FONT1REGULAR
  },
  body: {
    width: '90%'
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.tripBoxBorder,
    paddingHorizontal: '5%'
  },
  content: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: '5%'
  },
  headerText: {
    width: '80%',
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    color: COLORS.darkBlack
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
  profileIcon: {
    width: '48%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover'
  }
})

export default FeedBack
