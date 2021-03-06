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
  Image
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import NoOrder from '../../assets/svg/NoOrder.svg'
import planIcon from '../../assets/svg/plan.svg'
import userProfile from '../../assets/images/userProfile.png'
import { AppButton, Header } from '../../components'
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

function Order ({ navigation }) {
  const [state, setState] = useState({
    loading: false,
    active: 'Requested',
    activeStatus: 'Unpaid'
  })

  // Context
  const context = useContext(AppContext)
  const { active, activeStatus } = state
  const { orders } = context

  useEffect(() => {}, [])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const tabs = [
    { title: 'Requested', status: 'Unpaid' },
    { title: 'In Transit' },
    { title: 'Recieved' },
    { title: 'Inactive' }
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

  console.warn('orders', orders)

  const getOrderType = status => {
    if (status) {
      const filtered = orders?.filter(e => e.status === status)
      return filtered || []
    } else return []
  }

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
              <AppButton
                title={'View Journeys'}
                onPress={() => navigation.navigate('OrderDetails', { item })}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <SvgXml xml={NoOrder} />
            <Text style={styles.timetext}>
              You don???t have new order requests
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

export default Order
