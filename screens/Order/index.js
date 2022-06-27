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

function Order ({ navigation }) {
  const [state, setState] = useState({
    loading: false,
    active: 'Requested'
  })

  // Context
  const context = useContext(AppContext)
  const { active } = state
  const { user } = context

  useEffect(() => {}, [])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const tabs = [
    { title: 'Requested' },
    { title: 'In Transit' },
    { title: 'Recieved' },
    { title: 'Inactive' }
  ]

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header
        title={'Orders'}
        rightItem={
          <AppButton width={80} height={hp(5)} marginTop={1} title={'+ Add'} />
        }
      />
      <ScrollView
        style={styles.tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            onPress={() => handleChange('active', tab?.title)}
            key={index}
            style={active === tab.title ? styles.activeTab : styles.inavtive}
          >
            <Text
              style={
                active === tab.title ? styles.activeTabText : styles.tabText
              }
            >
              0 {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <SvgXml xml={NoOrder} />
      <Text style={styles.timetext}>You don’t have new order requests</Text>
      <AppButton
        title={'Create Order'}
        onPress={() => navigation.navigate('CreateOrder')}
        width={150}
        color={COLORS.primary}
        backgroundColor={COLORS.lightblue}
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

export default Order
