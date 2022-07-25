import React, { useState } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Modal
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import pinBlack from '../../assets/svg/pinBlack.svg'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import upload from '../../assets/svg/upload.svg'
import coverpass from '../../assets/images/coverpass.png'
import datapage from '../../assets/images/datapage.png'
import AppButton from '../AppButton'

export default function PassportStep2 ({ handleChange, _uploadImage }) {
  return (
    <ScrollView
      keyboardShouldPersistTaps={'handled'}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.head}>UPLOAD PASSPORT COVER</Text>
      <View style={styles.box}>
        <Image source={coverpass} style={styles.image} />
        <AppButton
          width={'48%'}
          title={'Upload'}
          backgroundColor={COLORS.stepGreen}
          postfix={<SvgXml xml={upload} />}
          onPress={_uploadImage}
        />
      </View>
      <Text style={styles.head}>UPLOAD PASSPORT DATA PAGE</Text>
      <View style={styles.box}>
        <Image source={datapage} style={styles.image} />
        <AppButton
          width={'48%'}
          title={'Upload'}
          backgroundColor={COLORS.stepGreen}
          postfix={<SvgXml xml={upload} />}
          onPress={_uploadImage}
        />
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
  image: {
    width: 100,
    height: 150,
    resizeMode: 'cover'
  },
  head: {
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM,
    color: COLORS.grey
  },
  box: {
    width: '100%',
    marginTop: 20,
    marginBottom:20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: COLORS.lightergrey
  }
})
