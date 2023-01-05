import React from 'react'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import weightIcon from '../../assets/svg/weight.svg'
import { useNavigation } from '@react-navigation/native'
import Jewellery from '../../assets/svg/Jewellery.svg'
import Electronics from '../../assets/svg/Electronics.svg'
import Clothes from '../../assets/svg/Clothes.svg'
import Fooditems from '../../assets/svg/Fooditems.svg'
import DocumentsBooks from '../../assets/svg/DocumentsBooks.svg'
import Medication from '../../assets/svg/Medication.svg'
import AppInput from '../AppInput'
import { Icon } from 'react-native-elements'
import { validateWeight } from '../../utils/ValidateEmail'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

export default function JourneyStep2 ({
  handleChange,
  total_weight,
  willing_to_carry,
  isNotValidWeight
}) {
  const navigation = useNavigation()
  const checkWeight = () => {
    if (!validateWeight(total_weight)) {
      handleChange('isNotValidWeight', true)
    } else {
      handleChange('isNotValidWeight', false)
    }
  }
  const products = [
    { image: Electronics, text: 'Electronics', value: 'Electronics' },
    { image: Jewellery, text: 'Jwellery', value: 'Jewelry' },
    {
      image: DocumentsBooks,
      text: 'Documents and Books',
      value: 'Documents and Books'
    },
    { image: Fooditems, text: 'Food items', value: 'Food items' },
    { image: Clothes, text: 'Clothing', value: 'Clothing' },
    { image: Medication, text: 'Medication', value: 'Medication' }
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
              backgroundColor: COLORS.white
            }
          ]}
          onPress={() => {
            if (willing_to_carry?.includes(product.value)) {
              const filtered = willing_to_carry?.filter(
                e => e !== product.value
              )
              handleChange('willing_to_carry', filtered)
            } else {
              handleChange('willing_to_carry', [
                ...willing_to_carry,
                product.value
              ])
            }
          }}
        >
          <SvgXml xml={product.image} />
          <Text
            style={[
              styles.productText,
              {
                color: COLORS.grey
              }
            ]}
          >
            {product.text}
          </Text>
          <BouncyCheckbox
            size={20}
            fillColor={COLORS.primary}
            unfillColor={COLORS.white}
            text=''
            iconStyle={{ borderColor: COLORS.primary, borderRadius: 8 }}
            textStyle={{
              fontFamily: FONT1REGULAR,
              fontSize: hp(2),
              color: COLORS.darkBlack
            }}
            style={{ right: 0, position: 'absolute' }}
            disableBuiltInState={true}
            isChecked={willing_to_carry?.includes(product.value)}
            onPress={() => {
              if (willing_to_carry?.includes(product.value)) {
                const filtered = willing_to_carry?.filter(
                  e => e !== product.value
                )
                handleChange('willing_to_carry', filtered)
              } else {
                handleChange('willing_to_carry', [
                  ...willing_to_carry,
                  product.value
                ])
              }
            }}
          />
        </TouchableOpacity>
      ))}
      <View style={{ width: '100%', marginTop: 10 }}>
        <AppInput
          placeholder={'Weight'}
          value={total_weight}
          onBlur={checkWeight}
          name={'total_weight'}
          keyboardType={'numeric'}
          maxLength={3}
          onChange={handleChange}
          returnKeyType={'done'}
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
        {isNotValidWeight && (
          <Text
            style={{
              fontFamily: FONT1REGULAR,
              color: COLORS.darkRed,
              marginTop: 10,
              fontSize: hp(1.8)
            }}
          >
            Weight is invalid
          </Text>
        )}
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
