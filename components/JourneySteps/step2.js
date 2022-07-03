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
import {
  COLORS,
  FONT1LIGHT,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD
} from '../../constants'
import weightIcon from '../../assets/svg/weight.svg'
import globe from '../../assets/svg/globe.svg'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import AppButton from '../AppButton'
import { useNavigation } from '@react-navigation/native'
import pinBlack from '../../assets/svg/pinBlack.svg'
import Jewellery from '../../assets/svg/Jewellery.svg'
import Electronics from '../../assets/svg/Electronics.svg'
import Clothes from '../../assets/svg/Clothes.svg'
import Fooditems from '../../assets/svg/Fooditems.svg'
import DocumentsBooks from '../../assets/svg/DocumentsBooks.svg'
import Medication from '../../assets/svg/Medication.svg'
import AppInput from '../AppInput'
import { Icon } from 'react-native-elements'
export default function JourneyStep2 ({
  handleChange,
  total_weight,
  willing_to_carry
}) {
  const navigation = useNavigation()
  const products = [
    { image: Electronics, text: 'Electronics' },
    { image: Jewellery, text: 'Jewelry' },
    { image: DocumentsBooks, text: 'Documents and Books' },
    { image: Fooditems, text: 'Food items' },
    { image: Clothes, text: 'Clothing' },
    { image: Medication, text: 'Medication' }
  ]
  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps={'handled'}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.rowBetween,
          { width: '90%', marginTop: 20, marginBottom: 20 }
        ]}
      >
        <Text style={styles.recentText}>I am willing to carry,</Text>
      </View>
      {products.map((product, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.productBox,
            {
              backgroundColor: willing_to_carry?.includes(product.text)
                ? COLORS.primary
                : COLORS.white
            }
          ]}
          onPress={() => {
            if (willing_to_carry?.includes(product.text)) {
              const filtered = willing_to_carry?.filter(e => e !== product.text)
              handleChange('willing_to_carry', filtered)
            } else {
              handleChange('willing_to_carry', [
                ...willing_to_carry,
                product.text
              ])
            }
          }}
        >
          <SvgXml xml={product.image} />
          <Text
            style={[
              styles.productText,
              {
                color: willing_to_carry?.includes(product.text)
                  ? COLORS.white
                  : COLORS.grey
              }
            ]}
          >
            {product.text}
          </Text>
        </TouchableOpacity>
      ))}
      <View style={{ width: '100%', marginTop: 10 }}>
        <AppInput
          placeholder={'Weight'}
          value={total_weight}
          name={'total_weight'}
          onChange={handleChange}
          borderColor={COLORS.borderColor}
          postfix={
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text
                style={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(1.8),
                  color: COLORS.grey,
                  marginRight: 5
                }}
              >
                Kg
              </Text>
              <Icon
                name={'down'}
                type={'antdesign'}
                size={14}
                color={COLORS.grey}
              />
            </TouchableOpacity>
          }
          prefix={<SvgXml xml={weightIcon} />}
          inputLabel={'of a total weight,'}
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
  productBox: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.white,
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
  recentText: {
    fontSize: hp(2),
    color: COLORS.darkBlack,
    fontFamily: FONT1REGULAR
  },
  productText: {
    fontSize: hp(2),
    color: COLORS.darkGrey,
    fontFamily: FONT1SEMIBOLD,
    marginLeft: 10
  }
})
