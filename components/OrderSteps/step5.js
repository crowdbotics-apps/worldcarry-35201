import React, { useCallback } from 'react'
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import moment from 'moment'
import momenttimezone from 'moment-timezone'
import { SvgXml } from 'react-native-svg'
import AppButton from '../AppButton'
import enRoute from '../../assets/svg/enRoute.svg'
import userProfile from '../../assets/images/userProfile.png'
import { Icon } from 'react-native-elements'

export default function Step5 ({ createdOrder, navigation }) {
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

  const handlePress = useCallback(
    async url => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url)

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url)
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`)
      }
    },
    [createdOrder?.product_link]
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
      keyboardShouldPersistTaps={'handled'}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          backgroundColor: COLORS.successBG,
          borderWidth: 1,
          borderColor: COLORS.successBGBorder,
          borderRadius: 10
        }}
      >
        <Text style={styles.success}>Successfully created{'\n'}new Order.</Text>
      </View>
      <View style={{ width: '100%', alignItems: 'center', marginVertical: 20 }}>
        <View style={styles.paper}>
          <View style={[styles.rowBetween, { width: '100%' }]}>
            <View style={[styles.row, { width: '70%' }]}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginRight: 10
                }}
                source={
                  createdOrder?.user?.profile?.photo
                    ? { uri: createdOrder?.user?.profile?.photo }
                    : userProfile
                }
              />
              <View style={{ width: '100%' }}>
                <Text style={styles.nameText}>{createdOrder?.user?.name}</Text>
                <Text style={styles.postedText}>
                  Posted{' '}
                  {convertLocalDateToUTCDate(createdOrder?.created_at, true)}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', width: '20%' }}>
              <Text style={[styles.nameText, { fontSize: hp(2.4) }]}>
                ${createdOrder?.carrier_reward}
              </Text>
              <Text style={styles.postedText}>Reward</Text>
            </View>
          </View>
          <View style={styles.hline} />
          {/* <View style={[styles.row, { width: '90%' }]}>
            <Text
              style={[
                styles.nameText,
                { color: COLORS.primary, maxWidth: '40%' }
              ]}
            >
              {createdOrder?.pickup_address_country}
            </Text>
            <SvgXml xml={planIcon} />
            <Text
              style={[
                styles.nameText,
                { color: COLORS.primary, maxWidth: '60%' }
              ]}
            >
              {createdOrder?.arrival_address_country}
            </Text>
          </View> */}
          <Text style={[styles.nameText, { fontSize: hp(2.5), width: '90%' }]}>
            {createdOrder?.product_name}
          </Text>
          <Text style={styles.postedText}>
            Deliver Before :{' '}
            {moment(createdOrder?.deliver_before_date).format('DD / MM / YYYY')}
          </Text>
          {createdOrder?.product_link !== '' && (
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                height: 50,
                backgroundColor: COLORS.successBG,
                borderRadius: 30,
                marginVertical: 10
              }}
            >
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={styles.nameText}>
                  Product can buy at{' '}
                  <Text style={{ textDecorationLine: 'underline' }}>
                    {createdOrder?.product_link?.split('.com')[0].substring(12)}
                    .com
                  </Text>
                </Text>
                <Text style={[styles.nameText, { color: COLORS.primary }]}>
                  Product Rate : $
                  <Text style={{ fontFamily: FONT1MEDIUM }}>
                    {createdOrder?.product_price}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handlePress(createdOrder?.product_link)}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.white,
                  borderRadius: 40,
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
                <Icon
                  name='arrowright'
                  type='antdesign'
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.rowBetween}>
            {createdOrder?.images?.length > 0 && (
              <Image
                source={{ uri: createdOrder?.images[0]?.image }}
                style={styles.product_image}
              />
            )}
            {createdOrder?.images?.length > 1 && (
              <Image
                source={{ uri: createdOrder?.images[1]?.image }}
                style={styles.product_image}
              />
            )}
          </View>
          <View style={[styles.row, { width: '90%' }]}>
            <SvgXml xml={enRoute} />
            <View style={{ justifyContent: 'space-between', marginTop: -20 }}>
              <Text
                style={[
                  styles.nameText,
                  { color: COLORS.stepGreen, fontFamily: FONT1LIGHT }
                ]}
              >
                DELIVER FROM
              </Text>
              <Text style={[styles.nameText, { color: COLORS.darkBlack }]}>
                {createdOrder.pickup_address_country}
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
                {createdOrder.arrival_address_country}
              </Text>
            </View>
          </View>
          <AppButton
            title={'View Journeys'}
            onPress={() =>
              navigation.navigate('OrderDetails', { item: createdOrder })
            }
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '60%',
    marginTop: 20
  },
  success: {
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.2),
    textAlign: 'center',
    color: COLORS.successBGBorder
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
    width: '98%',
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
  product_image: {
    width: '48%',
    marginTop: 10,
    marginBottom: 10,
    height: 130,
    borderRadius: 10,
    resizeMode: 'cover'
  },
  hline: {
    width: '100%',
    height: 1,
    marginVertical: 10,
    backgroundColor: COLORS.tripBoxBorder
  }
})
