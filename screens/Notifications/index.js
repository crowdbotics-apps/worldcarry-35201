import React, { useContext, useState } from 'react'
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

function Notifications ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { _getNotification, notifications } = context
  const [state, setState] = useState({
    loading: false,
    active: 0
  })
  const handleRead = async notification => {
    try {
      const token = await AsyncStorage.getItem('token')
      handleChange('loading', true)

      const formData = {
        notification
      }
      await notificationRead(formData, token)
      handleChange('loading', false)
      Toast.show('Notification Opened!')
      _getNotification()
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
      _getNotification()
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

  return (
    <View style={styles.container}>
      <Header back title={'Notifications'} color={COLORS.darkBlack} />
      <View style={styles.mainBody}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
            width:'90%'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              handleChange('active', 0)
            }}
            style={active === 0 ? styles.activeTab : styles.inavtive}
          >
            <Text style={active === 0 ? styles.activeTabText : styles.tabText}>
              All (6)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChange('active', 1)
            }}
            style={active === 1 ? styles.activeTab : styles.inavtive}
          >
            <Text style={active === 1 ? styles.activeTabText : styles.tabText}>
              Unread (2)
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={['notifications','notifications']}
          style={{ width: '100%' }}
          renderItem={({ item, index }) => {
            return (
              <View
                key={index}
                style={[
                  styles.header,
                  {
                    backgroundColor:
                      index == 0 ? COLORS.primaryLight : COLORS.white
                  }
                ]}
              >
                <View style={styles.imageView}>
                  <Image source={noti} style={styles.image} />
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.name}>
                    {'Reward successfully delivered to Cody Fisher.'}
                  </Text>
                  <Text style={styles.description}>{'2 min ago'}</Text>
                </View>
              </View>
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
