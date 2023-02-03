/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  BackHandler,
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native'
import { Icon, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import database from '@react-native-firebase/database'
import EmojiBoard from 'react-native-emoji-board'
import Toast from 'react-native-simple-toast'
import AppContext from '../../store/Context'
import { COLORS, FONT1REGULAR } from '../../constants'
import userProfile from '../../assets/images/userProfile.png'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import moment from 'moment'
import { SvgXml } from 'react-native-svg'
import Work from '../../assets/svg/tabs/Work.svg'
import sendIcon from '../../assets/svg/sendIcon.svg'
import smileIcon from '../../assets/svg/smileIcon.svg'
import ImagePicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'
import { getOrderDetails } from '../../api/order'
import EmojiPicker from 'react-native-emoji-picker-staltz'

function Chat ({ navigation, route }) {
  const orderID = route?.params?.orderID
  // Context
  const context = useContext(AppContext)
  const inputRef = useRef()
  const { user, _createNotification } = context
  const messageuid = orderID
  let scrollView
  const [state, setState] = useState({
    listHeight: 0,
    show: false,
    scrollViewHeight: 0,
    messages: [],
    messageText: '',
    messageData: null,
    uploading: false,
    orderData: null
  })

  const { orderData, show } = state

  const downButtonHandler = () => {
    if (scrollView !== null) {
      scrollView.scrollToEnd !== null &&
        scrollView.scrollToEnd({ animated: true })
    }
  }
  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )
    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    const db = database()
    if (user) {
      db.ref('Messages/' + messageuid).on('value', snapshot => {
        if (snapshot.val()) {
          if (snapshot.val().senderId === user?.id) {
            db.ref('Messages/' + messageuid)
              .update({ senderRead: 0 })
              .then(res => {
                db.ref('Messages/' + messageuid).once('value', snapshot => {
                  if (snapshot.val()) {
                    // getMessages()
                    setState(prevState => ({
                      ...prevState,
                      messages: snapshot.val()?.messages || [],
                      messageData: snapshot.val()
                    }))
                  }
                })
              })
          }
          if (snapshot.val().receiverId === user?.id) {
            db.ref('Messages/' + messageuid)
              .update({ receiverRead: 0 })
              .then(res => {
                db.ref('Messages/' + messageuid).once('value', snapshot => {
                  if (snapshot.val()) {
                    // getMessages()
                    setState(prevState => ({
                      ...prevState,
                      messages: snapshot.val().messages || [],
                      messageData: snapshot.val()
                    }))
                  }
                })
              })
          }
        }
      })
    }
  }, [user])

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  const onClickEmoji = emoji => {
    setState(prevState => ({
      ...prevState,
      messageText: prevState.messageText + emoji
    }))
  }
  useEffect(() => {
    if (scrollView !== null) {
      downButtonHandler()
    }
  })

  useEffect(() => {
    if (orderID) {
      _getOrderDetails()
    }
  }, [orderID])

  const _getOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getOrderDetails(orderID, token)
      handleChange('orderData', res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
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
      forceJpg: true
    })
      .then(async response => {
        if (!response.path) {
          handleChange('uploading', false)
        } else {
          const uri = response.path
          const filename = Date.now()
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri
          const task = storage()
            .ref('Chat/' + filename)
            .putFile(uploadUri)
          // set progress state
          task.on('state_changed', snapshot => {})
          try {
            const durl = await task
            task.snapshot.ref.getDownloadURL().then(downloadURL => {
              onSend(downloadURL, 'image')
            })
          } catch (e) {
            console.error(e)
          }
          handleChange('uploading', false)
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  function onlySpaces(str) {
    return /^\s*$/.test(str);
  }

  const onSend = (text, type) => {
    if(onlySpaces(text || state.messageText)){
      Toast.show('Please enter any character', Toast.LONG)
      return
    }
    const data = {
      text: text || state.messageText,
      timeStamp: Date.now(),
      type: type || 'text',
      senderId: user?.id
    }
    let messages = state.messages.concat(data)
    const values = {
      messages,
      senderRead:
        state?.messageData?.senderRead > 0
          ? Number(state.messageData.senderRead) + 1
          : 1,
      receiverRead:
        state?.messageData?.receiverRead > 0
          ? Number(state.messageData.receiverRead) + 1
          : 1
    }

    database()
      .ref('Messages/' + messageuid)
      .update(values)
      .then(res => {
        const payload = {
          name: user?.name,
          description: text || state.messageText,
          is_send_now: true,
          send_date: new Date(),
          user:
            state.messageData?.senderId === user?.id
              ? user?.id
              : state.messageData?.receiverId
        }
        _createNotification(payload)
        setState(prevState => ({
          ...prevState,
          loading: false,
          messageText: ''
        }))
        downButtonHandler()
      })
      .catch(err => {
        console.log(err)
        Toast.show('Something went wrong!', Toast.LONG)
      })
  }

  const _handleSend = (message, id) => {
    var data = {
      app_id: '15b1f37a-b123-45e3-a8c4-f0ef7e091130',
      android_channel_id: '97ad04d8-51d2-4739-8e83-0479a7e8cd60',
      headings: { en: user?.username ? user?.username : 'Guest User' },
      contents: { en: message },
      include_player_ids: [id]
    }
    // sendNotification(data)
    //   .then(res => {
    //     if (res.status == 200) {
    //       console.log('done')
    //     } else {
    //       alert(JSON.stringify(res))
    //     }
    //   })
    //   .catch(error => {
    //     Alert.alert('Error!', error)
    //   })
  }


  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: COLORS.backgroud
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          shadowColor: '#000',
          height: hp(8),
          paddingHorizontal: '5%',
          backgroundColor: COLORS.white,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          elevation: 1
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name='left'
            type='antdesign'
            color={COLORS.darkGrey}
            size={18}
          />
        </TouchableOpacity>
        <View
          style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 10 }}
        >
          <Image
            style={{ width: 40, height: 40, borderRadius: 50 }}
            source={
              user?.id === orderData?.user?.id
                ? orderData?.carrier?.profile?.photo
                  ? { uri: orderData?.carrier?.profile?.photo }
                  : userProfile
                : orderData?.user?.profile?.photo
                ? { uri: orderData?.user?.profile?.photo }
                : userProfile
            }
          />
          <Text
            style={{
              fontFamily: FONT1REGULAR,
              color: COLORS.darkBlack,
              fontSize: hp(2),
              marginLeft: 10
            }}
          >
            {user?.id === orderData?.user?.id
              ? orderData?.carrier?.name
              : orderData?.user?.name}
          </Text>
        </View>
      </View>
      <View style={{ width: '100%', alignItems: 'center', marginVertical: 10 }}>
        <View
          style={{
            maxWidth: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.borderColor1,
            backgroundColor: COLORS.white,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20
          }}
        >
          <SvgXml xml={Work} width={15} />
          <Text
            style={{
              color: COLORS.primary,
              marginLeft: 10,
              width:'60%',
              fontFamily: FONT1REGULAR,
              fontSize: hp(1.8)
            }}
          >
            {orderData?.product_name}
          </Text>
          <View
            style={{
              backgroundColor: COLORS.lightblue,
              paddingVertical: 3,
              paddingHorizontal: 10,
              borderRadius: 20,
              marginLeft: 10
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontFamily: FONT1REGULAR,
                fontSize: hp(1.8)
              }}
            >
              {orderData?.status}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1
          }}
          style={{
            width: '100%',
            height: '100%'
          }}
        >
          <FlatList
            data={state.messages}
            keyboardDismissMode='on-drag'
            onContentSizeChange={(contentWidth, contentHeight) => {
              setState(prevState => ({
                ...prevState,
                listHeight: contentHeight
              }))
            }}
            onLayout={e => {
              const height = e.nativeEvent.layout.height
              setState(prevState => ({
                ...prevState,
                scrollViewHeight: height
              }))
            }}
            style={{ width: '90%', flex: 1 }}
            contentContainerStyle={{
              alignItems: 'flex-start',
              justifyContent: 'flex-end'
            }}
            ref={ref => {
              scrollView = ref
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              if (item.senderId !== user?.id) {
                return (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      marginVertical: 10,
                      alignItems: 'flex-end'
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        paddingBottom: 10
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: 'rgba(93, 95, 239, 0.15)',
                          maxWidth: '75%',
                          borderRadius: 15,
                          borderTopRightRadius: 0,
                          padding: 15
                        }}
                      >
                        {item?.type === 'image' ? (
                          <Image
                            source={{ uri: item?.text }}
                            style={{
                              width: 200,
                              height: 200,
                              resizeMode: 'contain'
                            }}
                          />
                        ) : (
                          <Text
                            style={{
                              color: COLORS.darkBlack,
                              fontFamily: FONT1REGULAR,
                              fontSize: hp(1.8)
                            }}
                          >
                            {item?.text}
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          borderBottomWidth: 8,
                          borderTopColor: 'transparent',
                          borderTopWidth: 0,
                          borderBottomColor: 'transparent',
                          borderLeftWidth: 18,
                          borderLeftColor: 'rgba(93, 95, 239, 0.15)'
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: COLORS.darkGrey,
                        fontFamily: FONT1REGULAR,
                        fontSize: hp(1.5),
                        marginTop: -5,
                        marginRight: 20
                      }}
                    >
                      {moment(item?.timeStamp).fromNow()}
                    </Text>
                  </View>
                )
              } else {
                return (
                  <View
                    key={index}
                    style={{
                      width: '100%',
                      marginVertical: 10,
                      alignItems: 'flex-start'
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        paddingBottom: 10
                      }}
                    >
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          borderBottomWidth: 8,
                          borderTopColor: 'transparent',
                          borderTopWidth: 0,
                          borderBottomColor: 'transparent',
                          borderRightWidth: 18,
                          borderRightColor: '#FFE9D9'
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: '#FFE9D9',
                          maxWidth: '95%',
                          alignItems: 'flex-end',
                          borderRadius: 15,
                          borderTopLeftRadius: 0,
                          padding: 15
                        }}
                      >
                        {item?.type === 'image' ? (
                          <Image
                            source={{ uri: item?.text }}
                            style={{
                              width: 200,
                              height: 200,
                              resizeMode: 'contain'
                            }}
                          />
                        ) : (
                          <Text
                            style={{
                              color: COLORS.darkBlack,
                              fontFamily: FONT1REGULAR,
                              fontSize: hp(1.8)
                            }}
                          >
                            {item?.text}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text
                      style={{
                        color: COLORS.darkGrey,
                        fontFamily: FONT1REGULAR,
                        fontSize: hp(1.5),
                        marginTop: -5,
                        marginLeft: 20
                      }}
                    >
                      {moment(item?.timeStamp).fromNow()}
                    </Text>
                  </View>
                )
              }
            }}
          />
          {state.uploading && (
            <View
              style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}
            >
              <ActivityIndicator size={'small'} color={COLORS.primary} />
            </View>
          )}
          {/* <EmojiBoard showBoard={show} onClick={onClickEmoji} /> */}

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              height: 70,
              backgroundColor: COLORS.backgroud
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                width: '95%',
                height: 50,
                paddingRight: 3,
                paddingLeft: 10,
                borderWidth: 1,
                borderRadius: 30,
                borderColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  inputRef.current?.blur()
                  handleChange('show', !show)
                }}
              >
                <SvgXml xml={smileIcon} />
              </TouchableOpacity>
              <Input
                ref={inputRef}
                // keyboardType=''
                placeholderTextColor='rgba(36, 36, 36, 0.4)'
                inputStyle={{
                  fontSize: hp(2),
                  color: COLORS.darkGrey,
                  fontFamily: FONT1REGULAR,
                  marginLeft: 10
                }}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                  backgroundColor: COLORS.backgroud
                }}
                containerStyle={{ paddingLeft: 0, height: 40, width: '75%' }}
                onChangeText={message =>
                  setState(prevState => ({
                    ...prevState,
                    messageText: message
                  }))
                }
                onFocus={() => handleChange('show', false)}
                value={state.messageText}
                onSubmitEditing={() =>
                  state.messageText ? onSend() : console.log('')
                }
                blurOnSubmit={false}
                returnKeyType='send'
                placeholder={'Type your message'}
              />
              {/* <TouchableOpacity
              disabled={orderData?.status === 'Completed'}
              style={{
                marginRight: 5
              }}
              onPress={_uploadImage}
              >
              <SvgXml xml={insertIcon} />
            </TouchableOpacity> */}
              <TouchableOpacity
                disabled={orderData?.status === 'Completed'}
                style={{ opacity: orderData?.status === 'Completed' ? 0.4 : 1 }}
                onPress={() => {
                  state.messageText && orderData?.status !== 'Completed'
                    ? onSend()
                    : console.log('')
                }}
              >
                <SvgXml xml={sendIcon} height={40} />
              </TouchableOpacity>
            </View>
          </View>
          {show && (
            <EmojiPicker
              onEmojiSelected={onClickEmoji}
              rows={6}
              hideClearButton
              modalStyle={{ height: '50%' }}
              backgroundStyle={{ backgroundColor: '#fff', height: '50%' }}
              onPressOutside={() => handleChange('show', false)}
              containerStyle={{ height: '100%' }}
              localizedCategories={[
                // Always in this order:
                'Smileys and emotion',
                'People and body',
                'Animals and nature',
                'Food and drink',
                'Activities',
                'Travel and places',
                'Objects',
                'Symbols'
              ]}
            />
          )}
        </KeyboardAwareScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center'
  }
})

export default Chat
