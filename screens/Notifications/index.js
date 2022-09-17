import React, { useCallback, useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { AppButton, Header } from '../../components'
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import { allNotificationRead, notificationRead } from '../../api/order'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import AppContext from '../../store/Context'
import NoNotification from '../../assets/svg/noNotification.svg'
import noti from '../../assets/images/noti.png'
import { SvgXml } from 'react-native-svg'
import { useFocusEffect } from '@react-navigation/native'
import moment from 'moment'
import momenttimezone from 'moment-timezone'

function Notifications ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { _getNotification, notifications, user } = context
  const [state, setState] = useState({
    loading: false,
    active: 0
  })

  useFocusEffect(
    useCallback(() => {
      _getNotification(`?user=${user?.id}`)
    }, [])
  )
  const handleRead = async id => {
    try {
      const token = await AsyncStorage.getItem('token')
      handleChange('loading', true)

      const formData = `?id=${id}`
      await notificationRead(formData, token)
      handleChange('loading', false)
      Toast.show('Notification Opened!')
      _getNotification(`?user=${user?.id}`)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        Toast.show(`Error: ${errorText[0]}`)
      } else {
        Toast.show(`Error: ${error}`)
      }
    }
  }

  const handleAllRead = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      handleChange('loading', true)

      await allNotificationRead(token)
      handleChange('loading', false)
      Toast.show('All Notification Opened!')
      _getNotification(`?user=${user?.id}`)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      if (errorText.length > 0) {
        Toast.show(`Error: ${errorText[0]}`)
      } else {
        Toast.show(`Error: ${error}`)
      }
    }
  }

  const { loading, active } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const getUnreadCount = () => {
    const filtered = notifications?.filter(e => !e?.is_read)
    return filtered || []
  }

  function convertLocalDateToUTCDate (time, toLocal) {
    const todayDate = moment(new Date()).format('YYYY-MM-DD')
    if (toLocal) {
      const today = momenttimezone.tz.guess()
      const timeUTC = momenttimezone.tz(time, today).format()
      let date = new Date(timeUTC)
      const milliseconds = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
      const localTime = new Date(milliseconds)
      const todayDate1 = momenttimezone.tz(localTime, today).fromNow()
      return todayDate1
    } else {
      const today = momenttimezone.tz.guess()
      const todayDate1 = momenttimezone
        .tz(`${todayDate} ${time}`, today)
        .format()
      const utcTime = moment.utc(todayDate1).format('YYYY-MM-DDTHH:mm')
      return utcTime
    }
  }

  console.warn('notifications', notifications)
  return (
    <View style={styles.container}>
      <Header back title={'Notifications'} color={COLORS.darkBlack} />
      <View style={styles.mainBody}>
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
            }}
            style={active === 0 ? styles.activeTab : styles.inavtive}
          >
            <Text style={active === 0 ? styles.activeTabText : styles.tabText}>
              All ({notifications?.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChange('active', 1)
            }}
            style={active === 1 ? styles.activeTab : styles.inavtive}
          >
            <Text style={active === 1 ? styles.activeTabText : styles.tabText}>
              Unread ({getUnreadCount()?.length})
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={active === 1 ? getUnreadCount() : notifications}
          style={{ width: '100%', height: '80%' }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  !item?.is_read ? handleRead(item?.id) : console.log('')
                }
                style={[
                  styles.header,
                  {
                    backgroundColor: !item?.is_read
                      ? COLORS.primaryLight
                      : COLORS.white
                  }
                ]}
              >
                <View style={styles.imageView}>
                  <Image source={noti} style={styles.image} />
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.name}>{item?.description}</Text>
                  <Text style={styles.description}>
                    {convertLocalDateToUTCDate(item?.created_at, true)}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
          ListEmptyComponent={() => (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <SvgXml xml={NoNotification} />
              <Text style={styles.timetext}>You covered all notifications</Text>
            </View>
          )}
        />
      </View>
    </View>
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

export default Notifications
