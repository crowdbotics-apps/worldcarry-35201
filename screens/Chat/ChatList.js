/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import { Icon } from 'react-native-elements'
import { Header } from '../../components'
import moment from 'moment'
import { fireBase } from '../../utils/firebase'
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import AppContext from '../../store/Context'
import menuJourney from '../../assets/svg/menuJourney.svg'
import { SvgXml } from 'react-native-svg'
import database from '@react-native-firebase/database'
import Work from '../../assets/svg/tabs/Work.svg'
import singleCheck from '../../assets/svg/singleCheck.svg'
import doubleCheck from '../../assets/svg/doubleCheck.svg'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

function Message ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { user } = context
  const [state, setState] = useState({
    loading: false,
    List: [],
    allList: [],
    unread: [],
    active: 0
  })

  const { loading, allList,unread, List, active } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getMessages()
    })
    navigation.addListener('blur', () => {
      handleChange('List', [])
      handleChange('allList', [])
    })
  }, [])

  const snapshotToArray = snapshot =>
    Object.entries(snapshot).map(e => Object.assign(e[1], { uid: e[0] }))

  const getMessages = async () => {
    try {
      database()
        .ref(`Messages`)
        .on('value', snapshot => {
          if (snapshot.val()) {
            const messages = snapshotToArray(snapshot.val())
            console.warn('messages', messages)
            handleChange('allList', messages)
            unreadList(messages)
            handleChange('List', messages)
          } else {
          }
        })
    } catch (error) {
      console.warn('err', error)
    }
  }

  const unreadList = messages => {
    const unread = messages?.filter(
      item =>
        (item?.receiverId === user?.id && item?.receiverRead > 0) ||
        (item?.senderId === user?.id && item?.senderRead > 0)
    )
    handleChange('unread', unread)
  }

  const sortByDate = data => {
    return data?.sort(function (a, b) {
      return (
        new Date(
          b?.messages && b?.messages?.length > 0
            ? b?.messages[b?.messages?.length - 1]?.timeStamp
            : b?.timeStamp
        ) -
        new Date(
          a?.messages && a?.messages?.length > 0
            ? a?.messages[a?.messages?.length - 1]?.timeStamp
            : a?.timeStamp
        )
      )
    })
  }

  const sortByUser = data => {
    return data?.filter(
      item => item?.senderId === user?.id || item?.receiverId === user?.id
    )
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.primary
        }}
      >
        <ActivityIndicator size='large' color={COLORS.primary} />
      </View>
    )
  }

  return (
    <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
      <Header
        title={'Messages'}
        color={COLORS.darkBlack}
        rightItem={<SvgXml xml={menuJourney} />}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
          width: '90%'
        }}
      >
        <TouchableOpacity
          onPress={() => {
            handleChange('active', 0)
            handleChange('List', allList)
          }}
          style={active === 0 ? styles.activeTab : styles.inavtive}
        >
          <Text style={active === 0 ? styles.activeTabText : styles.tabText}>
            All ({sortByUser(sortByDate(allList))?.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChange('active', 1)
            handleChange('List', unread)
          }}
          style={active === 1 ? styles.activeTab : styles.inavtive}
        >
          <Text style={active === 1 ? styles.activeTabText : styles.tabText}>
            Unread ({unread.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleChange('active', 2)
            handleChange('List', [])
          }}
          style={active === 2 ? styles.activeTab : styles.inavtive}
        >
          <Text style={active === 2 ? styles.activeTabText : styles.tabText}>
            Archived
          </Text>
        </TouchableOpacity>
      </View>
      <MessagesList user={user} data={List} navigation={navigation} />
    </View>
  )
}

