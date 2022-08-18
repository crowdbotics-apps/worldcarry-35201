import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Modal
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import NoOrder from '../../assets/svg/NoOrder.svg'
import planIcon from '../../assets/svg/plan.svg'
import enRoute from '../../assets/svg/enRoute.svg'
import chatIcon from '../../assets/svg/chatIcon.svg'
import locateIcon from '../../assets/svg/locate.svg'
import successImage from '../../assets/images/successImage.png'
import cehcked from '../../assets/svg/cehcked.svg'
import starBlack from '../../assets/svg/starBlack.svg'
import userProfile from '../../assets/images/userProfile.png'
import { AppButton, AppInput, CustomModel, Header } from '../../components'
import {
  COLORS,
  FONT1BOLD,
  FONT1LIGHT,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD
} from '../../constants'
import AppContext from '../../store/Context'
import moment from 'moment'
import momenttimezone from 'moment-timezone'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { addReview, getJourneyDetails, makeOffer } from '../../api/journey'
import { getOnrouteOrders, updateOrderStatus } from '../../api/order'
import { useFocusEffect } from '@react-navigation/native'
import { Rating } from 'react-native-ratings'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import database from '@react-native-firebase/database'

function JourneyDetails ({ navigation, route }) {
  const item = route?.params?.item
  const successDelivered = route?.params?.successDelivered
  const order = route?.params?.order
  const [state, setState] = useState({
    loading: false,
    active: 'Offers',
    onRouteOrders: [],
    loadingJourney: false,
    loadingStatus: false,
    successfullyDelivered: false,
    writeReview: false,
    journeyData: null,
    rating: 0,
    content: '',
    respectful_attitude: false,
    no_additional_payment_asked: false,
    d2d_delivery: false,
    loadingReview: false
  })

  // Context
  const context = useContext(AppContext)
  const {
    onRouteOrders,
    loading,
    journeyData,
    active,
    loadingJourney,
    loadingStatus,
    successfullyDelivered,
    writeReview,
    rating,
    content,
    respectful_attitude,
    no_additional_payment_asked,
    d2d_delivery,
    loadingReview
  } = state
  const { user, _getOrders } = context

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const tabs = [
    { title: 'Offers', total: onRouteOrders?.offers_count || 0 },
    {
      title: 'Accepted',
      total:
        onRouteOrders?.accepted_count +
          onRouteOrders?.requested_by_sender_count || 0
    },
    { title: 'In Transit', total: onRouteOrders?.in_transit_count || 0 },
    { title: 'Delivered', total: onRouteOrders?.delivered_count || 0 }
  ]

  useFocusEffect(
    useCallback(() => {
      if (item) {
        getData()
      }
      if (successDelivered) {
        handleChange('successfullyDelivered', true)
      }
    }, [item, successDelivered])
  )

  const getData = () => {
    const id = `?journey_id=${item?.id}`
    _getOnrouteOrders(id)
    _getOrders(`?user=${user?.id}`)
    _getJourneyDetails()
  }

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

  console.warn('onRouteOrders', onRouteOrders?.requested_by_sender)

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

  const _makeOffer = async oid => {
    try {
      handleChange('loadingJourney', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        journey: item?.id,
        order: oid,
        user: 'carrier'
      }
      await makeOffer(payload, token)
      Toast.show(`You have successfully make an offer`)
      handleChange('loadingJourney', false)
      getData()
    } catch (error) {
      handleChange('loadingJourney', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _acceptOffer = async oid => {
    try {
      handleChange('loadingJourney', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        journey: item?.id,
        order: oid,
        user: 'carrier'
      }
      await makeOffer(payload, token)
      Toast.show(`You have successfully accepted an offer`)
      handleChange('loadingJourney', false)
      getData()
    } catch (error) {
      handleChange('loadingJourney', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const handleCloseReview = () => {
    handleChange('successfullyDelivered', false)
    navigation.setParams({ successDelivered: null })
    handleChange('writeReview', false)
    handleChange('respectful_attitude', false)
    handleChange('no_additional_payment_asked', false)
    handleChange('d2d_delivery', false)
    handleChange('review', 0)
    handleChange('content', '')
  }

  const _addReview = async () => {
    try {
      handleChange('loadingReview', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        journey: item?.id,
        order: order?.id,
        respectful_attitude,
        d2d_delivery,
        no_additional_payment_asked,
        rating,
        added_by: user?.id,
        target_user: order?.carrier?.id
      }
      console.warn('payload', payload)
      await addReview(payload, token)
      Toast.show(`You have successfully reviewed to the sender`)
      handleChange('loadingReview', false)
      handleChange('successfullyDelivered', false)
      navigation.setParams({ successDelivered: null })
      handleChange('writeReview', false)
      handleChange('respectful_attitude', false)
      handleChange('no_additional_payment_asked', false)
      handleChange('d2d_delivery', false)
      handleChange('review', 0)
      handleChange('content', '')
      getData()
    } catch (error) {
      handleChange('loadingReview', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _makeInTransit = async oid => {
    try {
      handleChange('loadingStatus', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        order: oid,
        status: 'In transit'
      }
      await updateOrderStatus(payload, token)
      Toast.show(`Order now move in "In Transit"`)
      handleChange('loadingStatus', false)
      getData()
    } catch (error) {
      handleChange('loadingStatus', false)
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

  const getOrderFromStatus = () => {
    if (active === 'Offers') {
      return onRouteOrders?.offers
    } else if (active === 'Accepted') {
      return onRouteOrders?.accepted?.concat(onRouteOrders?.requested_by_sender)
    } else if (active === 'In Transit') {
      return onRouteOrders?.in_transit
    } else {
      return onRouteOrders?.delivered
    }
  }

  const createMessageList = item => {
    let value = {
      sender: user,
      itemtitle: item?.product_name,
      senderId: user?.id,
      id: item?.id,
      timeStamp: Date.now(),
      receiverRead: 0,
      receiverId: item.user?.id,
      receiver: item.user,
      order: item
    }
      database()
      .ref('Messages/' + item?.id)
      .update(value)
      .then(res => {
        navigation.navigate('Chat', { orderID: item?.id })
      })
      .catch(err => {
        Toast.show('Something went wrong!')
      })
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} size={'large'} />
      </View>
    )
  }

  console.warn('getOrderFromStatus()', getOrderFromStatus())

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
              {tab?.total} {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={getOrderFromStatus()}
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
              <View style={styles.hline} />
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
              {active === 'Offers' && (
                <AppButton
                  title={'Make Offer'}
                  disabled={loadingJourney}
                  onPress={() => _makeOffer(item?.id)}
                />
              )}
              {active !== 'Offers' && (
                <View
                  style={{
                    width: '100%',
                    marginTop: -20,
                    alignItems: 'center'
                  }}
                >
                  <View style={styles.hline} />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('JourneyOrderDetails', {
                        item,
                        active,
                        jItem: route?.params?.item
                      })
                    }
                  >
                    <Text
                      style={{
                        color: COLORS.successBGBorder,
                        fontFamily: FONT1REGULAR,
                        fontSize: hp(1.8),
                        textDecorationLine: 'underline'
                      }}
                    >
                      View full details
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {active === 'Accepted' &&
                onRouteOrders?.requested_by_sender?.filter(
                  e => e.id === item?.id
                )?.length === 0 && (
                  <AppButton
                    title={'Chat with sender'}
                    outlined
                    backgroundColor={COLORS.white}
                    color={COLORS.darkBlack}
                    titleLight
                    prefix={
                      <SvgXml xml={chatIcon} style={{ marginRight: 8 }} />
                    }
                    onPress={() => createMessageList(item)}
                  />
                )}
              {active === 'Accepted' &&
                onRouteOrders?.requested_by_sender?.filter(
                  e => e.id === item?.id
                )?.length === 0 && (
                  <AppButton
                    title={
                      item?.can_transit
                        ? 'Move to Transit'
                        : 'Waiting for sender approval...'
                    }
                    disabled={!item?.can_transit}
                    backgroundColor={
                      item?.can_transit ? COLORS.primary : COLORS.primaryLight
                    }
                    loading={loadingStatus}
                    color={item?.can_transit ? COLORS.white : COLORS.primary}
                    onPress={() => _makeInTransit(item?.id)}
                  />
                )}
              {active === 'Accepted' &&
                onRouteOrders?.requested_by_sender?.filter(
                  e => e.id === item?.id
                )?.length > 0 &&
                item?.can_transit && (
                  <AppButton
                    title={
                      item?.can_transit
                        ? 'Move to Transit'
                        : 'Waiting for sender approval...'
                    }
                    disabled={!item?.can_transit}
                    backgroundColor={
                      item?.can_transit ? COLORS.primary : COLORS.primaryLight
                    }
                    loading={loadingStatus}
                    color={item?.can_transit ? COLORS.white : COLORS.primary}
                    onPress={() => _makeInTransit(item?.id)}
                  />
                )}
              {active === 'Accepted' &&
                onRouteOrders?.requested_by_sender?.filter(
                  e => e.id === item?.id
                )?.length > 0 &&
                !item?.can_transit && (
                  <View style={styles.rowBetween}>
                    <AppButton
                      title={'Decline'}
                      width={'48%'}
                      backgroundColor={COLORS.white}
                      color={COLORS.darkBlack}
                      outlined
                      // onPress={() => _makeOffer(item?.id)}
                    />
                    <AppButton
                      title={'Accept'}
                      disabled={item?.can_transit}
                      width={'48%'}
                      backgroundColor={COLORS.primary}
                      loading={loadingJourney}
                      color={!item?.can_transit ? COLORS.white : COLORS.primary}
                      onPress={() => _acceptOffer(item?.id)}
                    />
                  </View>
                )}

              {active === 'In Transit' && (
                <>
                  <View style={styles.rowBetween}>
                    <AppButton
                      title={'Chat'}
                      outlined
                      backgroundColor={COLORS.white}
                      color={COLORS.darkBlack}
                      titleLight
                      width={'48%'}
                      prefix={
                        <SvgXml xml={chatIcon} style={{ marginRight: 8 }} />
                      }
                      onPress={() => createMessageList(item)}
                    />
                    <AppButton
                      title={'Locate'}
                      backgroundColor={COLORS.stepGreen}
                      color={COLORS.white}
                      width={'48%'}
                      prefix={
                        <SvgXml xml={locateIcon} style={{ marginRight: 8 }} />
                      }
                      // onPress={() => _makeOffer(item?.id)}
                    />
                  </View>
                  <AppButton
                    title={'Deliver Order'}
                    disabled={!item?.can_transit}
                    backgroundColor={
                      item?.can_transit ? COLORS.primary : COLORS.primaryLight
                    }
                    loading={loadingStatus}
                    color={item?.can_transit ? COLORS.white : COLORS.primary}
                    onPress={() =>
                      navigation.navigate('ScanQR', {
                        orderID: item?.id,
                        order: item,
                        jItem: route?.params?.item
                      })
                    }
                  />
                </>
              )}
              {active === 'Delivered' && (
                <View
                  // onPress={() => handleChange('writeReview', true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.successBG,
                    borderRadius: 30,
                    height: hp(6),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 15
                  }}
                >
                  <SvgXml xml={cehcked} />
                  <Text
                    style={{
                      fontFamily: FONT1REGULAR,
                      fontSize: hp(2),
                      color: COLORS.successBGBorder,
                      marginLeft: 10
                    }}
                  >
                    Order Delivered
                  </Text>
                </View>
              )}
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
      <Modal
        animationType='slide'
        transparent={true}
        visible={successfullyDelivered}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={successImage}
              style={{
                width: '100%',
                height: 150,
                marginTop: -30,
                resizeMode: 'cover'
              }}
            />
            <View style={styles.textView}>
              <Text style={styles.successText}>Successfully Delivered</Text>
              <Text style={styles.collectReward}>Collect your Reward</Text>
              <Text style={styles.reward}>${order?.carrier_reward}</Text>
              <Text style={[styles.successText, { color: COLORS.darkBlack }]}>
                Your delivery of Order ID #WC021654
              </Text>
              <Text
                style={[
                  styles.collectReward,
                  { fontFamily: FONT1REGULAR, textAlign: 'center' }
                ]}
              >
                “Carry my {order?.product_name} from{' '}
                {order?.pickup_address_city
                  ? order?.pickup_address_city + ', '
                  : '' + order?.pickup_address_state
                  ? order?.pickup_address_state + ', '
                  : '' + order?.pickup_address_country}{' '}
                to{' '}
                {order?.arrival_address_city
                  ? order?.arrival_address_city + ', '
                  : '' + order?.arrival_address_state
                  ? order?.arrival_address_state + ', '
                  : '' + order?.arrival_address_country}
                ”{' '}
                <Text style={{ color: COLORS.darkBlack }}>is successfull.</Text>
              </Text>
              <AppButton
                title={'Write a review'}
                outlined
                backgroundColor={COLORS.white}
                color={COLORS.darkBlack}
                titleLight
                prefix={<SvgXml xml={starBlack} style={{ marginRight: 8 }} />}
                onPress={() => {
                  handleChange('successfullyDelivered', false)
                  handleChange('writeReview', true)
                }}
              />
              <AppButton
                title={'Done'}
                onPress={() => {
                  handleChange('successfullyDelivered', false)
                  navigation.setParams({ successDelivered: null })
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <CustomModel
        visible={writeReview}
        height={'90%'}
        onClose={handleCloseReview}
      >
        <View style={{ alignItems: 'center', width: '100%' }}>
          <View style={{ alignItems: 'center', width: '90%' }}>
            <Image
              style={{
                width: 100,
                marginTop: 10,
                height: 100,
                borderRadius: 100
              }}
              source={
                order?.carrier?.profile?.photo
                  ? { uri: order?.carrier?.profile?.photo }
                  : userProfile
              }
            />
            <Text>{order?.carrier?.name}</Text>
            <Text>Sender</Text>
            <View style={styles.hline} />
            <Text
              style={{
                fontFamily: FONT1REGULAR,
                fontSize: hp(3.5),
                color: COLORS.darkGrey
              }}
            >
              {rating?.toFixed(1)}
            </Text>
            <Rating
              type='custom'
              style={{ marginBottom: 10 }}
              startingValue={rating}
              fractions={0.1}
              onFinishRating={rating => handleChange('rating', rating)}
              ratingBackgroundColor={COLORS.tripBoxBorder}
              imageSize={35}
            />

            <AppInput
              placeholder={'write review'}
              value={content}
              borderColor={COLORS.grey}
              name={'content'}
              onChange={handleChange}
              multiline
              height={100}
            />
            <View style={{ width: '100%' }}>
              <BouncyCheckbox
                size={20}
                fillColor={COLORS.primary}
                unfillColor={COLORS.white}
                disableBuiltInState
                isChecked={respectful_attitude}
                text='Respectful attitude'
                iconStyle={{ borderColor: COLORS.primary, borderRadius: 8 }}
                textStyle={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(2),
                  color: COLORS.darkBlack,
                  textDecorationLine: 'none'
                }}
                style={{ marginTop: 10 }}
                onPress={() =>
                  handleChange('respectful_attitude', !respectful_attitude)
                }
              />
              <BouncyCheckbox
                size={20}
                fillColor={COLORS.primary}
                unfillColor={COLORS.white}
                disableBuiltInState
                isChecked={no_additional_payment_asked}
                text='Provide additional charge'
                iconStyle={{ borderColor: COLORS.primary, borderRadius: 8 }}
                textStyle={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(2),
                  color: COLORS.darkBlack,
                  textDecorationLine: 'none'
                }}
                style={{ marginTop: 10 }}
                onPress={() =>
                  handleChange(
                    'no_additional_payment_asked',
                    !no_additional_payment_asked
                  )
                }
              />
              <BouncyCheckbox
                size={20}
                fillColor={COLORS.primary}
                unfillColor={COLORS.white}
                disableBuiltInState
                isChecked={d2d_delivery}
                text='Carry again for them'
                iconStyle={{ borderColor: COLORS.primary, borderRadius: 8 }}
                textStyle={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(2),
                  color: COLORS.darkBlack,
                  textDecorationLine: 'none'
                }}
                style={{ marginTop: 10, marginBottom: 10 }}
                onPress={() => handleChange('d2d_delivery', !d2d_delivery)}
              />
            </View>
            <View style={[styles.rowBetween, { width: '100%' }]}>
              <AppButton
                title={'Cancel'}
                onPress={handleCloseReview}
                outlined
                width={'48%'}
                color={COLORS.darkBlack}
                backgroundColor={COLORS.white}
              />
              <AppButton
                title={'Submit'}
                loading={loadingReview}
                width={'48%'}
                onPress={_addReview}
                disabled={!content || !rating}
              />
            </View>
          </View>
        </View>
      </CustomModel>
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
  textView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
  reward: {
    fontSize: hp(3),
    color: COLORS.darkBlack,
    marginVertical: 15,
    fontFamily: FONT1BOLD
  },
  collectReward: {
    fontSize: hp(2),
    color: COLORS.primary,
    fontFamily: FONT1SEMIBOLD
  },
  successText: {
    fontSize: hp(2),
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    marginTop: 10
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
  },
  centeredView: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.modalBG,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    width: '90%',
    backgroundColor: COLORS.backgroud,
    borderRadius: 20,
    padding: 30,
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

export default JourneyDetails
