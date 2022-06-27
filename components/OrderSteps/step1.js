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
import { COLORS, FONT1LIGHT, FONT1MEDIUM } from '../../constants'
import AppInput from '../AppInput'
import productName from '../../assets/svg/productName.svg'
import productPrice from '../../assets/svg/productPrice.svg'
import cardReward from '../../assets/svg/cardReward.svg'
import photoIcon from '../../assets/svg/photo.svg'
import productType from '../../assets/svg/productType.svg'
import descriptionIcon from '../../assets/svg/description.svg'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import { Icon } from 'react-native-elements'

export default function Step1 ({
  handleChange,
  expected_wait_time,
  product_type,
  avatarSourceURL,
  _uploadImage,
  product_name,
  product_price,
  carrier_reward,
  description
}) {
  const times = [
    { title: '2 weeks', value: 'Up to 2 weeks' },
    { title: '3 weeks', value: 'Up to 3 weeks' },
    { title: '1 month', value: 'Up to 1 month' },
    { title: '2 months', value: 'Up to 2 months' },
    { title: '3 months', value: 'Up to 3 months' }
  ]
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppInput
        placeholder={'Product Name'}
        value={product_name}
        name={'product_name'}
        onChange={handleChange}
        marginBottom={10}
        borderColor={COLORS.grey}
        prefix={
          <SvgXml
            xml={productName}
            fillOpacity={0.6}
            width={20}
            style={{ marginRight: 10, marginLeft: 5 }}
          />
        }
      />
      <View style={styles.billingType}>
        <Menu
          style={{ width: '100%' }}
          rendererProps={{
            placement: 'bottom'
          }}
        >
          <MenuTrigger>
            <View style={styles.menuTrigger}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgXml
                  xml={productType}
                  fillOpacity={0.6}
                  width={20}
                  style={{ marginRight: 15, marginLeft: 5 }}
                />
                <Text style={styles.menuTriggerText}>
                  {product_type || 'Product Type'}
                </Text>
              </View>
              <Icon name='down' type='antdesign' size={10} />
            </View>
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              width: '85%'
            }}
          >
            {[
              'Electronics',
              'Jewelry',
              'Documents and Books',
              'Food items',
              'Clothing',
              'Medication'
            ].map(el => (
              <MenuOption
                key={el}
                onSelect={() => handleChange('product_type', el)}
              >
                <Text style={{ fontFamily: FONT1LIGHT }}>{el}</Text>
              </MenuOption>
            ))}
          </MenuOptions>
        </Menu>
      </View>
      <AppInput
        placeholder={'Product Price'}
        value={product_price}
        keyboardType={'number-pad'}
        name={'product_price'}
        onChange={handleChange}
        borderColor={COLORS.grey}
        prefix={
          <SvgXml
            xml={productPrice}
            fillOpacity={0.6}
            width={20}
            style={{ marginRight: 10, marginLeft: 5 }}
          />
        }
        marginBottom={10}
      />
      <AppInput
        placeholder={'Carrier Reward'}
        value={carrier_reward}
        name={'carrier_reward'}
        keyboardType={'number-pad'}
        onChange={handleChange}
        borderColor={COLORS.grey}
        prefix={
          <SvgXml
            xml={cardReward}
            fillOpacity={0.6}
            width={20}
            style={{ marginRight: 10, marginLeft: 5 }}
          />
        }
        marginBottom={10}
      />
      <Text style={styles.expectedTime}>Expected wait time</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {times.map((time, index) => (
            <TouchableOpacity
              onPress={() => handleChange('expected_wait_time', time.value)}
              key={index}
              style={
                expected_wait_time === time.value
                  ? styles.activeTab
                  : styles.inavtive
              }
            >
              <Text
                style={
                  expected_wait_time === time.value
                    ? styles.activeTabText
                    : styles.tabText
                }
              >
                {time.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <AppInput
        placeholder={'Description'}
        multiline
        height={100}
        value={description}
        name={'description'}
        onChange={handleChange}
        alignItems={'flex-start'}
        borderColor={COLORS.grey}
        prefix={
          <SvgXml
            xml={descriptionIcon}
            fillOpacity={0.6}
            width={20}
            style={{ marginRight: 10, marginLeft: 5 }}
          />
        }
        marginBottom={10}
      />
      <TouchableOpacity onPress={_uploadImage}>
        <SvgXml xml={photoIcon} width={'40%'} />
      </TouchableOpacity>
      {avatarSourceURL?.map((url, index) => (
        <Image
          key={index}
          source={{ uri: url?.image || url }}
          style={styles.profileIcon}
        />
      ))}
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
