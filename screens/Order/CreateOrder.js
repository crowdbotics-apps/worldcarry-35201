import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import InfoCircle from '../../assets/svg/InfoCircle.svg'
import { AppButton, Header, Step1, Step2, Step3, Step4 } from '../../components'
import { COLORS, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import AppContext from '../../store/Context'
import ImagePicker from 'react-native-image-crop-picker'
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createOrder } from '../../api/order'

function CreateOrder ({ navigation }) {
  const [state, setState] = useState({
    loading: false,
    step: 0,
    expected_wait_time: '',
    product_name: '',
    product_link: '',
    product_price: '',
    carrier_reward: '',
    description: '',
    pickup_address_country: '',
    pickup_address: '',
    arrival_address: '',
    arrival_address_country: '',
    photos: [],
    avatarSourceURL: [],
    isChecked: false
  })

  // Context
  const context = useContext(AppContext)
  const {
    step,
    pickup_address_country,
    expected_wait_time,
    product_type,
    avatarSourceURL,
    pickup_address,
    arrival_address,
    arrival_address_country,
    product_name,
    product_link,
    product_price,
    carrier_reward,
    description,
    isChecked,
    photos,
    loading
  } = state
  const {
    user,
    mapLocationForPickup,
    mapLocationForArrival,
    setMapLocationForPickup,
    setMapLocationForArrival,
    _getOrders
  } = context

  useEffect(() => {
    if (mapLocationForPickup) {
      handleChange('pickup_address', mapLocationForPickup)
      setMapLocationForPickup(null)
    }
    if (mapLocationForArrival) {
      handleChange('arrival_address', mapLocationForArrival)
      setMapLocationForArrival(null)
    }
  }, [mapLocationForPickup, mapLocationForArrival])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleNext = () => {
    if (step === 0) {
      handleChange('step', 1)
    } else if (step === 1) {
      handleChange('step', 2)
    } else if (step === 2) {
      handleChange('step', 3)
    } else if (step === 3) {
      handleCreate()
    }
  }

  const handlePrevious = () => {
    if (step === 1) {
      handleChange('step', 0)
    } else if (step === 2) {
      handleChange('step', 1)
    } else if (step === 3) {
      handleChange('step', 2)
    }
  }

  const handleCreate = async () => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const formData = new FormData()
      const arrival_address_coordinates = `Point(${arrival_address?.arrival_address_coordinates?.latitude} ${arrival_address?.arrival_address_coordinates?.longitude})`
      const pickup_address_coordinates = `Point(${pickup_address?.pickup_address_coordinates?.latitude} ${pickup_address?.pickup_address_coordinates?.longitude})`
      console.warn('arrival_address', arrival_address_coordinates)
      console.warn('pickup_address', pickup_address_coordinates)
      formData.append('pickup_address_country', pickup_address_country)
      formData.append('expected_wait_time', expected_wait_time)
      formData.append('product_type', product_type)
      // formData.append('pickup_address', pickup_address)
      // formData.append('pickup_address_coordinates', pickup_address_coordinates)
      formData.append(
        'arrival_address_coordinates',
        arrival_address_coordinates
      )
      formData.append('arrival_address_country', arrival_address_country)
      formData.append('product_name', product_name)
      formData.append('product_link', product_link)
      formData.append('product_price', product_price)
      formData.append('carrier_reward', carrier_reward)
      formData.append('description', description)
      photos?.length > 0 &&
        photos?.map((photo, index) =>
          formData.append(`images[${index}]image`, photo)
        )
      const res = await createOrder(formData, token)
      _getOrders('')
      handleChange('loading', false)
      Toast.show('Order Created Successfully!')
      navigation.navigate('Orders')
    } catch (error) {
      console.warn('error', error)
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
  }

  const _uploadImage = async type => {
    handleChange('uploading', true)
    let OpenImagePicker =
      type == 'camera'
        ? ImagePicker.openCamera
        : type == ''
        ? ImagePicker.openPicker
        : ImagePicker.openPicker

    OpenImagePicker({
      width: 300,
      height: 300,
      cropping: true,
      multiple: true
    })
      .then(async response => {
        if (!response.length) {
          handleChange('uploading', false)
        } else {
          const photos = []
          const avatarSourceURLs = []
          for (let i = 0; i < response.length; i++) {
            const element = response[i]
            const uri = element.path
            const uploadUri =
              Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            const photo = {
              uri: uploadUri,
              name: `userimage${i}.png`,
              type: element.mime
            }
            photos.push(photo)
            avatarSourceURLs.push(uploadUri)
          }
          handleChange('avatarSourceURL', avatarSourceURLs)
          handleChange('photos', photos)
          handleChange('uploading', false)

          Toast.show('Photos Add Successfully')
        }
      })
      .catch(err => {
        handleChange('showAlert', false)
        handleChange('uploading', false)
      })
  }

  const handleSearch = (data, details) => {
    if (details?.geometry?.location) {
      // const region = {
      //   latitude: details?.geometry?.location.lat,
      //   longitude: details?.geometry?.location?.lng,
      //   latitudeDelta: LATITUDE_DELTA,
      //   longitudeDelta: LONGITUDE_DELTA
      // }
      handleChange('pickup_address_country', data.description)
      // handleChange('truckLocation', region)
    }
  }

  const handleSearch1 = (data, details) => {
    if (details?.geometry?.location) {
      // const region = {
      //   latitude: details?.geometry?.location.lat,
      //   longitude: details?.geometry?.location?.lng,
      //   latitudeDelta: LATITUDE_DELTA,
      //   longitudeDelta: LONGITUDE_DELTA
      // }
      handleChange('arrival_address_country', data.description)
      // handleChange('truckLocationArrival', region)
    }
  }

  const disabled =
    step === 0
      ? !product_name ||
        !product_price ||
        !product_type ||
        !carrier_reward ||
        !expected_wait_time ||
        !description ||
        avatarSourceURL.length === 0
      : step === 1
      ? !pickup_address_country || !pickup_address
      : step === 2
      ? !arrival_address || !arrival_address_country
      : !isChecked

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <Header
        title={'Create Order'}
        back
        rightItem={
          <TouchableOpacity>
            <Text style={styles.activeTabText}>Clear Form</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{ alignItems: 'center', height: '85%' }}
      >
        <View style={styles.tabs}>
          <TouchableOpacity
            // onPress={() => handleChange('active', tab?.title)}
            style={styles.activeTab}
          >
            <Text style={styles.activeTabText}>Pickup Product</Text>
          </TouchableOpacity>
          <Text style={styles.tabText}>Add Product Link</Text>
          <TouchableOpacity style={styles.infoDiv}>
            <SvgXml xml={InfoCircle} />
          </TouchableOpacity>
        </View>
        <Text style={styles.timetext}>
          {step === 0 && 'Step 1. Add Product Details'}
          {step === 1 && 'Step 2. Add Pickup Address'}
          {step === 2 && 'Step 3. Add Delivery Address'}
          {step === 3 && 'Step 4. Payment Summary'}
        </Text>
        <View style={styles.stepView}>
          <View style={step === 0 ? styles.activestep : styles.inActivestep}>
            <Text style={step === 0 ? styles.activeStepText : styles.stepText}>
              1
            </Text>
          </View>
          <View style={styles.line} />
          <View style={step === 1 ? styles.activestep : styles.inActivestep}>
            <Text style={step === 1 ? styles.activeStepText : styles.stepText}>
              2
            </Text>
          </View>
          <View style={styles.line} />
          <View style={step === 2 ? styles.activestep : styles.inActivestep}>
            <Text style={step === 2 ? styles.activeStepText : styles.stepText}>
              3
            </Text>
          </View>
          <View style={styles.line} />
          <View style={step === 3 ? styles.activestep : styles.inActivestep}>
            <Text style={step === 3 ? styles.activeStepText : styles.stepText}>
              4
            </Text>
          </View>
        </View>
        {step === 0 && (
          <Step1
            expected_wait_time={expected_wait_time}
            product_type={product_type}
            avatarSourceURL={avatarSourceURL}
            product_name={product_name}
            product_price={product_price}
            carrier_reward={carrier_reward}
            description={description}
            handleChange={handleChange}
            _uploadImage={_uploadImage}
          />
        )}
        {step === 1 && (
          <Step2
            handleSearch={handleSearch}
            pickup_address_country={pickup_address_country}
            pickup_address={pickup_address}
            handleChange={handleChange}
          />
        )}
        {step === 2 && (
          <Step3
            handleSearch={handleSearch1}
            arrival_address_country={arrival_address_country}
            arrival_address={arrival_address}
            handleChange={handleChange}
          />
        )}
        {step === 3 && (
          <Step4
            pickup_address_country={pickup_address_country}
            pickup_address={pickup_address}
            arrival_address_country={arrival_address_country}
            arrival_address={arrival_address}
            expected_wait_time={expected_wait_time}
            product_type={product_type}
            avatarSourceURL={avatarSourceURL}
            product_name={product_name}
            product_price={product_price}
            carrier_reward={carrier_reward}
            isChecked={isChecked}
            handleChange={handleChange}
          />
        )}
      </ScrollView>
      <View style={styles.bottom}>
        {step === 0 ? (
          <View style={{ width: '48%' }} />
        ) : (
          <AppButton
            title={'Previous'}
            onPress={handlePrevious}
            backgroundColor={COLORS.backgroud}
            outlined
            color={COLORS.primary}
            width={'48%'}
          />
        )}
        <AppButton
          title={step === 3 ? 'Create Order' : 'Next'}
          disabled={disabled}
          loading={loading}
          width={'48%'}
          onPress={handleNext}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: '100%',
    height: '80%'
  },
  stepView: {
    width: '90%',
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottom: {
    flexDirection: 'row',
    width: '90%',
    height: '10%',
    position: 'absolute',
    marginLeft: '5%',
    bottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activestep: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: COLORS.stepGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inActivestep: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: COLORS.backgroud,
    borderWidth: 1,
    borderColor: COLORS.stepGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeStepText: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    color: COLORS.white
  },
  stepText: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    color: COLORS.stepGreen
  },
  line: {
    width: '15F%',
    height: 1,
    backgroundColor: COLORS.stepGreen
  },
  hline: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.tripBoxBorder
  },
  bgImage: {
    width: '100%',
    alignItems: 'center',
    height: 200,
    paddingTop: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.tripBoxBorder,
    paddingHorizontal: '5%'
  },
  infoDiv: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  headerText: {
    width: '80%',
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  imgStyle: {
    width: '100%',
    height: 200,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  viewAll: {
    textAlign: 'center',
    fontSize: hp(2),
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontFamily: FONT1REGULAR
  },
  timetext: {
    textAlign: 'center',
    fontSize: hp(1.8),
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR
  },
  pricetext: {
    width: '80%',
    fontSize: hp(2.8),
    color: COLORS.darkBlack,
    fontFamily: FONT1REGULAR
  },
  slide: {
    width: '90%',
    justifyContent: 'space-between',
    height: 220,
    borderRadius: 22
  },
  userProfile: {
    borderRadius: 50,
    height: 50,
    width: 50
  },
  tabs: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: '5%',
    height: hp(7),
    marginBottom: 20
  },
  tab: {
    width: '50%',
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: COLORS.lightblue,
    borderRadius: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    height: hp(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  tabText: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },

  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  inavtive: {
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
  }
})

export default CreateOrder
