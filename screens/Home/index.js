import React, {
  createRef,
  useCallback,
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
import BG from '../../assets/images/BG.png'
import handShake from '../../assets/images/handShake.png'
import Plan from '../../assets/images/plan.png'
import userBetween from '../../assets/images/userBetween.png'
import oneWay from '../../assets/svg/oneTrip.svg'
import roundTrip from '../../assets/svg/roundTrip.svg'
import Jewellery from '../../assets/svg/Jewellery.svg'
import Electronics from '../../assets/svg/Electronics.svg'
import Clothes from '../../assets/svg/Clothes.svg'
import Fooditems from '../../assets/svg/Fooditems.svg'
import DocumentsBooks from '../../assets/svg/DocumentsBooks.svg'
import Medication from '../../assets/svg/Medication.svg'
import Box from '../../assets/images/box.png'
import meetGet from '../../assets/images/meetGet.png'
import handfree from '../../assets/svg/handfree.svg'
import security_5 from '../../assets/images/security_5.png'
import Shopping_bag from '../../assets/images/Shopping_bag.png'
import userProfile from '../../assets/images/userProfile.png'
import camera from '../../assets/images/camera.png'
import {
  COLORS,
  FONT1BOLD,
  FONT1LIGHT,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD
} from '../../constants'
import AppContext from '../../store/Context'
import Carousel from 'react-native-snap-carousel'
import { SvgXml } from 'react-native-svg'
import { AppButton } from '../../components'
import Accordion from 'react-native-collapsible/Accordion'
import faq1 from '../../assets/svg/faq1.svg'
import { Icon } from 'react-native-elements'
import { getFAQ } from '../../api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { Platform } from 'react-native'

const SECTIONS = [
  {
    title: 'How to shop on WorldCarry?',
    content: 'Lorem ipsum...'
  },
  {
    title: 'I am a sender, can I cancel my order?',
    content: 'Lorem ipsum...'
  },
  {
    title: 'What can I order on WorldCarry?',
    content: 'Lorem ipsum...'
  },
  {
    title: 'Why do I need to pay in advance?',
    content: 'Lorem ipsum...'
  },
  {
    title: 'What happens after I create an order?',
    content: 'Lorem ipsum...'
  },
  {
    title: 'Where do I pick up my order?',
    content: 'Lorem ipsum...'
  }
]

const sliderWidth = Dimensions.get('window').width

function Home ({ navigation }) {
  let carouselRef = createRef()
  const [state, setState] = useState({
    loading: false,
    active: 0,
    activeSlide: 0,
    activeSections: [],
    filteredList: [],
    products: [
      { image: Jewellery, text: 'Jewellery' },
      { image: Electronics, text: 'Electronics' },
      { image: Clothes, text: 'Clothes' },
      { image: DocumentsBooks, text: 'Documents & Books' },
      { image: Fooditems, text: 'Food items' },
      { image: Medication, text: 'Medication' }
    ],
    entries: [
      {
        color: COLORS.slide1,
        title: 'Add Journey',
        step: 'STEP 1',
        description:
          'Start by adding your journey to see requested orders along your route.',
        image: Plan
      },
      {
        color: COLORS.slide2,
        title: 'Make offers and Carry the Product',
        step: 'STEP 2',
        description:
          'You choose the orders you’d like to deliver. Carry the product to the destination',
        image: Box
      },
      {
        color: COLORS.slide3,
        title: 'Meet, Deliver and Get Paid',
        step: 'STEP 3',
        description:
          'Meet in person, deliver the product, get paid with world carry',
        image: handShake
      }
    ],
    entries1: [
      {
        color: COLORS.slideB1,
        title: 'Create your Order',
        step: 'STEP 1',
        description:
          'Add your product details and location to help finding product for carrier',
        image: Shopping_bag
      },
      {
        color: COLORS.slideB2,
        title: 'Make a Secure Payment',
        step: 'STEP 2',
        description:
          'Add a payment to tip carrier to help you out in the long journey.',
        image: security_5
      },
      {
        color: COLORS.slideB3,
        title: 'Meet, and Get your Item',
        step: 'STEP 3',
        description:
          'Your carrier will meet at your address and we pay him after your confirmation',
        image: meetGet
      }
    ]
  })

  // Context
  const context = useContext(AppContext)
  const {
    loading,
    activeSections,
    entries1,
    journeys,
    entries,
    activeSlide,
    active,
    filteredList
  } = state
  const { user, completedOrders } = context

  useEffect(() => {}, [])

  useFocusEffect(
    useCallback(() => {
      _getFAQ()
      requestGeolocationPermission()
    }, [])
  )

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _updateSections = activeSections => {
    handleChange('activeSections', activeSections)
  }

  async function requestGeolocationPermission () {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'World Carry Geolocation Permission',
          message: 'World Carry needs access to your current location.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        console.log('Geolocation permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.question}</Text>
        <Icon name={'down'} type={'antdesign'} color={COLORS.grey} size={18} />
      </View>
    )
  }

  const _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text>{section.answer}</Text>
      </View>
    )
  }

  const _renderItem = ({ item, index }) => {
    return (
      <View key={index} style={[{ width: '100%', alignItems: 'center' }]}>
        <View style={[styles.slide, { backgroundColor: item.color }]}>
          <View style={{ width: '100%', alignItems: 'flex-end' }}>
            <Image
              source={item.image}
              style={{
                width:
                  !active && activeSlide === 2
                    ? '70%'
                    : !active && activeSlide === 1
                    ? '40%'
                    : active === 1 && activeSlide === 2
                    ? '50%'
                    : '60%',
                height: !active && activeSlide === 2 ? 140 : 120,
                marginTop: active === 1 && activeSlide === 2 ? -10 : 0,
                marginRight: active === 1 && activeSlide === 2 ? -10 : 0,
                marginBottom: !active && activeSlide === 2 ? -30 : 0,
                resizeMode: 'center'
              }}
            />
          </View>
          <View style={{ marginTop: -50, width: '60%', marginLeft: '5%' }}>
            <Text style={styles.stepText}>{item.step}</Text>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.descText}>{item.description}</Text>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginBottom: 20
            }}
          >
            <View style={activeSlide === 0 ? styles.avtive : styles.inavtive} />
            <View style={activeSlide === 1 ? styles.avtive : styles.inavtive} />
            <View style={activeSlide === 2 ? styles.avtive : styles.inavtive} />
          </View>
        </View>
      </View>
    )
  }

  const getJourneyType = status => {
    if (status) {
      const filtered = journeys?.filter(e => e?.status !== status)
      return filtered || []
    } else return []
  }

  const _getFAQ = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const res = await getFAQ(token)
      handleChange('loading', false)
      console.warn('getFAQ', res?.data)
      handleChange('filteredList', res?.data)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <ImageBackground
        source={BG}
        style={styles.bgImage}
        imageStyle={styles.imgStyle}
      >
        <View style={[styles.rowBetween, { width: '90%' }]}>
          <Text style={styles.welcomeText}>
            Welcome <Text style={{ fontFamily: FONT1BOLD }}>{user?.name}!</Text>
          </Text>
          <Image
            source={
              user?.profile?.photo ? { uri: user?.profile?.photo } : userProfile
            }
            style={styles.userProfile}
          />
        </View>
      </ImageBackground>
      <View style={[styles.tabs, { justifyContent: 'center' }]}>
        <TouchableOpacity
          style={active === 0 ? styles.activeTab : styles.tab}
          onPress={() => handleChange('active', 0)}
        >
          <Text style={active === 0 ? styles.activeTabText : styles.tabText}>
            {'Carrier'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={active === 1 ? styles.activeTab : styles.tab}
          onPress={() => handleChange('active', 1)}
        >
          <Text style={active === 1 ? styles.activeTabText : styles.tabText}>
            Sender
          </Text>
        </TouchableOpacity>
      </View>
      <Carousel
        layout={'default'}
        // ref={e => {
        //   carouselRef = e
        // }}
        onSnapToItem={index =>
          setState(pre => ({ ...pre, activeSlide: index }))
        }
        initialNumToRender={1}
        windowSize={3}
        data={active ? entries1 : entries}
        // data={entries1}
        renderItem={_renderItem}
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth}
      />
      {!active && (
        <>
          {/* <Carousel
            layout={'default'}
            // ref={e => {
            //   carouselRef = e
            // }}
            onSnapToItem={index =>
              setState(pre => ({ ...pre, activeSlide: index }))
            }
            initialNumToRender={1}
            windowSize={3}
            // data={active ? entries1 : entries}
            data={entries}
            renderItem={_renderItem}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          /> */}
          <View style={[styles.rowBetween, { width: '90%' }]}>
            <TouchableOpacity
              style={styles.tripBox}
              onPress={() => navigation.navigate('CreateJourney')}
            >
              <SvgXml xml={oneWay} />
              <Text style={[styles.nameText, { marginTop: 5 }]}>One way</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tripBox}
              onPress={() =>
                navigation.navigate('CreateJourney', {
                  activeRoundParams: true
                })
              }
            >
              <SvgXml xml={roundTrip} />
              <Text style={[styles.nameText, { marginTop: 5 }]}>
                Round Trip
              </Text>
            </TouchableOpacity>
          </View>
          <AppButton
            width={'90%'}
            onPress={() => navigation.navigate('CreateJourney')}
            title={'Add Journey'}
          />
          <View
            style={[
              styles.rowBetween,
              { width: '90%', marginTop: 20, marginBottom: 20 }
            ]}
          >
            <Text style={styles.recentText}>Recently Completed</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Journey')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {completedOrders?.length > 0 && (
            <ScrollView
              style={{ height: 400, marginBottom: 50 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {completedOrders?.map((item, index) => (
                <View key={index} style={styles.itemBox}>
                  <Text style={styles.titleItem}>
                    “Carry my {item?.product_name} from{' '}
                    {item?.pickup_address_city
                      ? item?.pickup_address_city + ', '
                      : '' + item?.pickup_address_state
                      ? item?.pickup_address_state + ', '
                      : '' + item?.pickup_address_country}{' '}
                    to{' '}
                    {item?.arrival_address_city
                      ? item?.arrival_address_city + ', '
                      : '' + item?.arrival_address_state
                      ? item?.arrival_address_state + ', '
                      : '' + item?.arrival_address_country}
                    ”{' '}
                    {/* Carry my camera from Los Angeles, CA, US to Rio De Janero */}
                  </Text>
                  <View style={styles.hline} />
                  <View style={[styles.rowBetween, { width: '90%' }]}>
                    <TouchableOpacity style={styles.userBox}>
                      <Image
                        source={
                          user?.profile?.photo
                            ? { uri: user?.profile?.photo }
                            : userProfile
                        }
                        style={{ width: 50, height: 50, borderRadius: 50 }}
                      />
                      <Text style={styles.nameText}>{user?.name}</Text>
                      <Text style={styles.locationText}>
                        {item?.pickup_address_city
                          ? item?.pickup_address_city + ', '
                          : '' + item?.pickup_address_state
                          ? item?.pickup_address_state + ', '
                          : '' + item?.pickup_address_country}
                      </Text>
                    </TouchableOpacity>
                    <Image
                      source={userBetween}
                      style={{
                        width: 60,
                        height: 60,
                        marginHorizontal: -25,
                        zIndex: 2
                      }}
                    />
                    <TouchableOpacity style={styles.userBox}>
                      <Image
                        source={
                          item?.user?.profile?.photo
                            ? { uri: item?.user?.profile?.photo }
                            : userProfile
                        }
                        style={{ width: 50, height: 50, borderRadius: 50 }}
                      />
                      <Text style={styles.nameText}>{item?.user?.name}</Text>
                      <Text style={styles.locationText}>
                        {item?.arrival_address_city
                          ? item?.arrival_address_city + ', '
                          : '' + item?.arrival_address_state
                          ? item?.arrival_address_state + ', '
                          : '' + item?.arrival_address_country}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.hline} />
                  <View style={[styles.rowBetween, { width: '90%' }]}>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.earntext}>Earned</Text>
                      <Text style={styles.pricetext}>${item?.total}</Text>
                      <Text style={styles.completetext}>Completed on</Text>
                      <View style={styles.timeBox}>
                        <Text style={styles.timetext}>24/04/2022</Text>
                      </View>
                    </View>
                    {item?.images?.length > 0 && (
                      <Image
                        source={{ uri: item?.images[0]?.image }}
                        style={{
                          width: '48%',
                          height: 120,
                          marginTop: 15,
                          resizeMode: 'contain'
                        }}
                      />
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )}
      {active === 1 && (
        <>
          <View style={{ width: '90%', marginTop: 20 }}>
            <AppButton
              title={'Create Order'}
              onPress={() => navigation.navigate('CreateOrder')}
            />
          </View>
          <View
            style={[
              styles.rowBetween,
              { width: '90%', marginTop: 20, marginBottom: 20 }
            ]}
          >
            <Text style={styles.recentText}>FAQ’s</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {filteredList?.length > 0 && (
            <Accordion
              sections={filteredList[0]?.QAlist}
              containerStyle={{ width: '100%' }}
              activeSections={activeSections}
              // renderSectionTitle={_renderSectionTitle}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              onChange={_updateSections}
            />
          )}
          {/* {filteredList.map((item, index) => (
            <TouchableOpacity
              onPress={() => handleChange('questions', item?.QAlist)}
              key={index}
              style={styles.listView}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '80%'
                }}
              >
                <Text
                  style={[
                    styles.name,
                    {
                      marginLeft: 10,
                      fontSize: hp(2),
                      color: COLORS.darkBlack
                    }
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Icon
                  name='right'
                  type='antdesign'
                  color={COLORS.darkGrey}
                  size={12}
                />
              </View>
            </TouchableOpacity>
          ))} */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Support')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: 20,
              marginBottom: 30
            }}
          >
            <SvgXml xml={handfree} />
            <Text
              style={{
                fontFamily: FONT1REGULAR,
                color: COLORS.primary,
                fontSize: hp(2),
                marginLeft: 10
              }}
            >
              Contact Support
            </Text>
          </TouchableOpacity>
        </>
      )}
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
    backgroundColor: COLORS.tripBoxBorder
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
  content: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
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
  productBox: {
    width: '90%',
    height: 50,
    borderRadius: 12,
    paddingLeft: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  productText: {
    fontSize: hp(2),
    color: COLORS.darkGrey,
    fontFamily: FONT1SEMIBOLD,
    marginLeft: 10
  },
  itemBox: {
    width: 300,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  locationText: {
    textAlign: 'center',
    width: '80%',
    fontSize: hp(1.8),
    color: COLORS.grey,
    fontFamily: FONT1REGULAR
  },
  nameText: {
    textAlign: 'center',
    width: '80%',
    fontSize: hp(2),
    color: COLORS.darkBlack,
    fontFamily: FONT1REGULAR
  },
  recentText: {
    fontSize: hp(2.5),
    color: COLORS.darkBlack,
    fontFamily: FONT1MEDIUM
  },
  viewAll: {
    textAlign: 'center',
    fontSize: hp(2),
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontFamily: FONT1REGULAR
  },
  earntext: {
    width: '80%',
    fontSize: hp(1.7),
    color: COLORS.grey,
    fontFamily: FONT1REGULAR
  },
  completetext: {
    width: '80%',
    fontSize: hp(1.7),
    color: COLORS.grey,
    fontFamily: FONT1REGULAR
  },
  timeBox: {
    paddingHorizontal: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: COLORS.card
  },
  timetext: {
    width: '80%',
    fontSize: hp(1.8),
    color: COLORS.darkBlack,
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
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  welcomeText: {
    color: COLORS.white,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.5)
  },
  titleItem: {
    color: COLORS.darkBlack,
    width: '95%',
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.2),
    marginLeft: '5%',
    marginBottom: 10,
    marginTop: 10
  },
  tabs: {
    width: '90%',
    marginTop: -25,
    borderWidth: 1,
    paddingHorizontal: 5,
    height: hp(7),
    backgroundColor: COLORS.backgroud,
    borderColor: COLORS.borderColor,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tab: {
    width: '50%',
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: '50%',
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  tabText: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  stepText: {
    color: COLORS.white,
    fontSize: hp(1.6),
    fontFamily: FONT1REGULAR
  },
  titleText: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT1BOLD
  },
  descText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT1LIGHT
  },
  activeTabText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  inavtive: {
    borderWidth: 1,
    borderColor: COLORS.white,
    width: 10,
    height: 10,
    marginRight: 5,
    borderRadius: 10
  },
  avtive: {
    borderWidth: 0,
    marginRight: 5,
    backgroundColor: COLORS.white,
    width: 10,
    height: 10,
    borderRadius: 10
  },
  tripBox: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.tripBoxBorder
  },
  userBox: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: COLORS.card,
    borderRadius: 10
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor1,
    height: 50,
    backgroundColor: COLORS.white
  }
})

export default Home
