import React from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import location from '../../assets/svg/location.svg'
import globe from '../../assets/svg/globe.svg'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import AppButton from '../AppButton'
import { useNavigation } from '@react-navigation/native'
import pinBlack from '../../assets/svg/pinBlack.svg'

export default function Step3 ({
  handleChange,
  handleSearch,
  arrival_address_country,
  arrival_address
}) {
  const navigation = useNavigation()
  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps={'handled'}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100%',
          marginVertical: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: COLORS.borderColor,
          backgroundColor: COLORS.white
        }}
      >
        <SvgXml
          xml={globe}
          fillOpacity={0.6}
          style={{ marginLeft: 10, marginTop: hp(2) }}
        />
        <GooglePlacesAutocomplete
          placeholder={arrival_address_country || 'Arrival Country'}
          fetchDetails={true}
          onPress={(data, details) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details)
            handleSearch(data, details)
          }}
          textInputProps={{
            placeholderTextColor: arrival_address_country
              ? COLORS.darkGrey
              : COLORS.placeholder,
            // value: arrival_address_country,
            onFocus: () => handleChange('isFocus', true),
            onBlur: () => handleChange('isFocus', false)
            // onChangeText: text => handleChange('arrival_address_country', text)
          }}
          styles={{
            // container: styles.textInput,
            textInput: {
              // flex: 1,
              fontSize: hp(1.8),
              backgroundColor: 'transparent',
              // width: '85%',
              height: '100%',
              color: COLORS.darkGrey,
              fontFamily: FONT1REGULAR
            },
            poweredContainer: { backgroundColor: COLORS.white },
            row: { backgroundColor: COLORS.white }
          }}
          query={{
            key: 'AIzaSyCR6w9b59vHgXUpZUhHKu8FW7NG34RiHSU',
            language: 'en'
          }}
          GooglePlacesDetailsQuery={{
            fields: 'geometry'
          }}
          filterReverseGeocodingByTypes={['country']}
          keyboardShouldPersistTaps={'handled'}
          listViewDisplayed={false}
          renderRow={data => (
            <View style={{ width: '100%' }}>
              <Text style={{ color: COLORS.black }}>{data.description}</Text>
            </View>
          )}
          debounce={200}
          currentLocation={false}
          currentLocationLabel='Current location'
          nearbyPlacesAPI='GooglePlacesSearch'
        />
      </View>
      {arrival_address ? (
        <View
          style={{
            width: '100%',
            height: 50,
            marginTop: 20,
            backgroundColor: COLORS.lightblue,
            borderRadius: 12,
            alignItems: 'center',
            paddingHorizontal: 10,
            flexDirection: 'row'
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 30,
              backgroundColor: COLORS.white,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SvgXml xml={pinBlack} />
          </View>
          <Text
            style={{
              color: COLORS.black,
              fontFamily: FONT1REGULAR,
              width: '70%'
            }}
          >
            {arrival_address?.arrival_address_street_one}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ArrivalLocation')}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 12,
                fontFamily: FONT1REGULAR,
                marginTop: 15
              }}
            >
              Change
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AppButton
          title={'Choose Delivery Address'}
          onPress={() => navigation.navigate('ArrivalLocation')}
          outlined
          backgroundColor={COLORS.white}
          prefix={<SvgXml xml={location} style={{ marginRight: 15 }} />}
        />
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
  activeTab: {
    backgroundColor: COLORS.lightblue,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginRight: 10,
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  tabText: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  menuTrigger: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  billingType: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    backgroundColor: COLORS.white,
    height: hp(6),
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
    marginTop: 5
  },
  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  expectedTime: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  menuTriggerText: {
    color: COLORS.darkGrey,
    fontSize: hp(1.8),
    fontFamily: FONT1LIGHT
  },
  inavtive: {
    marginRight: 10,
    marginVertical: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 12,
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
  profileIcon: {
    width: '40%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover'
  }
})
