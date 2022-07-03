import React from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  FlatList
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import location from '../../assets/svg/location.svg'
import planIcon from '../../assets/svg/plan.svg'
import OngoingIcon from '../../assets/svg/Ongoing.svg'
import moment from 'moment'

export default function JourneyStep3 ({ createdJourney }) {
  console.warn(createdJourney)
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: 'center' }}
      keyboardShouldPersistTaps={'handled'}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          width: '90%',
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          backgroundColor: COLORS.successBG,
          borderWidth: 1,
          borderColor: COLORS.successBGBorder,
          borderRadius: 10
        }}
      >
        <Text style={styles.success}>
          Successfully created{'\n'}new Journey.
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          marginTop: 20,
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        <View style={styles.paper}>
          <View style={[styles.rowBetween, { width: '100%' }]}>
            <View
              style={[styles.ongoingBox, { backgroundColor: COLORS.ongoing }]}
            >
              <SvgXml
                xml={OngoingIcon}
                style={{ marginLeft: -10, marginTop: 8 }}
              />
              <Text style={styles.nameText}>Ongoing</Text>
            </View>
          </View>
          <View style={[styles.row, { width: '90%' }]}>
            <Text
              style={[
                styles.nameText,
                { color: COLORS.primary, maxWidth: '40%' }
              ]}
            >
              {createdJourney?.departure_country}
            </Text>
            <SvgXml xml={planIcon} style={{ marginTop: 5 }} />
            <Text
              style={[
                styles.nameText,
                { color: COLORS.primary, maxWidth: '60%' }
              ]}
            >
              {createdJourney?.arrival_country}
            </Text>
          </View>
          <FlatList
            // style={{ width: '100%' }}
            data={createdJourney?.willing_to_carry}
            numColumns={2}
            renderItem={({ item: res, index }) => (
              <View
                key={index}
                style={{
                  marginRight: 10,
                  paddingHorizontal: 8,
                  height: 30,
                  borderRadius: 50,
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
          <View style={styles.hline} />
          <View style={styles.rowBetween}>
            <Text style={[styles.postedText]}>Journey Date</Text>
            <Text style={styles.nameText}>
              {moment(createdJourney?.date_of_journey).format('DD / MM / YYYY')}
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <Text style={[styles.postedText]}>Weight</Text>
            <Text style={styles.nameText}>{createdJourney?.total_weight}</Text>
          </View>
          <View style={styles.hline} />
          <View style={styles.rowBetween}>
            <Text style={[styles.postedText]}>To Deliver</Text>
            <Text style={styles.nameText}>1</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <Text style={[styles.postedText]}>Reward</Text>
            <Text style={styles.nameText}>{createdJourney?.total_weight}</Text>
          </View>
        </View>
      </View>
      {createdJourney?.type === 'Round Trip' && (
        <View
          style={{
            width: '100%',
            marginTop: 20,
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <View style={styles.paper}>
            <View style={[styles.rowBetween, { width: '100%' }]}>
              <View
                style={[styles.ongoingBox, { backgroundColor: COLORS.ongoing }]}
              >
                <SvgXml
                  xml={OngoingIcon}
                  style={{ marginLeft: -10, marginTop: 8 }}
                />
                <Text style={styles.nameText}>Ongoing</Text>
              </View>
            </View>
            <View style={[styles.row, { width: '90%' }]}>
              <Text
                style={[
                  styles.nameText,
                  { color: COLORS.primary, maxWidth: '40%' }
                ]}
              >
                {createdJourney?.arrival_country}
              </Text>
              <SvgXml xml={planIcon} style={{ marginTop: 5 }} />
              <Text
                style={[
                  styles.nameText,
                  { color: COLORS.primary, maxWidth: '60%' }
                ]}
              >
                {createdJourney?.departure_country}
              </Text>
            </View>
            <FlatList
              // style={{ width: '100%' }}
              data={createdJourney?.willing_to_carry}
              numColumns={2}
              renderItem={({ item: res, index }) => (
                <View
                  key={index}
                  style={{
                    marginRight: 10,
                    paddingHorizontal: 8,
                    height: 30,
                    borderRadius: 50,
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
            <View style={styles.hline} />
            <View style={styles.rowBetween}>
              <Text style={[styles.postedText]}>Journey Date</Text>
              <Text style={styles.nameText}>
                {moment(createdJourney?.date_of_return).format(
                  'DD / MM / YYYY'
                )}
              </Text>
            </View>
            <View style={[styles.rowBetween, { marginTop: 10 }]}>
              <Text style={[styles.postedText]}>Weight</Text>
              <Text style={styles.nameText}>
                {createdJourney?.total_weight}
              </Text>
            </View>
            <View style={styles.hline} />
            <View style={styles.rowBetween}>
              <Text style={[styles.postedText]}>To Deliver</Text>
              <Text style={styles.nameText}>1</Text>
            </View>
            <View style={[styles.rowBetween, { marginTop: 10 }]}>
              <Text style={[styles.postedText]}>Reward</Text>
              <Text style={styles.nameText}>
                {createdJourney?.total_weight}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '60%',
    marginTop: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10
  },
  type: {
    fontFamily: FONT1LIGHT,
    fontSize: hp(2),
    color: COLORS.darkGrey
  },
  value: {
    fontFamily: FONT1LIGHT,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  total: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.2),
    color: COLORS.darkBlack
  },
  totalvalue: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.5),
    color: COLORS.darkBlack
  },
  success: {
    fontFamily: FONT1REGULAR,
    fontSize: hp(2.2),
    textAlign: 'center',
    color: COLORS.successBGBorder
  },
  hline: {
    marginTop: 20,
    width: '100%',
    height: 1,
    backgroundColor: COLORS.grey
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
  ongoingBox: {
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
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
  }
})
