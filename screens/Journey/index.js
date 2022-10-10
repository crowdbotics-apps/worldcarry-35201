import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import NoOrder from '../../assets/svg/NoOrder.svg'
import planIcon from '../../assets/svg/plan.svg'
import OngoingIcon from '../../assets/svg/Ongoing.svg'
import UpcomingIcon from '../../assets/svg/Upcoming.svg'
import menuJourney from '../../assets/svg/menuJourney.svg'
import usersIcon from '../../assets/images/users.png'
import { AppButton, Header } from '../../components'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import AppContext from '../../store/Context'
import moment from 'moment'
import momenttimezone from 'moment-timezone'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { deleteJourney } from '../../api/journey'

function Journey ({ navigation }) {
  const [state, setState] = useState({
    loading: false,
    active: 'Ongoing'
  })

  // Context
  const context = useContext(AppContext)
  const { active, loading } = state
  const { journeys, _getJourneys, _getMyJourneys, myjourneys } = context

  useEffect(() => {
    _getMyJourneys()
  }, [])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const tabs = [
    { title: 'Ongoing', value: '' },
    { title: 'Upcoming', value: 'upcoming' },
    { title: 'Completed' }
  ]

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
  const handleDelete = async id => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      await deleteJourney(id, token)
      _getJourneys('')
      _getMyJourneys()
      handleChange('loading', false)
      Toast.show('Journey Deleted Successfully!')
    } catch (error) {
      console.warn('error', error)
      handleChange('loading', false)
      console.warn('error?.response?.data', error?.response?.data)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
  }

  const getOrderType1 = status => {
    if (status) {
      const filtered = journeys?.filter(e => e?.status !== status)
      return filtered || []
    } else return []
  }

  const getOrderType = status => {
    console.warn('status', status)
    if (status === 'ongoing') {
      // const filtered = journeys?.filter(e => e.status === status)
      return myjourneys?.ongoing || []
    } else if (status === 'upcoming') {
      return myjourneys?.upcoming || []
    } else return myjourneys?.completed || []
  }

  console.warn('myJourneys', myjourneys?.upcoming)

  return (
    <View style={styles.container}>
      <Header
        title={'Journeys'}
        color={COLORS.darkBlack}
        rightItem={
          <AppButton
            width={hp(15)}
            height={hp(5)}
            marginTop={1}
            title={'+ Add'}
            onPress={() => navigation.navigate('CreateJourney')}
          />
        }
      />
      <View style={styles.tabs}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            onPress={() => {
              handleChange('active', tab?.title)
            }}
            key={index}
            style={active === tab.title ? styles.activeTab : styles.inavtive}
          >
            <Text
              style={
                active === tab.title ? styles.activeTabText : styles.tabText
              }
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading && <ActivityIndicator color={COLORS.primary} size={'small'} />}
      <FlatList
        data={getOrderType(active?.toLocaleLowerCase())}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', height: '100%' }}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}
          >
            <View style={styles.paper}>
              <View style={[styles.rowBetween, { width: '100%' }]}>
                <View
                  style={[
                    styles.ongoingBox,
                    {
                      backgroundColor:
                        item?.status === 'upcoming'
                          ? COLORS.upcoming
                          : COLORS.ongoing
                    }
                  ]}
                >
                  <SvgXml
                    xml={
                      item?.status === 'upcoming' ? UpcomingIcon : OngoingIcon
                    }
                    style={{ marginLeft: -10, marginTop: 8 }}
                  />
                  <Text
                    style={[
                      styles.nameText,
                      {
                        fontFamily: FONT1LIGHT,
                        fontSize: hp(1.8),
                        textTransform: 'capitalize'
                      }
                    ]}
                  >
                    {item?.status}
                  </Text>
                </View>
                {item?.status === 'upcoming' && (
                  <Menu
                    rendererProps={{
                      placement: 'bottom'
                    }}
                  >
                    <MenuTrigger>
                      <SvgXml xml={menuJourney} />
                    </MenuTrigger>
                    <MenuOptions
                      optionsContainerStyle={{
                        width: '30%'
                      }}
                    >
                      {['Delete'].map(el => (
                        <MenuOption
                          key={el}
                          onSelect={() => handleDelete(item?.id)}
                        >
                          <Text style={{ fontFamily: FONT1LIGHT }}>{el}</Text>
                        </MenuOption>
                      ))}
                    </MenuOptions>
                  </Menu>
                )}
              </View>
              <View style={[styles.row, { width: '90%' }]}>
                <Text
                  style={[
                    styles.nameText,
                    { color: COLORS.primary, maxWidth: '40%' }
                  ]}
                >
                  {item?.departure_country}
                </Text>
                <SvgXml xml={planIcon} style={{ marginTop: 5 }} />
                <Text
                  style={[
                    styles.nameText,
                    { color: COLORS.primary, maxWidth: '60%' }
                  ]}
                >
                  {item?.arrival_country}
                </Text>
              </View>
              <FlatList
                // style={{ width: '100%' }}
                data={item?.willing_to_carry}
                numColumns={2}
                renderItem={({ item: res, index }) => (
                  <View
                    key={index}
                    style={{
                      marginRight: 10,
                      paddingHorizontal: 8,
                      height: 30,
                      borderRadius: 50,
                      borderWidth: 1,
                      marginBottom: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: COLORS.grey
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONT1REGULAR,
                        fontSize: hp(1.8),
                        color: COLORS.black
                      }}
                    >
                      {res}
                    </Text>
                  </View>
                )}
              />
              <View style={styles.hline} />
              <View style={styles.rowBetween}>
                <Text style={[styles.postedText]}>Journey Date</Text>
                <Text style={styles.nameText}>
                  {moment(item?.date_of_journey).format('DD / MM / YYYY')}
                </Text>
              </View>
              <View style={[styles.rowBetween, { marginTop: 10 }]}>
                <Text style={[styles.postedText]}>Weight</Text>
                <Text style={styles.nameText}>{item?.total_weight}</Text>
              </View>
              <View style={styles.hline} />
              <View style={styles.rowBetween}>
                <Text style={[styles.postedText]}>To Deliver</Text>
                <Text style={styles.nameText}>
                  {moment(item?.date_of_return || item?.date_of_journey).format(
                    'DD / MM / YYYY'
                  )}
                </Text>
              </View>
              {/* <View style={[styles.rowBetween, { marginTop: 10 }]}>
                <Text style={[styles.postedText]}>Reward</Text>
                <Text style={styles.nameText}>{item?.total_weight}</Text>
              </View> */}
              {item?.status === 'upcoming' && (
                <AppButton
                  title={`View all ${item?.offers} offers`}
                  backgroundColor={COLORS.upcoming}
                  color={COLORS.upcomingDark}
                  onPress={() =>
                    navigation.navigate('JourneyDetails', { item })
                  }
                  prefix={
                    <Image source={usersIcon} style={{ marginRight: 10 }} />
                  }
                />
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <SvgXml xml={NoOrder} />
            <Text style={styles.timetext}>You don’t have new journey</Text>
            <AppButton
              title={'Create Journey'}
              onPress={() => navigation.navigate('CreateJourney')}
              width={150}
              color={COLORS.primary}
              backgroundColor={COLORS.lightblue}
            />
          </View>
        )}
      />
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
  hline: {
    width: '100%',
    height: 1,
    marginVertical: 10,
    backgroundColor: COLORS.tripBoxBorder
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ongoingBox: {
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  paper: {
    backgroundColor: COLORS.white,
    width: '90%',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  bgImage: {
    width: '100%',
    alignItems: 'center',
    height: 200,
    paddingTop: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
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
  headerText: {
    width: '80%',
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  imgStyle: {
    width: '100%',
    height: 200,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  viewAll: {
    textAlign: 'center',
    fontSize: hp(2),
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontFamily: FONT1REGULAR
  },
  timetext: {
    width: '40%',
    textAlign: 'center',
    fontSize: hp(2),
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR
  },
  pricetext: {
    width: '80%',
    fontSize: hp(2.8),
    color: COLORS.darkBlack,
    fontFamily: FONT1REGULAR
  },
  slide: {
    width: '90%',
    justifyContent: 'space-between',
    height: 220,
    borderRadius: 22
  },
  userProfile: {
    borderRadius: 50,
    height: 50,
    width: 50
  },
  tabs: {
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    height: hp(7),
    marginBottom: 20
  },
  tab: {
    width: '50%',
    alignItems: 'center'
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
  nameText: {
    color: COLORS.darkBlack,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  postedText: {
    color: COLORS.darkGrey,
    fontSize: hp(1.8),
    fontFamily: FONT1REGULAR
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
  },
  product_image: {
    width: '48%',
    marginTop: 10,
    marginBottom: 10,
    height: 130,
    borderRadius: 10,
    resizeMode: 'cover'
  }
})

export default Journey
