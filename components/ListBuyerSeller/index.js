import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Udderly from '../../assets/svg/udderly.svg'
import profileIcon from '../../assets/svg/profileIcon.svg'
import userProfile from '../../assets/images/userProfile.png'
import { SvgXml } from 'react-native-svg'
import AppButton from '../AppButton'

export default function ListBuyerSeller ({ item }) {
  const navigation = useNavigation()
  console.warn('item', item)
  return (
    <View style={[styles.header]}>
      <View style={styles.imageView}>
        <Image source={userProfile} style={styles.image} />
        <Text style={styles.name}>{item?.name}</Text>
      </View>
      <View style={styles.rightView}>
        <Text style={styles.description}>{item?.note}</Text>
        <View style={styles.row}>
          <View style={styles.buttonWidth}>
            <AppButton
              title={'See Profile'}
              onPress={() =>
                navigation.navigate('OtherMomProfile', { buyerID: item?.buyer })
              }
              height={hp(5)}
              fontSize={hp(1.8)}
            />
          </View>
          <View style={styles.buttonWidth}>
            <AppButton title={'Message'} height={hp(5)} fontSize={hp(1.8)} />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  imageView: {
    width: '20%',
    alignItems: 'center'
  },
  rightView: {
    width: '80%',
    alignItems: 'center'
  },
  row: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  image: {
    width: 50,
    height: 50
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
    fontSize: hp(2),
    width: '80%'
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
  }
})
