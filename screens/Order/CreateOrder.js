import React, { useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform
} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import InfoCircle from "../../assets/svg/InfoCircle.svg"
import {
  AppButton,
  Header,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  StepLink1,
  StepLink2
} from "../../components"
import { COLORS, FONT1MEDIUM, FONT1REGULAR } from "../../constants"
import AppContext from "../../store/Context"
import ImagePicker from "react-native-image-crop-picker"
import Toast from "react-native-simple-toast"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createOrder, getProductDetails } from "../../api/order"
import { getPayMethod, removePayMethod } from "../../api/business"
import RNFetchBlob from "rn-fetch-blob"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

function CreateOrder({ navigation }) {
  const [state, setState] = useState({
    loading: false,
    step: 0,
    expected_wait_time: "",
    product_name: "",
    product_link: "",
    website_name: "",
    product_price: "",
    carrier_reward: "",
    description: "",
    pickup_address_country: "",
    pickup_address: "",
    arrival_address: "",
    arrival_address_country: "",
    photos: [],
    avatarSourceURL: [],
    isChecked: false,
    loadingLink: false,
    falseLink: false,
    linkVerified: false,
    active: 0,
    stepLink: 0,
    createdOrder: null,
    paymethods: [],
    payment_method_id: ""
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
    website_name,
    product_price,
    carrier_reward,
    description,
    isChecked,
    photos,
    loading,
    active,
    stepLink,
    loadingLink,
    falseLink,
    linkVerified,
    createdOrder,
    paymethods,
    payment_method_id
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
    _getPayMethod()
    if (mapLocationForPickup) {
      handleChange("pickup_address", mapLocationForPickup)
      setMapLocationForPickup(null)
    }
    if (mapLocationForArrival) {
      handleChange("arrival_address", mapLocationForArrival)
      setMapLocationForArrival(null)
    }
  }, [mapLocationForPickup, mapLocationForArrival])

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleNext = () => {
    if (step === 0) {
      handleChange("step", 1)
    } else if (step === 1) {
      handleChange("step", 2)
    } else if (step === 2) {
      handleChange("step", 3)
    } else if (step === 3) {
      handleCreate()
    }
  }

  const handleNext1 = () => {
    if (stepLink === 0) {
      handleChange("stepLink", 1)
    } else if (stepLink === 1) {
      handleChange("stepLink", 2)
    } else if (stepLink === 2) {
      handleCreate()
    }
  }

  const handleGetProductFromLink = async () => {
    try {
      handleChange("loadingLink", true)
      const token = await AsyncStorage.getItem("token")
      const qs = `?url=${product_link}`
      const res = await getProductDetails(qs, token)
      handleChange("loadingLink", false)
      handleChange("product_name", res?.data?.data?.title)
      let p1 = res?.data?.data?.price?.replace(/\$/g, "")
      if (p1.indexOf(",") > -1) {
        p1 = p1.replace(",", "")
      }
      handleChange("product_price", p1)
      handleChange("product_type", res?.data?.data?.category)
      // handleChange('avatarSourceURL', [res?.data?.data?.image_url])
      getFileFromUrl(res?.data?.data?.image_url)
      // handleChange('photos', [res?.data?.data?.image_url])
      handleChange("falseLink", false)
      handleChange("linkVerified", true)
    } catch (error) {
      handleChange("loadingLink", false)
      handleChange("linkVerified", false)
      handleChange("falseLink", true)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
  }

  const getFileFromUrl = url => {
    RNFetchBlob.config({
      fileCache: true,
      appendExt: "png"
    })
      .fetch("GET", url, {})
      .then(res => {
        let status = res.info().status

        if (status == 200) {
          // the conversion is done in native code
          let base64Str = res.base64()
          let uri = res.path()
          const uploadUri =
            Platform.OS === "android" ? "file://" + uri : "" + uri
          const photo = {
            uri: uploadUri,
            name: `userimage.png`,
            type: "image/png"
          }
          handleChange("photos", [photo])
          handleChange("avatarSourceURL", [uploadUri])
          // the following conversions are done in js, it's SYNC
        } else {
          // handle other status codes
        }
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
      })
  }

  const handlePrevious = () => {
    if (step === 1) {
      handleChange("step", 0)
    } else if (step === 2) {
      handleChange("step", 1)
    } else if (step === 3) {
      handleChange("step", 2)
    }
  }
  const handlePrevious1 = () => {
    if (stepLink === 1) {
      handleChange("stepLink", 0)
    } else if (stepLink === 2) {
      handleChange("stepLink", 1)
    } else if (stepLink === 3) {
      handleChange("stepLink", 2)
    }
  }

  const _getPayMethod = async () => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const res = await getPayMethod(token)
      handleChange("loading", false)
      handleChange("paymethods", res?.data?.data)
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const _removePayMethod = async payment_method => {
    try {
      handleChange("loading", true)
      const payload = {
        payment_method
      }
      const token = await AsyncStorage.getItem("token")
      const res = await removePayMethod(payload, token)
      handleChange("loading", false)
      handleChange("payment_method_id", "")
      _getPayMethod()
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const handleCreate = async () => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const formData = new FormData()
      const arrival_address_coordinates = `Point(${arrival_address?.arrival_address_coordinates?.latitude} ${arrival_address?.arrival_address_coordinates?.longitude})`
      const pickup_address_coordinates = `Point(${pickup_address?.pickup_address_coordinates?.latitude} ${pickup_address?.pickup_address_coordinates?.longitude})`
      formData.append("pickup_address_country", pickup_address_country)
      formData.append("expected_wait_time", expected_wait_time)
      active === 0 && formData.append("product_type", product_type)
      formData.append("payment_method_id", payment_method_id)
      formData.append(
        "pickup_address_city",
        pickup_address?.pickup_address_street_one
      )
      // formData.append('pickup_address_coordinates', pickup_address_coordinates)
      formData.append(
        "arrival_address_coordinates",
        arrival_address_coordinates
      )
      formData.append("arrival_address_country", arrival_address_country)
      formData.append("arrival_address_city", arrival_address?.arrival_address_street_one)
      formData.append("product_name", product_name)
      formData.append("product_link", product_link)
      formData.append("product_price", product_price)
      formData.append("carrier_reward", carrier_reward)
      formData.append("description", description)
      photos?.length > 0 &&
        photos?.map((photo, index) =>
          formData.append(`images[${index}]image`, photo)
        )
      const res = await createOrder(formData, token)
      handleChange("createdOrder", res?.data)
      _getOrders(`?user=${user?.id}`)
      handleChange("loading", false)
      Toast.show("Order Created Successfully!")
      handleChange("step", 4)
      // navigation.navigate('Orders')
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${JSON.stringify(errorText[0])}`)
    }
  }
  console.warn(photos)
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim()
  }

  const _uploadImage = async type => {
    handleChange("uploading", true)
    let OpenImagePicker =
      type == "camera"
        ? ImagePicker.openCamera
        : type == ""
        ? ImagePicker.openPicker
        : ImagePicker.openPicker

    OpenImagePicker({
      width: 300,
      height: 300,
      cropping: true,
      multiple: true,
      mediaType: "photo",
      forceJpg: true
    })
      .then(async response => {
        if (!response.length) {
          handleChange("uploading", false)
        } else {
          const photos = []
          const avatarSourceURLs = []
          for (let i = 0; i < response.length; i++) {
            const element = response[i]
            const uri = element.path
            const uploadUri =
              Platform.OS === "ios" ? uri.replace("file://", "") : uri
            const photo = {
              uri: uploadUri,
              name: `userimage${i}.` + get_url_extension(uploadUri),
              // type: element.mime === "image/heic" ? 'image/jpg' : element.mime
              type: element.mime
            }
            photos.push(photo)
            avatarSourceURLs.push(uploadUri)
          }
          handleChange("avatarSourceURL", avatarSourceURLs)
          handleChange("photos", photos)
          handleChange("uploading", false)

          Toast.show("Photos Add Successfully")
        }
      })
      .catch(err => {
        handleChange("showAlert", false)
        handleChange("uploading", false)
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
      handleChange("pickup_address_country", data.description)
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
      handleChange("arrival_address_country", data.description)
      // handleChange('truckLocationArrival', region)
    }
  }

  const clearForm = () => {
    if (step === 0) {
      handleChange("product_name", "")
      handleChange("product_price", "")
      handleChange("product_type", "")
      handleChange("carrier_reward", "")
      handleChange("expected_wait_time", "")
      handleChange("description", "")
      handleChange("avatarSourceURL", [])
    } else if (step === 1) {
      handleChange("pickup_address_country", "")
      handleChange("pickup_address", "")
    } else if (step === 2) {
      handleChange("arrival_address_country", "")
      handleChange("arrival_address", "")
    } else if (step === 3) {
      handleChange("isChecked", false)
    }
  }
  const clearForm1 = () => {
    if (stepLink === 0) {
      handleChange("product_name", "")
      handleChange("website_name", "")
      handleChange("product_price", "")
      handleChange("product_type", "")
      handleChange("linkVerified", false)
      handleChange("product_link", "")
      handleChange("description", "")
      handleChange("avatarSourceURL", [])
    } else if (stepLink === 1) {
      handleChange("pickup_address_country", "")
      handleChange("pickup_address", "")
      handleChange("arrival_address_country", "")
      handleChange("arrival_address", "")
      handleChange("carrier_reward", "")
      handleChange("expected_wait_time", "")
    } else if (stepLink === 2) {
      handleChange("isChecked", false)
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
      : // !isChecked ||
        !payment_method_id
  const disabled1 =
    stepLink === 0
      ? !product_name ||
        !product_price ||
        !product_type ||
        !linkVerified ||
        !product_link ||
        !description ||
        avatarSourceURL.length === 0
      : stepLink === 1
      ? !pickup_address_country ||
        !pickup_address ||
        !arrival_address ||
        !carrier_reward ||
        !expected_wait_time ||
        !arrival_address_country
      : // !isChecked ||
        !payment_method_id

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Header
        title={step === 4 ? "Order Created" : "Create Order"}
        color={COLORS.darkBlack}
        back
        rightItem={
          (step === 4 || (stepLink !== 2 && step !== 3)) && (
            <TouchableOpacity
              onPress={() =>
                stepLink === 3 || step === 4
                  ? navigation.navigate("Orders")
                  : active === 0
                  ? clearForm()
                  : clearForm1()
              }
            >
              <Text style={styles.activeTabText}>
                {stepLink === 3 || step === 4 ? "Done" : "Clear Form"}
              </Text>
            </TouchableOpacity>
          )
        }
      />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{
          alignItems: "center",
          height: step < 4 ? "85%" : "100%"
        }}
      >
        {step === 4 ? (
          <Step5 navigation={navigation} createdOrder={createdOrder} />
        ) : (
          <>
            <View style={styles.tabs}>
              <TouchableOpacity
                onPress={() => handleChange("active", 0)}
                style={active ? styles.inavtive : styles.activeTab}
              >
                <Text style={active ? styles.tabText : styles.activeTabText}>
                  Pickup Product
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChange("active", 1)}
                style={!active ? styles.inavtive : styles.activeTab}
              >
                <Text style={active ? styles.activeTabText : styles.tabText}>
                  Add Product Link
                </Text>
              </TouchableOpacity>
              <View style={{ width: 50 }} />
              {/* <TouchableOpacity style={styles.infoDiv}>
                <SvgXml xml={InfoCircle} />
              </TouchableOpacity> */}
            </View>
            {active === 0 ? (
              <>
                <Text style={styles.timetext}>
                  {step === 0 && "Step 1. Add Product Details"}
                  {step === 1 && "Step 2. Add Pickup Address"}
                  {step === 2 && "Step 3. Add Delivery Address"}
                  {step === 3 && "Step 4. Payment Summary"}
                </Text>
                <View style={styles.stepView}>
                  <View
                    style={step === 0 ? styles.activestep : styles.inActivestep}
                  >
                    <Text
                      style={
                        step === 0 ? styles.activeStepText : styles.stepText
                      }
                    >
                      1
                    </Text>
                  </View>
                  <View style={styles.line} />
                  <View
                    style={step === 1 ? styles.activestep : styles.inActivestep}
                  >
                    <Text
                      style={
                        step === 1 ? styles.activeStepText : styles.stepText
                      }
                    >
                      2
                    </Text>
                  </View>
                  <View style={styles.line} />
                  <View
                    style={step === 2 ? styles.activestep : styles.inActivestep}
                  >
                    <Text
                      style={
                        step === 2 ? styles.activeStepText : styles.stepText
                      }
                    >
                      3
                    </Text>
                  </View>
                  <View style={styles.line} />
                  <View
                    style={step === 3 ? styles.activestep : styles.inActivestep}
                  >
                    <Text
                      style={
                        step === 3 ? styles.activeStepText : styles.stepText
                      }
                    >
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
                    navigation={navigation}
                    paymethods={paymethods}
                    _getPayMethod={_getPayMethod}
                    payment_method_id={payment_method_id}
                    product_name={product_name}
                    product_price={product_price}
                    carrier_reward={carrier_reward}
                    isChecked={isChecked}
                    _removePayMethod={_removePayMethod}
                    handleChange={handleChange}
                  />
                )}
              </>
            ) : (
              <>
                <Text style={styles.timetext}>
                  {stepLink === 0 && "Step 1. Add Product via link"}
                  {stepLink === 1 && "Step 2. Add Pickup Address"}
                  {stepLink === 2 && "Step 3. Add Delivery Address"}
                </Text>
                <View style={styles.stepView}>
                  <View
                    style={
                      stepLink === 0 ? styles.activestep : styles.inActivestep
                    }
                  >
                    <Text
                      style={
                        stepLink === 0 ? styles.activeStepText : styles.stepText
                      }
                    >
                      1
                    </Text>
                  </View>
                  <View style={styles.line} />
                  <View
                    style={
                      stepLink === 1 ? styles.activestep : styles.inActivestep
                    }
                  >
                    <Text
                      style={
                        stepLink === 1 ? styles.activeStepText : styles.stepText
                      }
                    >
                      2
                    </Text>
                  </View>
                  <View style={styles.line} />
                  <View
                    style={
                      stepLink === 2 ? styles.activestep : styles.inActivestep
                    }
                  >
                    <Text
                      style={
                        stepLink === 2 ? styles.activeStepText : styles.stepText
                      }
                    >
                      3
                    </Text>
                  </View>
                </View>
                {stepLink === 0 && (
                  <StepLink1
                    website_name={website_name}
                    product_link={product_link}
                    product_type={product_type}
                    avatarSourceURL={avatarSourceURL}
                    product_name={product_name}
                    product_price={product_price}
                    description={description}
                    falseLink={falseLink}
                    linkVerified={linkVerified}
                    _uploadImage={_uploadImage}
                    handleChange={handleChange}
                  />
                )}
                {stepLink === 1 && (
                  <StepLink2
                    handleSearch={handleSearch}
                    handleSearch1={handleSearch1}
                    expected_wait_time={expected_wait_time}
                    arrival_address_country={arrival_address_country}
                    arrival_address={arrival_address}
                    pickup_address_country={pickup_address_country}
                    pickup_address={pickup_address}
                    carrier_reward={carrier_reward}
                    handleChange={handleChange}
                  />
                )}
                {stepLink === 2 && (
                  <Step4
                    pickup_address_country={pickup_address_country}
                    pickup_address={pickup_address}
                    arrival_address_country={arrival_address_country}
                    arrival_address={arrival_address}
                    expected_wait_time={expected_wait_time}
                    product_type={product_type}
                    avatarSourceURL={avatarSourceURL}
                    product_name={product_name}
                    paymethods={paymethods}
                    _getPayMethod={_getPayMethod}
                    payment_method_id={payment_method_id}
                    navigation={navigation}
                    product_price={product_price}
                    carrier_reward={carrier_reward}
                    isChecked={isChecked}
                    _removePayMethod={_removePayMethod}
                    handleChange={handleChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </KeyboardAwareScrollView>
      {step < 4 && (
        <>
          {active ? (
            <View style={styles.bottom}>
              {stepLink === 0 ? (
                <View style={{ width: "48%" }} />
              ) : (
                <AppButton
                  title={"Previous"}
                  onPress={handlePrevious1}
                  backgroundColor={COLORS.backgroud}
                  outlined
                  color={COLORS.primary}
                  width={"48%"}
                />
              )}
              {stepLink === 0 && !linkVerified ? (
                <AppButton
                  title={"Detect Product"}
                  disabled={!website_name || !product_link}
                  onPress={handleGetProductFromLink}
                  backgroundColor={COLORS.backgroud}
                  outlined
                  loading={loadingLink}
                  color={COLORS.primary}
                  width={"48%"}
                />
              ) : (
                <AppButton
                  title={stepLink === 2 ? "Create Order" : "Next"}
                  disabled={disabled1}
                  loading={loading}
                  width={"48%"}
                  onPress={handleNext1}
                />
              )}
            </View>
          ) : (
            <View style={styles.bottom}>
              {step === 0 ? (
                <View style={{ width: "48%" }} />
              ) : (
                <AppButton
                  title={"Previous"}
                  onPress={handlePrevious}
                  backgroundColor={COLORS.backgroud}
                  outlined
                  color={COLORS.primary}
                  width={"48%"}
                />
              )}
              <AppButton
                title={step === 3 ? "Create Order" : "Next"}
                disabled={disabled}
                loading={loading}
                width={"48%"}
                onPress={handleNext}
              />
            </View>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: "100%",
    height: "80%"
  },
  stepView: {
    width: "90%",
    marginTop: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  bottom: {
    flexDirection: "row",
    width: "90%",
    height: "10%",
    position: "absolute",
    marginLeft: "5%",
    bottom: 20,
    justifyContent: "space-between",
    alignItems: "center"
  },
  activestep: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: COLORS.stepGreen,
    alignItems: "center",
    justifyContent: "center"
  },
  inActivestep: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: COLORS.backgroud,
    borderWidth: 1,
    borderColor: COLORS.stepGreen,
    alignItems: "center",
    justifyContent: "center"
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
    width: "15F%",
    height: 1,
    backgroundColor: COLORS.stepGreen
  },
  hline: {
    width: "100%",
    height: 2,
    backgroundColor: COLORS.tripBoxBorder
  },
  bgImage: {
    width: "100%",
    alignItems: "center",
    height: 200,
    paddingTop: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  header: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.tripBoxBorder,
    paddingHorizontal: "5%"
  },
  infoDiv: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  headerText: {
    width: "80%",
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  imgStyle: {
    width: "100%",
    height: 200,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  viewAll: {
    textAlign: "center",
    fontSize: hp(2),
    color: COLORS.primary,
    textDecorationLine: "underline",
    fontFamily: FONT1REGULAR
  },
  timetext: {
    textAlign: "center",
    fontSize: hp(1.8),
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR
  },
  pricetext: {
    width: "80%",
    fontSize: hp(2.8),
    color: COLORS.darkBlack,
    fontFamily: FONT1REGULAR
  },
  slide: {
    width: "90%",
    justifyContent: "space-between",
    height: 220,
    borderRadius: 22
  },
  userProfile: {
    borderRadius: 50,
    height: 50,
    width: 50
  },
  tabs: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: "5%",
    height: hp(7),
    marginBottom: 20
  },
  tab: {
    width: "50%",
    alignItems: "center"
  },
  activeTab: {
    backgroundColor: COLORS.lightblue,
    borderRadius: 12,
    paddingHorizontal: 8,
    justifyContent: "center",
    height: hp(5),
    alignItems: "center",
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
    justifyContent: "center",
    height: hp(5),
    alignItems: "center"
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
