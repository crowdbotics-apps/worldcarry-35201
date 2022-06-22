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
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import { allNotificationRead, notificationRead } from '../../api/order'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import AppContext from '../../store/Context'

function Notifications ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { _getNotification, notifications } = context
  const [state, setState] = useState({
    loading: false
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

  const { loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  return (
    <View style={styles.container}>
      <Header
        back
      />
      <View style={styles.mainBody}>
        <Text style={styles.headingText}>Notifications</Text>
        <TouchableOpacity
          style={{ width: '100%', marginTop: 30 }}
          onPress={handleAllRead}
        >
          <Text style={styles.leftText}>Mark all notifications as read</Text>
        </TouchableOpacity>
        <FlatList
          data={notifications}
          style={{ width: '100%', marginTop: 20 }}
          renderItem={({ item, index }) => {
            return (
              <View
                key={index}
                style={[
                  styles.header,
                  {
                    backgroundColor:
                      index % 2 == 0 ? COLORS.listBG : COLORS.backgroud
                  }
                ]}
              >
                <View style={styles.imageView}>
                  <Text style={styles.name}>{'item?.mom?.name'}</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.description}>{'item?.title'}</Text>
                  <View style={styles.row}>
                    <View style={styles.buttonWidth}>
                      <AppButton
                        onPress={() => handleRead(item?.id)}
                        title={'Mark as read'}
                        height={hp(5)}
                        fontSize={hp(1.8)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  mainBody: {
    width: wp('90%'),
    alignItems: 'center'
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
    marginBottom: 20
  },
  imageView: {
    width: '20%',
    alignItems: 'center'
  },
  rightView: {
    width: '80%',
    alignItems: 'center'
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
    color: COLORS.navy,
    fontSize: hp(2),
    textAlign: 'center',
    fontFamily: FONT1BOLD
  },
  description: {
    color: COLORS.navy,
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
  }
})

export default Notifications
