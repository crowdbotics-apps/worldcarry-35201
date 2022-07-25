import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
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
import enRoute from '../../assets/svg/enRoute.svg'
import userProfile from '../../assets/images/userProfile.png'
import { AppButton, Header } from '../../components'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import AppContext from '../../store/Context'
import moment from 'moment'
import momenttimezone from 'moment-timezone'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { getJourneyDetails } from '../../api/journey'
import { getOnrouteOrders } from '../../api/order'

function JourneyDetails ({ navigation, route }) {
  const item = route?.params?.item
  const [state, setState] = useState({
    loading: false,
    active: 'Offers',
    onRouteOrders: [],
    journeyData: null
  })

  // Context
  const context = useContext(AppContext)
  const { onRouteOrders, loading, journeyData, active } = state
  const { journeys } = context

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const tabs = [
    { title: 'Offers' },
    { title: 'Accepted' },
    { title: 'In Transit' },
    { title: 'Delivered' }
  ]

  useEffect(() => {
    if (item) {
      const id = `?journey_id=${item?.id}`
      _getOnrouteOrders(id)
      _getJourneyDetails()
    }
  }, [item])

  const _getOnrouteOrders = async payload => {
    try {
      const token = await AsyncStorage.getItem('token')
      const qs = payload || ''
      const res = await getOnrouteOrders(qs, token)
      handleChange('onRouteOrders', res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getJourneyDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getJourneyDetails(item?.id, token)
      handleChange('journeyData', res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
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

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} size={'large'} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header title={'Journeys'} rightEmpty back />
      <View
        style={{
          backgroundColor: COLORS.blueBG,
          width: '90%',
          padding: 10,
          marginVertical: 20,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        }}
      >
        <View style={[styles.row, { width: '90%' }]}>
          <Text style={[styles.coutryText, { maxWidth: '40%' }]}>
            {journeyData?.departure_country}
          </Text>
          <SvgXml xml={planIcon} style={{ marginTop: 5 }} />
          <Text style={[styles.coutryText, { maxWidth: '60%' }]}>
            {journeyData?.arrival_country}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.leftText}>Status</Text>
          <Text style={styles.rightText}>{journeyData?.status}</Text>
        </View>
        <View style={[styles.rowBetween, { marginVertical: 10 }]}>
          <Text style={styles.leftText}>Journey Date</Text>
          <Text style={styles.rightText}>
            {moment(journeyData?.date_of_journey).format('DD / MM / YYYY')}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.leftText}>Carry a weight of</Text>
          <Text style={styles.rightText}>{journeyData?.total_weight}Kg</Text>
        </View>
        <View style={[styles.rowBetween, { alignItems: 'flex-start' }]}>
          <Text style={[styles.leftText, { marginTop: 8 }]}>
            Willing to carry
          </Text>
          <View style={{ maxWidth: '60%' }}>
            {journeyData?.willing_to_carry?.map(res => (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  marginBottom: 5,
                  marginTop: 5,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: COLORS.white
                }}
              >
                <Text style={styles.rightText}>{res}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <ScrollView
        style={styles.tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
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
              {tab.title === 'Offers' ? onRouteOrders?.length : 0} {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={onRouteOrders}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', height: '100%' }}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}
          >
            <View style={styles.paper}>
              <View style={[styles.rowBetween, { width: '100%' }]}>
                <View style={styles.row}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      marginRight: 10
                    }}
                    source={
                      item?.user?.profile?.photo
                        ? { uri: item?.user?.profile?.photo }
                        : userProfile
                    }
                  />
                  <View>
                    <Text style={styles.nameText}>{item?.user?.name}</Text>
                    <Text style={styles.postedText}>
                      Posted {convertLocalDateToUTCDate(item?.created_at, true)}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.nameText, { fontSize: hp(2.4) }]}>
                    ${item?.carrier_reward}
                  </Text>
                  <Text style={styles.postedText}>Reward</Text>
                </View>
              </View>
              <View style={styles.hline} />

              <Text
                style={[styles.nameText, { fontSize: hp(2.5), width: '90%' }]}
              >
                {item?.product_name}
              </Text>
              <Text style={styles.postedText}>
                Deliver Before :{' '}
                {moment(item?.deliver_before_date).format('DD / MM / YYYY')}
              </Text>
              <View style={styles.rowBetween}>
                {item?.images?.length > 0 && (
                  <Image
                    source={{ uri: item?.images[0]?.image }}
                    style={styles.product_image}
                  />
                )}
                {item?.images?.length > 1 && (
                  <Image
                    source={{ uri: item?.images[1]?.image }}
                    style={styles.product_image}
                  />
                )}
              </View>
              <View style={[styles.row, { width: '90%' }]}>
                <SvgXml xml={enRoute} />
                <View
                  style={{ justifyContent: 'space-between', marginTop: -20 }}
                >
                  <Text
                    style={[
                      styles.nameText,
                      { color: COLORS.stepGreen, fontFamily: FONT1LIGHT }
                    ]}
                  >
                    DELIVER FROM
                  </Text>
                  <Text style={[styles.nameText, { color: COLORS.darkBlack }]}>
                    {item?.pickup_address_city}, {item?.pickup_address_country}
                  </Text>
                  <Text
                    style={[
                      styles.nameText,
                      {
                        color: COLORS.stepGreen,
                        fontFamily: FONT1LIGHT,
                        marginTop: 5
                      }
                    ]}
                  >
                    DELIVER TO
                  </Text>
                  <Text style={[styles.nameText, { color: COLORS.darkBlack }]}>
                    {item?.arrival_address_city},{' '}
                    {item?.arrival_address_country}
                  </Text>
                </View>
              </View>
              <AppButton title={'Make Offer'} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <SvgXml xml={NoOrder} />
            <Text style={styles.timetext}>
              You don’t have new order requests
            </Text>
            <AppButton
              title={'Create Order'}
              onPress={() => navigation.navigate('CreateOrder')}
              width={150}
              color={COLORS.primary}
              backgroundColor={COLORS.lightblue}
            />
          </View>
        )}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: '100%',
    height: '100%'
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
  loading: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
  coutryText: {
    fontSize: hp(2.3),
    color: COLORS.white,
    fontFamily: FONT1MEDIUM
  },
  leftText: {
    fontSize: hp(2),
    color: COLORS.white,
    fontFamily: FONT1REGULAR
  },
  rightText: {
    fontSize: hp(2),
    color: COLORS.white,
    fontFamily: FONT1MEDIUM
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
    width: '100%',
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 20,
    height: hp(15),
    marginBottom: 20
  },
  tab: {
    marginRight: 20,
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: COLORS.lightblue,
    borderRadius: 20,
    marginRight: 20,
    paddingHorizontal: 15,
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
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginRight: 10,
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

export default JourneyDetails
