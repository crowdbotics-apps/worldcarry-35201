import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  FlatList,
  ImageBackground,
  Image,
  Modal
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import chatIcon from '../../assets/svg/chatIcon.svg'
import qrSymbol from '../../assets/svg/qrSymbol.svg'
import NoOrder from '../../assets/svg/NoOrder.svg'
import starBlack from '../../assets/svg/starBlack.svg'
import cehcked from '../../assets/svg/cehcked.svg'
import planIcon from '../../assets/svg/plan.svg'
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
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Toast from 'react-native-simple-toast'
import { addReview } from '../../api/journey'
import { Rating } from 'react-native-ratings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import database from '@react-native-firebase/database'

function Order ({ navigation }) {
  const [state, setState] = useState({
    loading: false,
    active: 'Requested',
    activeStatus: 'Unpaid',
    showQR: false,
    showQRImage: '',
    OrderID: '',
    product_name: '',
    writeReview: false,
    rating: 0,
    content: '',
    respectful_attitude: false,
    no_additional_payment_asked: false,
    d2d_delivery: false,
    loadingReview: false,
    jid: '',
    oid: '',
    uid: '',
    order: null
  })

  // Context
  const context = useContext(AppContext)
  const {
    active,
    activeStatus,
    showQR,
    showQRImage,
    OrderID,
    product_name,
    arrival_address_country,
    pickup_address_country,
    writeReview,
    rating,
    content,
    respectful_attitude,
    no_additional_payment_asked,
    d2d_delivery,
    loadingReview,
    jid,
    oid,
    uid,
    order
  } = state
  const { orders, user } = context

  useEffect(() => {}, [])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const tabs = [
    { title: 'Requested', status: 'Unpaid' },
    { title: 'In Transit', status: 'In Transit' },
    { title: 'Received', status: 'Received' },
    { title: 'Inactive', status: 'Inactive' }
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

  const handleCloseReview = () => {
    handleChange('writeReview', false)
    handleChange('respectful_attitude', false)
    handleChange('no_additional_payment_asked', false)
    handleChange('d2d_delivery', false)
    handleChange('review', 0)
    handleChange('content', '')
    handleChange('uid', '')
    handleChange('jid', '')
    handleChange('oid', '')
    handleChange('order', '')
  }

  const _addReview = async () => {
    try {
      handleChange('loadingReview', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        journey: jid,
        order: oid,
        respectful_attitude,
        d2d_delivery,
        no_additional_payment_asked,
        rating,
        added_by: user?.id,
        target_user: uid
      }
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

  const getOrderType = status => {
    if (status) {
      if (status === 'Unpaid') {
        const filtered = orders?.filter(
          e =>
            e.status === status ||
            e.status === 'Accepted' ||
            e.status === 'Requested'
        )
        return filtered || []
      } else {
        const filtered = orders?.filter(
          e => e.status?.toLowerCase() === status?.toLowerCase()
        )
        return filtered || []
      }
    } else return []
  }

  const createMessageList = item => {
    let value = {
      sender: item.carrier,
      itemtitle: item?.product_name,
      senderId: item.carrier?.id,
      id: item?.id,
      timeStamp: Date.now(),
      receiverRead: 0,
      receiverId: user?.id,
      receiver: user,
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

  console.warn('orders', orders)

  return (
    <View style={styles.container}>
      <Header
        title={'Orders'}
        rightItem={
          <AppButton
            width={hp(15)}
            height={hp(5)}
            marginTop={1}
            title={'+ Add'}
            onPress={() => navigation.navigate('CreateOrder')}
          />
        }
      />
      <ScrollView
        style={styles.tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            onPress={() => {
              handleChange('active', tab?.title)
              handleChange('activeStatus', tab?.status)
            }}
            key={index}
            style={active === tab.title ? styles.activeTab : styles.inavtive}
          >
            <Text
              style={
                active === tab.title ? styles.activeTabText : styles.tabText
              }
            >
              {getOrderType(tab?.status)?.length} {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={getOrderType(activeStatus)}
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
              <View style={[styles.row, { width: '90%' }]}>
                <Text
                  style={[
                    styles.nameText,
                    { color: COLORS.primary, maxWidth: '40%' }
                  ]}
                >
                  {item?.pickup_address_country}
                </Text>
                <SvgXml xml={planIcon} />
                <Text
                  style={[
                    styles.nameText,
                    { color: COLORS.primary, maxWidth: '60%' }
                  ]}
                >
                  {item?.arrival_address_country}
                </Text>
              </View>
              <Text
                style={[styles.nameText, { fontSize: hp(2.5), width: '90%' }]}
              >
                Take My {item?.product_name} from {item?.pickup_address_country}{' '}
                to {item?.arrival_address_country}
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
              {(item?.status === 'Unpaid' || item?.status === 'Requested') && (
                <AppButton
                  title={'View Journeys'}
                  onPress={() => navigation.navigate('OrderDetails', { item })}
                />
              )}
              {(item?.status === 'Accepted' ||
                item?.status === 'In transit') && (
                <>
                  <View style={styles.hline} />
                  <AppButton
                    title={'Show QR Code'}
                    outlined
                    color={COLORS.darkBlack}
                    backgroundColor={COLORS.white}
                    titleLight
                    prefix={
                      <SvgXml xml={qrSymbol} style={{ marginRight: 5 }} />
                    }
                    onPress={() => {
                      handleChange('showQR', true)
                      handleChange('showQRImage', item?.qr_code)
                      handleChange('product_name', item?.product_name)
                      handleChange(
                        'pickup_address_country',
                        item?.pickup_address_country
                      )
                      handleChange(
                        'arrival_address_country',
                        item?.arrival_address_country
                      )
                    }}
                  />
                  <View
                    style={[
                      styles.rowBetween,
                      { width: '100%', marginTop: 10 }
                    ]}
                  >
                    <View style={[styles.row, { width: '40%' }]}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          marginRight: 10
                        }}
                        source={
                          item?.carrier?.profile?.photo
                            ? { uri: item?.carrier?.profile?.photo }
                            : userProfile
                        }
                      />
                      <View>
                        <Text style={styles.nameText}>
                          {item?.carrier?.name}
                        </Text>
                        <Text style={styles.postedText}>Order Carrier</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <AppButton
                        title={'Chat'}
                        outlined
                        width={'60%'}
                        backgroundColor={COLORS.white}
                        color={COLORS.darkBlack}
                        titleLight
                        prefix={
                          <SvgXml xml={chatIcon} style={{ marginRight: 8 }} />
                        }
                        onPress={() => createMessageList(item)}
                      />
                    </View>
                  </View>
                </>
              )}
              {item?.status === 'Received' && (
                <>
                  <View style={[styles.row, { width: '40%' }]}>
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        marginRight: 10
                      }}
                      source={
                        item?.carrier?.profile?.photo
                          ? { uri: item?.carrier?.profile?.photo }
                          : userProfile
                      }
                    />
                    <View>
                      <Text style={styles.nameText}>{item?.carrier?.name}</Text>
                      <Text style={styles.postedText}>Order Carrier</Text>
                    </View>
                  </View>
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
                  <AppButton
                    title={'Write a review'}
                    outlined
                    backgroundColor={COLORS.white}
                    color={COLORS.darkBlack}
                    disabled={item?.reviewed}
                    titleLight
                    prefix={
                      <SvgXml xml={starBlack} style={{ marginRight: 8 }} />
                    }
                    onPress={() => {
                      if (!item?.reviewed) {
                        handleChange('writeReview', true)
                        handleChange('order', item)
                        handleChange('writeReview', true)
                        handleChange('oid', item?.id)
                        handleChange('uid', item?.carrier?.id)
                      }
                    }}
                  />
                </>
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
      <Modal animationType='slide' transparent={true} visible={showQR}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.textView}>
              <Text style={[styles.pricetext, { width: '100%' }]}>
                Take My {product_name} from {pickup_address_country} to{' '}
                {arrival_address_country}
              </Text>
              <View
                style={[styles.rowBetween, { width: '100%', marginBottom: 20 }]}
              >
                <Text style={styles.successText}>Order ID</Text>
                <Text style={styles.successText}>{'#WC021654'}</Text>
              </View>
              <Image
                source={{ uri: showQRImage }}
                style={{ width: '100%', height: 250, resizeMode: 'cover' }}
              />
              <Text style={styles.successText}>
                Show the QR code to order carrier for a safe hand to hand
                delivery.
              </Text>

              <AppButton
                title={'Done'}
                onPress={() => {
                  handleChange('showQR', false)
                  handleChange('showQRImage', '')
                  handleChange('product_name', '')
                  handleChange('arrival_address_country', '')
                  handleChange('pickup_address_country', '')
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
  textView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successText: {
    fontSize: hp(2),
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    marginTop: 10
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
    width: '100%',
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    height: hp(6),
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
    height: hp(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  tabText: {
    color: COLORS.darkGrey,
    fontSize: hp(1.8),
    marginTop: -5,
    fontFamily: FONT1MEDIUM
  },
  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(1.8),
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
    backgroundColor: COLORS.white,
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

export default Order
