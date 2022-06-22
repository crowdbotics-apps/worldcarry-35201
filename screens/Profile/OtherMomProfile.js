import React, { useCallback, useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { Rating } from 'react-native-elements'
import { AppButton, Header, ReviewModal } from '../../components'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import AppContext from '../../store/Context'
import { useFocusEffect } from '@react-navigation/native'
import { getBuyerUser } from '../../api/buyer'

function OtherMomProfile ({ navigation, route }) {
  // Context
  const context = useContext(AppContext)
  const buyerID = route?.params?.buyerID
  const { user } = context
  const [state, setState] = useState({
    loading: false,
    openReview: false,
    buyerData: null
  })
  const { loading, openReview, buyerData } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useFocusEffect(
    useCallback(() => {
      if (buyerID) {
        _getBuyerUser()
      }
    }, [buyerID])
  )

  const _getBuyerUser = async () => {
    try {
      handleChange('loading', true)
      console.warn('buyerID', buyerID)
      const token = await AsyncStorage.getItem('token')
      const res = await getBuyerUser(buyerID, token)
      handleChange('buyerData', res?.data)
      handleChange('loading', false)
    } catch (error) {
      handleChange('loading', false)
      console.warn('err', error)
      const showWError = Object.values(error.response?.data)
      Toast.show(`Error: ${showWError[0]}`)
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={'large'} color={COLORS.secondary} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Header back />
      <View style={styles.mainBody}>
        <TouchableOpacity style={{ marginTop: -10 }}>
        </TouchableOpacity>
        <View style={styles.whiteBox}>
          <Text style={styles.text}>{'Wanda Smith'}</Text>
          <Rating
            imageSize={20}
            ratingColor='rgba(221, 193, 135, 1)'
            ratingBackgroundColor='#fff'
            type='custom'
            // onFinishRating={this.ratingCompleted}
            style={{ paddingVertical: 10 }}
          />
          <View style={[{ marginVertical: 2, width: 120 }]}>
            <AppButton title={'Message'} fontSize={hp(1.8)} />
          </View>
          <View style={styles.textLeft}>
            <Text style={styles.text}>
              Currently providing breastmilk for own baby
            </Text>
            <Text style={styles.text}>Baby is 2 months old</Text>
            <Text style={styles.text}>Not taking medication</Text>
            <Text style={styles.text}>Takes Vitamin D</Text>
          </View>
        </View>
        <View
          style={[
            styles.rowBetween,
            { justifyContent: 'center', marginTop: 10 }
          ]}
        >
          <Text style={styles.review}>Reviews</Text>
          <Rating
            imageSize={15}
            ratingColor='rgba(221, 193, 135, 1)'
            ratingBackgroundColor={COLORS.grey}
            type='custom'
            tintColor={COLORS.backgroud}
            // onFinishRating={this.ratingCompleted}
            style={{ marginTop: 10, marginHorizontal: 5 }}
          />
          <View style={[styles.confirmButton, { marginRight: 4 }]}>
            <AppButton
              paddingHorizontal={0}
              title={'See reviews'}
              height={30}
              fontSize={hp(1.8)}
            />
          </View>
          <View style={styles.confirmButton}>
            <AppButton
              paddingHorizontal={5}
              onPress={() => handleChange('openReview', true)}
              title={'Write review'}
              height={30}
              fontSize={hp(1.8)}
            />
          </View>
        </View>
        <FlatList
          data={[0, 0]}
          style={{ marginVertical: 20 }}
          renderItem={({ item, index }) => {
            return (
              <View
                key={index}
                style={[
                  styles.header,
                  {
                    backgroundColor: COLORS.backgroud
                  }
                ]}
              >
                <View style={styles.imageView}>
                  <Image source={userProfile} style={styles.image} />
                </View>
                <View style={styles.rightView}>
                  <View style={styles.rowTime}>
                    <Text
                      style={[styles.description, { fontFamily: FONT1BOLD }]}
                    >
                      Cristy Pennington
                    </Text>
                    <Text style={styles.description}>05/28/2022</Text>
                  </View>
                  <Text style={[styles.description, { marginTop: 5 }]}>
                    Comment: ludshf sldfbs flskdfbsd fkbds kdgjbd sg,kdjsb
                    sdkgjbdsg ,kgjbsdgkdsjbgdgd
                  </Text>
                  <View style={{ width: '100%', alignItems: 'flex-start' }}>
                    <Rating
                      imageSize={15}
                      ratingColor='rgba(221, 193, 135, 1)'
                      ratingBackgroundColor={COLORS.grey}
                      type='custom'
                      readonly
                      tintColor={COLORS.backgroud}
                      // onFinishRating={this.ratingCompleted}
                      style={{
                        marginTop: 10
                      }}
                    />
                  </View>
                </View>
              </View>
            )
          }}
        />
      </View>
      <ReviewModal
        modalVisible={openReview}
        setModalVisible={() => handleChange('openReview', !openReview)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: '100%',
    height: '100%',
    paddingTop: 20
  },
  textLeft: {
    width: '90%',
    marginTop: 20
  },
  mainBody: {
    width: wp('90%'),
    alignItems: 'center'
  },
  whiteBox: {
    backgroundColor: COLORS.white,
    width: '100%',
    borderRadius: 20,
    marginTop: -20,
    zIndex: -1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 30
  },
  text: {
    fontFamily: FONT1BOLD,
    fontSize: hp(2.2),
    color: COLORS.navy,
    marginBottom: 10
  },
  review: {
    fontFamily: FONT1BOLD,
    fontSize: hp(2.2),
    color: COLORS.secondary,
    marginTop: 10
  },
  confirmButton: {
    width: '30%'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  rowTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 120,
    resizeMode: 'cover'
  },
  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  label: {
    fontFamily: FONT1REGULAR,
    color: COLORS.navy,
    fontSize: hp(2.5)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  imageView: {
    width: '20%',
    marginTop: 5,
    alignItems: 'center'
  },
  rightView: {
    width: '80%'
  },
  row: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  image: {
    width: 40,
    height: 40
  },
  leftText: {
    color: COLORS.navy,
    fontSize: hp(2),
    width: '100%',
    fontFamily: FONT1BOLD
  },
  name: {
    color: COLORS.navy,
    fontSize: hp(2),
    textAlign: 'center',
    fontFamily: FONT1BOLD
  },
  description: {
    color: COLORS.navy,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2)
  },
  buttonWidth: {
    width: '40%',
    marginRight: 10
  },
  profile: {
    backgroundColor: COLORS.white,
    width: 60,
    height: 65,
    borderTopLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 50
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})

export default OtherMomProfile