function MessagesList ({ data, navigation, user }) {
  const sortByDate = data => {
    return data?.sort(function (a, b) {
      return (
        new Date(
          b?.messages && b?.messages?.length > 0
            ? b?.messages[b?.messages?.length - 1]?.timeStamp
            : b?.timeStamp
        ) -
        new Date(
          a?.messages && a?.messages?.length > 0
            ? a?.messages[a?.messages?.length - 1]?.timeStamp
            : a?.timeStamp
        )
      )
    })
  }

  const sortByUser = data => {
    return data?.filter(
      item => item?.senderId === user?.id || item?.receiverId === user?.id
    )
  }

  return (
    <FlatList
      data={sortByUser(sortByDate(data))}
      numColumns={1}
      style={{ width: '100%' }}
      noIndent={true}
      keyExtractor={item => item?.timeStamp}
      ListEmptyComponent={() => (
        <View
          style={{
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              marginTop: 20,
              fontFamily: FONT1BOLD,
              color: COLORS.darkBlack
            }}
          >
            You have no messages
          </Text>
        </View>
      )}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor:
                (item?.receiverId === user?.id && item?.receiverRead > 0) ||
                (item?.senderId === user?.id && item?.senderRead > 0)
                  ? COLORS.white
                  : COLORS.backgroud,
              shadowColor: COLORS.darkBlack,
              shadowOffset: {
                width: 0,
                height: 1
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              alignItems: 'flex-start',
              elevation: 1,
              width: '100%',
              padding: 10
            }}
            onPress={() => navigation.navigate('Chat', { orderID: item?.id })}
          >
            <View
              style={{
                maxWidth: '90%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: COLORS.borderColor1,
                backgroundColor: COLORS.white,
                paddingHorizontal: 15,
                paddingVertical: 3,
                borderRadius: 20
              }}
            >
              <SvgXml xml={Work} width={15} />
              <Text
                style={{
                  color: COLORS.primary,
                  marginLeft: 10,
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(1.8)
                }}
              >
                {item?.itemtitle?.toString()}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ height: 50, width: 50, marginBottom: 5 }}>
                <Image
                  style={{ width: '100%', height: '100%', borderRadius: 50 }}
                  resizeMode='cover'
                  source={{
                    uri:
                      item?.senderId === user?.id
                        ? item?.receiver?.profile?.photo
                        : item?.sender?.profile?.photo
                  }}
                />
              </View>
              <View style={{ marginLeft: 10, width: '80%' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}
                >
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text>
                      {item?.senderId === user?.id
                        ? item?.receiver?.name
                        : item?.sender?.name}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    {(item?.receiverId === user?.id && item?.senderRead > 0) ||
                    (item?.senderId === user?.id && item?.receiverRead > 0) ? (
                      <SvgXml xml={singleCheck} />
                    ) : (
                      <>
                        {item?.messages?.length > 0 ? (
                          <SvgXml xml={doubleCheck} />
                        ) : (
                          <View />
                        )}
                      </>
                      // <View
                      //   style={{
                      //     width: 20,
                      //     height: 20,
                      //     backgroundColor: '#05445E',
                      //     borderRadius: 20,
                      //     alignItems: 'center',
                      //     justifyContent: 'center'
                      //   }}
                      // >
                      //   <Text style={{ fontSize: 10, color: '#fff' }}>
                      //     {item?.senderId === user?.id
                      //       ? item?.senderRead
                      //       : item?.receiverRead}
                      //   </Text>
                      // </View>
                    )}
                  </View>
                </View>
                <Text style={{ color: 'grey', width: '90%', marginTop: 0 }}>
                  {item?.messages &&
                  item?.messages?.length > 0 &&
                  item?.messages[item?.messages?.length - 1]?.text?.length > 40
                    ? item?.messages[item?.messages?.length - 1]?.text?.slice(
                        0,
                        40
                      ) + ' ....'
                    : item?.messages?.length > 0 &&
                      item?.messages[item?.messages?.length - 1]?.text}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  mainBody: {
    width: '100%',
    alignItems: 'center'
  },
  timetext: {
    width: '40%',
    textAlign: 'center',
    fontSize: hp(2),
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR
  },
  headingText: {
    color: COLORS.secondary,
    width: '90%',
    textAlign: 'center',
    fontSize: hp(3),
    fontFamily: FONT1BOLD
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: '5%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor1,
    paddingVertical: 15
  },
  imageView: {
    width: '20%'
  },
  rightView: {
    width: '80%'
  },
  row: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  image: {
    width: 50,
    height: 50
  },
  leftText: {
    color: COLORS.navy,
    fontSize: hp(2),
    width: '100%',
    fontFamily: FONT1BOLD
  },
  name: {
    color: COLORS.darkBlack,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  description: {
    color: COLORS.grey,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    width: '80%'
  },
  buttonWidth: {
    width: '40%',
    marginRight: 10
  },
  profile: {
    backgroundColor: COLORS.white,
    width: 60,
    height: 65,
    borderTopLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 50
  },
  activeTab: {
    backgroundColor: COLORS.lightblue,
    borderRadius: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  tabText: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  inavtive: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center'
  },
  active: {
    borderWidth: 0,
    marginRight: 5,
    backgroundColor: COLORS.white,
    width: 10,
    height: 10,
    borderRadius: 10
  }
})

export default Message
