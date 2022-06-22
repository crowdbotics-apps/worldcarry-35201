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
import BG from '../../assets/images/BG.png'
import handShake from '../../assets/images/handShake.png'
import Plan from '../../assets/svg/plan.svg'
import userBetween from '../../assets/images/userBetween.png'
import oneWay from '../../assets/svg/oneTrip.svg'
import roundTrip from '../../assets/svg/roundTrip.svg'
import Jewellery from '../../assets/svg/Jewellery.svg'
import Electronics from '../../assets/svg/Electronics.svg'
import Clothes from '../../assets/svg/Clothes.svg'
import Fooditems from '../../assets/svg/Fooditems.svg'
import DocumentsBooks from '../../assets/svg/DocumentsBooks.svg'
import Medication from '../../assets/svg/Medication.svg'
import Box from '../../assets/svg/Box.svg'
import meetGet from '../../assets/svg/meetGet.svg'
import handfree from '../../assets/svg/handfree.svg'
import security_5 from '../../assets/svg/security_5.svg'
import Shopping_bag from '../../assets/svg/Shopping_bag.svg'
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
import { Icon } from 'react-native-elements'

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
    title: '',
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
        image: Box
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
    products,
    entries,
    activeSlide,
    active
  } = state
  const { user } = context

  useEffect(() => {}, [])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _updateSections = activeSections => {
    handleChange('activeSections', activeSections)
  }

  const _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
        <Icon name={'down'} type={'antdesign'} color={COLORS.grey} size={18} />
      </View>
    )
  }

  const _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    )
  }

  const _renderItem = ({ item, index }) => {
    return (
      <View key={index} style={[{ width: '100%', alignItems: 'center' }]}>
        <View style={[styles.slide, { backgroundColor: item.color }]}>
          <View style={{ width: '100%', alignItems: 'flex-end' }}>
            {!active && activeSlide === 2 && (
              <Image
                source={handShake}
                style={{
                  width: '70%',
                  height: 140,
                  marginTop: 0,
                  marginBottom: -30,
                  marginRight: 1
                }}
              />
            )}
            {(active || activeSlide !== 2) && (
              <SvgXml xml={item.image} width={'60%'} height={100} />
            )}
          </View>
          <View style={{ marginTop: -50, width: '80%', marginLeft: '5%' }}>
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
            Welcome <Text style={{ fontFamily: FONT1BOLD }}>Rachel!</Text>
          </Text>
          <Image source={userProfile} style={styles.userProfile} />
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
        ref={e => {
          carouselRef = e
        }}
        onSnapToItem={index =>
          setState(pre => ({ ...pre, activeSlide: index }))
        }
        data={active ? entries1 : entries}
        renderItem={_renderItem}
        sliderWidth={sliderWidth}
        itemWidth={sliderWidth}
      />
      {!active && (
        <>
          <View style={[styles.rowBetween, { width: '90%' }]}>
            <TouchableOpacity style={styles.tripBox}>
              <SvgXml xml={oneWay} />
              <Text style={[styles.nameText, { marginTop: 5 }]}>One way</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tripBox}>
              <SvgXml xml={roundTrip} />
              <Text style={[styles.nameText, { marginTop: 5 }]}>
                Round Trip
              </Text>
            </TouchableOpacity>
          </View>
          <AppButton width={'90%'} title={'Add Journey'} />
          <View
            style={[
              styles.rowBetween,
              { width: '90%', marginTop: 20, marginBottom: 20 }
            ]}
          >
            <Text style={styles.recentText}>Recently Completed</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ height: 400, marginBottom: 50 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {[0, 0, 0].map((item, index) => (
              <View key={index} style={styles.itemBox}>
                <Text style={styles.titleItem}>
                  Carry my camera from Los Angeles, CA, US to Rio De Janero
                </Text>
                <View style={styles.hline} />
                <View style={[styles.rowBetween, { width: '90%' }]}>
                  <TouchableOpacity style={styles.userBox}>
                    <Image
                      source={userProfile}
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                    />
                    <Text style={styles.nameText}>Jacob</Text>
                    <Text style={styles.locationText}>Los Angeles, CA, US</Text>
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
                      source={userProfile}
                      style={{ width: 50, height: 50, borderRadius: 50 }}
                    />
                    <Text style={styles.nameText}>Jacob</Text>
                    <Text style={styles.locationText}>Los Angeles, CA, US</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.hline} />
                <View style={[styles.rowBetween, { width: '90%' }]}>
                  <View style={{ width: '50%' }}>
                    <Text style={styles.earntext}>Earned</Text>
                    <Text style={styles.pricetext}>$245</Text>
                    <Text style={styles.completetext}>Completed on</Text>
                    <View style={styles.timeBox}>
                      <Text style={styles.timetext}>24/04/2022</Text>
                    </View>
                  </View>
                  <Image
                    source={camera}
                    style={{
                      width: '48%',
                      height: 120,
                      marginTop: 15,
                      resizeMode: 'contain'
                    }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
      {active === 1 && (
        <>
          <View
            style={[
              styles.rowBetween,
              { width: '90%', marginTop: 20, marginBottom: 20 }
            ]}
          >
            <Text style={styles.recentText}>Chose Product Type</Text>
          </View>
          {products.map((product, index) => (
            <TouchableOpacity key={index} style={styles.productBox}>
              <SvgXml xml={product.image} />
              <Text style={styles.productText}>{product.text}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ width: '90%', marginTop: -10 }}>
            <AppButton title={'Create Order'} />
          </View>
          <View
            style={[
              styles.rowBetween,
              { width: '90%', marginTop: 20, marginBottom: 20 }
            ]}
          >
            <Text style={styles.recentText}>FAQ’s</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <Accordion
            sections={SECTIONS}
            containerStyle={{ width: '100%' }}
            activeSections={activeSections}
            // renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
          />
          <TouchableOpacity
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
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  },
  titleText: {
    color: COLORS.white,
    fontSize: hp(2.8),
    fontFamily: FONT1BOLD
  },
  descText: {
    color: COLORS.white,
    fontSize: hp(2),
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
  }
})

export default Home
