import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import NoOrder from '../../assets/svg/NoOrder.svg'
import Filter from '../../assets/svg/Filter.svg'
import planIcon from '../../assets/svg/plan.svg'
import calendarIcon from '../../assets/svg/calendar.svg'
import offerIcon from '../../assets/svg/offerIcon.svg'
import weightIcon from '../../assets/svg/weight.svg'
import userProfile from '../../assets/images/userProfile.png'
import { AppButton, Header } from '../../components'
import { COLORS, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import AppContext from '../../store/Context'
import moment from 'moment'
import momenttimezone from 'moment-timezone'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { declineOffer, getOnrouteJourneys, makeOffer } from '../../api/journey'
import { getOrderDetails } from '../../api/order'
import { Icon } from 'react-native-elements'

function OrderDetails ({ navigation, route }) {
  const item = route?.params?.item
  const [state, setState] = useState({
    loading: false,
    active: 'Offers',
    onRouteJourneys: [],
    orderData: null,
    selectedItem: null,
    loadingAccept: false,
    loadingDecline: false,
    filterSelected: ''
  })
  const [modalVisible, setModalVisible] = useState(false)

  // Context
  const context = useContext(AppContext)
  const {
    onRouteJourneys,
    loading,
    orderData,
    selectedItem,
    loadingAccept,
    filterSelected,
    loadingDecline
  } = state
  const { journeys, user, _getOrders } = context

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    if (item) {
      getData()
    }
  }, [item])

  const getData = () => {
    const id = `?order_id=${item?.id}`
    _getOnrouteJourneys(id)
    _getOrderDetails()
    _getOrders(`?user=${user?.id}`)
  }

  const _getOnrouteJourneys = async payload => {
    try {
      const token = await AsyncStorage.getItem('token')
      const qs = payload || ''
      const res = await getOnrouteJourneys(qs, token)
      handleChange('onRouteJourneys', res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _getOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await getOrderDetails(item?.id, token)
      handleChange('orderData', res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _makeOffer = async () => {
    try {
      handleChange('loadingAccept', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        journey: selectedItem?.id,
        order: item?.id,
        user: 'sender'
      }
      await makeOffer(payload, token)
      getData()
      handleChange('loadingAccept', false)
      Toast.show(`Offer has been accepted`)
      // navigation.goBack()
      setModalVisible(false)
    } catch (error) {
      handleChange('loadingAccept', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _declineOffer = async () => {
    try {
      handleChange('loadingDecline', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        journey: selectedItem?.id,
        order: item?.id
      }
      await declineOffer(payload, token)
      getData()
      handleChange('loadingDecline', false)
      Toast.show(`Offer has been declined`)
      // navigation.goBack()
      setModalVisible(false)
    } catch (error) {
      handleChange('loadingDecline', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const getOrderType = status => {
    if (status) {
      const filtered = journeys?.filter(e => e.status === status)
      return filtered || []
    } else return []
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
  function convertLocalDateToUTCDate1 (time, toLocal) {
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
      const todayDate1 = momenttimezone.tz(localTime, today).format()
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

  var text = orderData?.product_name
  var count = 30

  var result =
    text && text?.slice(0, count) + (text?.length > count ? '...' : '')

  const filterByRecent = offers => {
    if (filterSelected === 'Most Recent') {
      return offers?.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return (
          new Date(convertLocalDateToUTCDate1(b?.created_at, true)) -
          new Date(convertLocalDateToUTCDate1(a?.created_at, true))
        )
      })
    } else if (filterSelected === 'Fastest Arrival') {
      return offers?.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return moment(b?.date_of_journey).isBefore(moment(a?.date_of_journey))
      })
    } else {
      return offers
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header
        title={result || 'Journey'}
        rightEmpty
        back
        backgroundColor={COLORS.primary}
        color={COLORS.white}
      />
      <View style={[styles.row, { marginTop: 20 }]}>
        <TouchableOpacity
          onPress={() => handleChange('filterSelected', 'Most Recent')}
          style={
            filterSelected == 'Most Recent' ? styles.activeTab : styles.inavtive
          }
        >
          <Text
            style={
              filterSelected === 'Most Recent'
                ? styles.activeTabText
                : styles.tabText
            }
          >
            Most Recent
          </Text>
          {filterSelected == 'Most Recent' && (
            <Icon
              name='check'
              type='feather'
              size={16}
              containerStyle={{ marginLeft: 5 }}
              color={COLORS.successBGBorder}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleChange('filterSelected', 'Fastest Arrival')}
          style={
            filterSelected === 'Fastest Arrival'
              ? styles.activeTab
              : styles.inavtive
          }
        >
          <Text
            style={
              filterSelected === 'Fastest Arrival'
                ? styles.activeTabText
                : styles.tabText
            }
          >
            Fastest Arrival
          </Text>
          {filterSelected == 'Fastest Arrival' && (
            <Icon
              name='check'
              type='feather'
              size={16}
              containerStyle={{ marginLeft: 5 }}
              color={COLORS.successBGBorder}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => handleChange('filterSelected', 'Fastest Arrival')}
          style={styles.inavtive}
        >
          <Text style={styles.tabText}>Filters</Text>
          <SvgXml xml={Filter} style={{ marginLeft: 5 }} />
        </TouchableOpacity>
        <Text style={styles.tabText}></Text>
      </View>
      <FlatList
        data={filterByRecent(onRouteJourneys)}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', height: '100%', marginTop: 20 }}
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
                      Delivery{' '}
                      {convertLocalDateToUTCDate(item?.date_of_journey, true)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.hline} />

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
              <View
                style={[
                  styles.rowBetween,
                  { marginVertical: 10, width: '100%' }
                ]}
              >
                <View style={styles.box}>
                  <SvgXml xml={calendarIcon} style={{ opacity: 0.6 }} />
                  <Text style={styles.boxText}>
                    {' '}
                    {moment(item?.date_of_journey).format('DD / MM / YYYY')}
                  </Text>
                </View>
                <View style={styles.box}>
                  <SvgXml xml={weightIcon} />
                  <Text style={styles.boxText}>{item?.total_weight}Kg</Text>
                </View>
              </View>
              <FlatList
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
                      marginTop: 10,
                      borderWidth: 1,
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
              <AppButton
                title={'Request Offer'}
                onPress={() => {
                  handleChange('selectedItem', item)
                  setModalVisible(true)
                }}
              />
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
              width={180}
              color={COLORS.primary}
              backgroundColor={COLORS.lightblue}
            />
          </View>
        )}
      />
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          handleChange('selectedItem', null)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}
            >
              <View style={{ width: '100%' }}>
                <View
                  style={{
                    width: '100%',
                    height: hp(6),
                    backgroundColor: COLORS.successBG,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    borderRadius: 30,
                    marginVertical: 20
                  }}
                >
                  <SvgXml xml={offerIcon} />
                  <Text
                    style={{
                      marginLeft: 8,
                      color: COLORS.successBGBorder,
                      fontFamily: FONT1REGULAR,
                      fontSize: hp(2)
                    }}
                  >
                    New offer inquiry
                  </Text>
                </View>
                <View style={[styles.rowBetween, { width: '100%' }]}>
                  <View style={styles.row}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 40,
                        marginRight: 10
                      }}
                      source={
                        selectedItem?.user?.profile?.photo
                          ? { uri: selectedItem?.user?.profile?.photo }
                          : userProfile
                      }
                    />
                    <View>
                      <Text style={styles.nameText}>
                        {selectedItem?.user?.name}
                      </Text>
                      <Text style={styles.postedText}>
                        Delivery{' '}
                        {convertLocalDateToUTCDate(
                          selectedItem?.date_of_journey,
                          true
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.hline} />

                <View style={[styles.row, { width: '90%' }]}>
                  <Text
                    style={[
                      styles.nameText,
                      { color: COLORS.primary, maxWidth: '40%' }
                    ]}
                  >
                    {selectedItem?.departure_country}
                  </Text>
                  <SvgXml xml={planIcon} style={{ marginTop: 5 }} />
                  <Text
                    style={[
                      styles.nameText,
                      { color: COLORS.primary, maxWidth: '60%' }
                    ]}
                  >
                    {selectedItem?.arrival_country}
                  </Text>
                </View>
                <View
                  style={[
                    styles.rowBetween,
                    { marginVertical: 10, width: '100%' }
                  ]}
                >
                  <View style={styles.box}>
                    <SvgXml
                      xml={calendarIcon}
                      width={hp(2.5)}
                      height={hp(2.5)}
                      style={{ opacity: 0.6 }}
                    />
                    <Text style={styles.boxText}>
                      {' '}
                      {moment(selectedItem?.date_of_journey).format(
                        'DD / MM / YYYY'
                      )}
                    </Text>
                  </View>
                  <View style={styles.box}>
                    <SvgXml xml={weightIcon} width={hp(2.5)} height={hp(2.5)} />
                    <Text style={styles.boxText}>
                      {selectedItem?.total_weight}Kg
                    </Text>
                  </View>
                </View>
                <FlatList
                  data={selectedItem?.willing_to_carry}
                  numColumns={2}
                  renderItem={({ item: res, index }) => (
                    <View
                      key={index}
                      style={{
                        marginRight: 10,
                        paddingHorizontal: 8,
                        height: 30,
                        borderRadius: 50,
                        marginTop: 10,
                        borderWidth: 1,
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <AppButton
                    title={'Decline'}
                    width={'48%'}
                    outlined
                    color={COLORS.darkBlack}
                    loading={loadingDecline}
                    backgroundColor={COLORS.white}
                    onPress={_declineOffer}
                  />
                  <AppButton
                    title={'Accept'}
                    width={'48%'}
                    loading={loadingAccept}
                    onPress={_makeOffer}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  inavtive: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 10,
    height: hp(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkGrey,
    borderRadius: 50
  },
  inavtive1: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginRight: 10,
    height: hp(5),
    alignItems: 'center'
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
    backgroundColor: 'transparent',
    flexDirection: 'row',
    borderRadius: 20,
    marginRight: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.successBGBorder
  },
  tabText: {
    color: COLORS.darkBlack,
    fontSize: hp(1.6),
    fontFamily: FONT1MEDIUM
  },

  activeTabText: {
    color: COLORS.successBGBorder,
    fontSize: hp(1.6),
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
  box: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 10,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(6)
  },
  boxText: {
    color: COLORS.darkBlack,
    fontSize: hp(1.6),
    marginLeft: 5,
    fontFamily: FONT1MEDIUM
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.modalBG
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
})

export default OrderDetails
