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
import AppInput from '../AppInput'
import mouseIcon from '../../assets/svg/mouse.svg'
import linkFalse from '../../assets/svg/linkFalse.svg'
import linkIcon from '../../assets/svg/link.svg'
import AppButton from '../AppButton'
import productName from '../../assets/svg/productName.svg'
import productPrice from '../../assets/svg/productPrice.svg'
import ShieldDone from '../../assets/svg/shieldDoneBLue.svg'
import photoIcon from '../../assets/svg/photo.svg'
import productType from '../../assets/svg/productType.svg'
import descriptionIcon from '../../assets/svg/description.svg'

export default function StepLink1 ({
  handleChange,
  website_name,
  product_link,
  falseLink,
  linkVerified,
  _uploadImage,
  product_type,
  avatarSourceURL,
  product_name,
  product_price,
  description
}) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {falseLink ? (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <SvgXml xml={linkFalse} style={{ marginBottom: 30, marginTop: 20 }} />
          <Text
            style={{
              fontFamily: FONT1REGULAR,
              fontSize: hp(2),
              textAlign: 'center',
              width: '80%',
              marginBottom: 20
            }}
          >
            The link you entered is not proper or the website is not available
          </Text>
          <AppButton
            title={'Retry'}
            onPress={() => handleChange('falseLink', false)}
            width={150}
            backgroundColor={COLORS.lightblue}
            color={COLORS.primary}
            borderRadius={16}
          />
        </View>
      ) : (
        <>
          {linkVerified ? (
            <View
              style={{
                width: '100%',
                marginBottom: 20,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: COLORS.lightblue
              }}
            >
              <Text
                style={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(1.8),
                  color: COLORS.primary
                }}
              >
                Your link has verified
              </Text>
              <SvgXml xml={ShieldDone} />
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                marginBottom: 20,
                borderRadius: 8,
                paddingHorizontal: 20,
                paddingVertical: 8,
                backgroundColor: COLORS.linkColor
              }}
            >
              <Text
                style={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(1.8),
                  color: COLORS.darkBlack
                }}
              >
                Please provide a correct link of a secure e-commerce platform.
              </Text>
            </View>
          )}
          <AppInput
            placeholder={'Available website Name'}
            value={website_name}
            name={'website_name'}
            onChange={handleChange}
            marginBottom={10}
            borderColor={COLORS.grey}
            prefix={
              <SvgXml
                xml={mouseIcon}
                fillOpacity={0.6}
                width={20}
                style={{ marginRight: 10, marginLeft: 5 }}
              />
            }
          />
          <AppInput
            placeholder={'Paste link'}
            value={product_link}
            name={'product_link'}
            onChange={handleChange}
            borderColor={COLORS.grey}
            prefix={
              <SvgXml
                xml={linkIcon}
                fillOpacity={0.6}
                width={20}
                style={{ marginRight: 10, marginLeft: 5 }}
              />
            }
            marginBottom={10}
          />
          {linkVerified && (
            <>
              <FlatList
                data={[...avatarSourceURL, 2]}
                numColumns={2}
                scrollEnabled={false}
                style={{ width: '100%', marginTop: 20 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item, index }) => {
                  if (index === avatarSourceURL?.length) {
                    return (
                      <TouchableOpacity
                        style={{ width: '45%', marginBottom: 20, height: 150 }}
                        onPress={_uploadImage}
                      >
                        <SvgXml
                          xml={photoIcon}
                          width={'100%'}
                          height={'100%'}
                        />
                      </TouchableOpacity>
                    )
                  } else {
                    return (
                      <Image
                        key={index}
                        source={{ uri: item?.image || item }}
                        style={styles.profileIcon}
                      />
                    )
                  }
                }}
              />

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
            </>
          )}
        </>
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
  profileIcon: {
    width: '45%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover'
  }
})
