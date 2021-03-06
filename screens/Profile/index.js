import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { COLORS, FONT1MEDIUM, FONT1REGULAR, PROFILEICON } from '../../constants'
import { AppButton, Header } from '../../components'
import AppContext from '../../store/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SvgXml } from 'react-native-svg'
import pinGrey from '../../assets/svg/pinGrey.svg'
import walletIcon from '../../assets/svg/wallet.svg'
import rightIcon from '../../assets/svg/right.svg'
import Finance from '../../assets/svg/Finance.svg'
import Business from '../../assets/svg/BusinessWhite.svg'
import BusinessWhite from '../../assets/svg/Business.svg'
import MapIcon from '../../assets/svg/Map.svg'
import MapIconwhite from '../../assets/svg/MapWhite.svg'
import Financewhite from '../../assets/svg/Financewhite.svg'
import star from '../../assets/svg/star.svg'
import starWhite from '../../assets/svg/starWhite.svg'
import orderCreate from '../../assets/svg/orderCreate.svg'
import orderAmout from '../../assets/svg/orderAmout.svg'
import phoneNumber from '../../assets/svg/phoneNumber.svg'
import mail from '../../assets/svg/mail.svg'
import passport from '../../assets/svg/passport.svg'
import dollar from '../../assets/svg/dollar.svg'
import Linkedin from '../../assets/svg/linkedin.svg'
import facebookIcon from '../../assets/svg/facebookIcon.svg'
import facebookGrey from '../../assets/svg/facebookGrey.svg'
import pinBlack from '../../assets/svg/pinBlack.svg'
import insta from '../../assets/svg/insta.svg'
import orderIcon from '../../assets/svg/tabs/Work.svg'
import { Icon } from 'react-native-elements'
import { Rating } from 'react-native-ratings'

function Profile ({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const setUser = context?.setUser
  const myAddresses = context?.myAddresses
  const user = context?.user
  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
    navigation.navigate('AuthLoading')
  }

  const [state, setState] = useState({
    isActive: 'Overview',
    isMyReview: false
  })

  const { isActive, isMyReview } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  const list = [
    {
      title: 'Overview',
      icon: Business,
      iconActve: BusinessWhite,
      route: 'Account'
    },
    {
      title: 'Verifications',
      icon: Finance,
      iconActve: Financewhite,
      route: 'EditPassword'
    },
    {
      title: 'Addresses',
      icon: MapIcon,
      iconActve: MapIconwhite,
      route: 'TermsCondition'
    },
    {
      title: 'Reviews',
      icon: star,
      iconActve: starWhite,
      route: 'PrivacyPolicy'
    }
  ]
  const list1 = [
    {
      title: 'Orders Created',
      right: '32',
      icon: orderCreate,
      route: 'Account'
    },
    {
      title: 'Amount Paid',
      icon: orderAmout,
      right: '$4500'
    }
  ]
  const list2 = [
    {
      title: 'Orders Delivered',
      right: '32',
      icon: orderCreate,
      route: 'Account'
    },
    {
      title: 'Amount Rewarded',
      icon: orderAmout,
      right: '$2050'
    }
  ]

  const list3 = [
    {
      title: 'Phone Number',
      icon: phoneNumber,
      right: 'Verify',
      route: 'PhoneVerification'
    },
    {
      title: 'Passport',
      right: 'Verify',
      icon: passport,
      route: 'PassportVerification'
    },
    {
      title: 'Payment method',
      right: 'Verify',
      icon: dollar,
      route: '$4500'
    }
  ]
  const list4 = [
    {
      right: 'Verify',
      title: 'Email ID',
      icon: mail,
      right: 'Verify',
      route: 'EmailVerification'
    },
    {
      right: 'Verify',
      title: 'Facebook',
      iconActive: facebookIcon,
      icon: facebookGrey
    },
    {
      right: 'Verify',
      title: 'Instagram',
      icon: insta
    },
    {
      right: 'Verify',
      title: 'Linkedin',
      icon: Linkedin
    }
  ]

  return (
    <View style={styles.container}>
      <Header title={'Profile'} profile color={COLORS.darkBlack} />
      <ScrollView
        style={styles.mainBody}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <View
          style={{
            width: '90%',
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Image
            source={{ uri: user?.profile?.photo || PROFILEICON }}
            style={{ width: 50, height: 50, borderRadius: 50, marginRight: 10 }}
          />
          <View style={{ width: '80%' }}>
            <Text style={styles.name}>{user?.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 3,
                alignItems: 'center'
              }}
            >
              <SvgXml xml={pinGrey} />
              <Text style={styles.address}>New York, United States</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.balanceBG,
            height: 80,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginTop: 10,
            width: '90%'
          }}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}
          >
            <SvgXml xml={walletIcon} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.current}>Current Balance</Text>
              <Text style={styles.price}>$2050</Text>
            </View>
          </View>
          <SvgXml xml={rightIcon} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            width: '90%',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {list.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleChange('isActive', item.title)}
              style={{
                alignItems: 'center',
                width: '24%',
                borderRadius: 10,
                height: 70,
                justifyContent: 'center',
                backgroundColor:
                  isActive === item.title ? COLORS.primary : COLORS.white
              }}
            >
              <SvgXml
                xml={isActive === item.title ? item.iconActve : item.icon}
              />
              <Text
                style={{
                  fontFamily: FONT1REGULAR,
                  color:
                    isActive === item.title ? COLORS.white : COLORS.darkBlack,
                  fontSize: hp(1.8),
                  marginTop: 5
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.hline} />
        {isActive === 'Overview' && (
          <View style={{ width: '90%', marginBottom: 20 }}>
            <Text style={styles.head}>Sender Overview</Text>
            {list1.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 10
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '80%'
                  }}
                >
                  <SvgXml xml={item.icon} />
                  <Text
                    style={[
                      styles.name,
                      {
                        marginLeft: 10,
                        fontFamily: FONT1REGULAR,
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
                  <Text
                    style={{
                      marginRight: 5,
                      fontFamily: FONT1MEDIUM,
                      fontSize: hp(1.8),
                      color: COLORS.primary
                    }}
                  >
                    {item.right}
                  </Text>
                  <Icon
                    name='right'
                    type='antdesign'
                    color={COLORS.darkGrey}
                    size={12}
                  />
                </View>
              </View>
            ))}
            <Text style={styles.head}>Carrier Overview</Text>
            {list2.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 10
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '80%'
                  }}
                >
                  <SvgXml xml={item.icon} />
                  <Text
                    style={[
                      styles.name,
                      {
                        marginLeft: 10,
                        fontFamily: FONT1REGULAR,
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
                  <Text
                    style={{
                      marginRight: 5,
                      fontFamily: FONT1MEDIUM,
                      fontSize: hp(1.8),
                      color: COLORS.primary
                    }}
                  >
                    {item.right}
                  </Text>
                  <Icon
                    name='right'
                    type='antdesign'
                    color={COLORS.darkGrey}
                    size={12}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
        {isActive === 'Verifications' && (
          <View style={{ width: '90%', marginBottom: 20 }}>
            <Text style={styles.head}>identity verification</Text>
            {list3.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  borderWidth: 1,
                  borderColor: COLORS.borderColor1,
                  height: 50,
                  borderRadius: 10,
                  marginBottom: 10
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '80%'
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 40,
                      marginLeft: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.tripBoxBorder
                    }}
                  >
                    <SvgXml xml={item.icon} />
                  </View>
                  <Text
                    style={[
                      styles.name,
                      {
                        marginLeft: 10,
                        fontFamily: FONT1REGULAR,
                        fontSize: hp(2),
                        color: COLORS.darkBlack
                      }
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => item.route && navigation.navigate(item.route)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{
                      marginRight: 5,
                      fontFamily: FONT1MEDIUM,
                      fontSize: hp(1.8),
                      color: COLORS.primary
                    }}
                  >
                    {item.right}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.head}>Social verification</Text>
            {list4.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  borderWidth: 1,
                  borderColor: COLORS.borderColor1,
                  height: 50,
                  borderRadius: 10,
                  marginBottom: 10
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '80%'
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 40,
                      marginLeft: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        item.title === 'Facebook' || item.title === 'Linkedin'
                          ? COLORS.white
                          : COLORS.tripBoxBorder
                    }}
                  >
                    <SvgXml xml={item.icon} />
                  </View>
                  <Text
                    style={[
                      styles.name,
                      {
                        marginLeft: 10,
                        fontFamily: FONT1REGULAR,
                        fontSize: hp(2),
                        color: COLORS.darkBlack
                      }
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => item.route && navigation.navigate(item.route)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{
                      marginRight: 5,
                      fontFamily: FONT1MEDIUM,
                      fontSize: hp(1.8),
                      color: COLORS.primary
                    }}
                  >
                    {item.right}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        {isActive === 'Addresses' && (
          <View
            style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}
          >
            {myAddresses?.map((item, index) => (
              <TouchableOpacity
                onPress={() => selectLocation(item)}
                key={index}
                style={{
                  width: '90%',
                  borderWidth: 1,
                  borderColor: COLORS.borderColor,
                  borderRadius: 10,
                  marginTop: 10,
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '90%'
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      backgroundColor: COLORS.white,
                      borderWidth: 1,
                      borderColor: COLORS.borderColor,
                      marginRight: 10,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SvgXml xml={pinBlack} />
                  </View>

                  <Text
                    style={{ color: COLORS.black, fontFamily: FONT1REGULAR }}
                  >
                    {item?.city}, {item?.country}
                  </Text>
                </View>
                <Icon
                  name='dots-three-vertical'
                  type='entypo'
                  color={COLORS.darkBlack}
                  size={14}
                />
              </TouchableOpacity>
            ))}
            <View>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.name,
                    { color: COLORS.primary, marginTop: 10 }
                  ]}
                >
                  + Add new address
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {isActive === 'Reviews' && (
          <View style={{ width: '90%', alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                marginTop: 20
              }}
            >
              <TouchableOpacity
                onPress={() => handleChange('isMyReview', true)}
                style={{
                  borderBottomWidth: isMyReview ? 1 : 0,
                  height: 30,
                  width: '50%',
                  alignItems: 'center',
                  borderBottomColor: COLORS.primary
                }}
              >
                <Text
                  style={[
                    styles.name,
                    { color: isMyReview ? COLORS.primary : COLORS.grey }
                  ]}
                >
                  (12) Reviews for me
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChange('isMyReview', false)}
                style={{
                  height: 30,
                  alignItems: 'center',
                  width: '50%',
                  borderBottomWidth: isMyReview ? 0 : 1,
                  borderBottomColor: COLORS.primary
                }}
              >
                <Text
                  style={[
                    styles.name,
                    { color: !isMyReview ? COLORS.primary : COLORS.grey }
                  ]}
                >
                  (12) Reviews by me
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: COLORS.borderColor1,
                width: '100%',
                alignItems: 'center',
                padding: 5,
                marginTop: 10,
                borderRadius: 10
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.primaryLight,
                  width: '95%',
                  marginBottom: 20,
                  marginTop: 10,
                  justifyContent: 'center',
                  borderRadius: 30,
                  paddingVertical: 3
                }}
              >
                <SvgXml xml={orderIcon} width={15} />
                <Text
                  style={{
                    fontFamily: FONT1REGULAR,
                    marginLeft: 10,
                    fontSize: hp(1.8),
                    color: COLORS.primary
                  }}
                >
                  Buy me an iPhone 13 Pro max
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '95%',
                  marginBottom: 10
                }}
              >
                <Image
                  source={{ uri: PROFILEICON }}
                  style={{ width: 30, height: 30, borderRadius: 30 }}
                />
                <View style={{ alignItems: 'flex-start', marginLeft: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Text>Anna Joseph</Text>
                    <Text style={[styles.address, { marginLeft: 10 }]}>
                      3 months ago
                    </Text>
                  </View>
                  <Rating
                    type='custom'
                    readonly
                    ratingColor={COLORS.ratingColor}
                    ratingBackgroundColor={COLORS.tripBoxBorder}
                    imageSize={15}
                  />
                </View>
              </View>
              <Text
                style={[
                  styles.name,
                  { fontFamily: FONT1REGULAR, width: '95%' }
                ]}
              >
                Thank you Rachel, I won???t forget this help you have done for me.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: wp('100%'),
    height: '100%',
    alignItems: 'center'
  },
  header: {
    width: '90%'
  },
  hline: {
    width: '110%',
    marginTop: 20,
    height: 1,
    backgroundColor: COLORS.borderColor1
  },
  mainBody: {
    width: '100%'
  },
  top: { width: '100%' },
  body: {
    width: '90%',
    height: '85%',
    marginTop: 20,
    justifyContent: 'space-between'
  },
  name: {
    color: COLORS.darkBlack,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.2)
  },
  price: {
    color: COLORS.white,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.2)
  },
  current: {
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2)
  },
  head: {
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    marginVertical: 20
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 30,
    resizeMode: 'cover'
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  address: {
    fontFamily: FONT1REGULAR,
    color: COLORS.grey,
    fontSize: hp(1.8),
    marginLeft: 5
  }
})

export default Profile
