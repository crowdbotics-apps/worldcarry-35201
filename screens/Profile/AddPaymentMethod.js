import React, { useCallback, useContext, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import {
  COLORS,
  FONT1BOLD,
  FONT1LIGHT,
  FONT1MEDIUM,
  FONT1SEMIBOLD,
  FONT2REGULAR
} from "../../constants"
import { AppButton, AppInput, Header } from "../../components"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Icon } from "react-native-elements"
import { AddPayMethod } from "../../api/business"
import { useFocusEffect } from "@react-navigation/native"
import Toast from "react-native-simple-toast"
import stripeIcon from "../../assets/svg/stripe.svg"
import { SvgXml } from "react-native-svg"
import { useStripe, CardField } from "@stripe/stripe-react-native"
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from "react-native-popup-menu"

function AddPaymentMethod({ navigation }) {
  const stripe = useStripe()
  // State
  const [state, setState] = useState({
    loading: false,
    modalVisible: false,
    country: "",
    paymethods: [],
    email: "",
    name: "",
    cvc: "",
    zip: "",
    date: "",
    cardNumber: "",
    cardDetails: null
  })

  const {
    modalVisible,
    country,
    loading,
    email,
    name,
    cvc,
    zip,
    date,
    cardNumber,
    cardDetails
  } = state

  useFocusEffect(
    useCallback(() => {
      // _getPayMethod()
    }, [])
  )

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handlePayment = async () => {
    try {
      handleChange("loading", true)
      stripe
        .createPaymentMethod({
          type: "Card",
          card: cardDetails,
          paymentMethodType: "Card",
          billing_details: {
            name: name,
            email: email,
            addressPostalCode: zip,
            addressCountry: country
          }
        })
        .then(result => {
          if (result?.paymentMethod?.id) {
            _AddPayMethod(result?.paymentMethod?.id)
          } else {
            alert(result.error.message)
            handleChange("loading", false)
          }
        })
    } catch (error) {
      handleChange("loading", false)
      // const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${JSON.stringify(error)}`)
    }
  }

  const _AddPayMethod = async payment_method => {
    try {
      const payload = {
        payment_method
      }
      const token = await AsyncStorage.getItem("token")
      const res = await AddPayMethod(payload, token)
      handleChange("loading", false)
      Toast.show(`Card has been added!`)
      handleChange("modalVisible", true)
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Header
        title={"Add Payment Method"}
        color={COLORS.darkBlack}
        cross
        rightEmpty
      />
      <View style={styles.mainBody}>
        <AppInput
          placeholder={"Mail ID"}
          borderColor={COLORS.borderColor1}
          inputLabel={"Email"}
          value={email}
          name={"email"}
          onChange={handleChange}
          marginBottom={20}
        />
        <View
          style={{
            width: "100%",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.borderColor1,
            backgroundColor: COLORS.white,
            height: hp(6),
            paddingHorizontal: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: hp("1%"),
            marginTop: -10
          }}
        >
          <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: "4242 4242 4242 4242"
            }}
            cardStyle={{
              backgroundColor: "#FFFFFF",
              textColor: "#000000"
            }}
            style={{
              width: "100%",
              height: hp(5.8)
            }}
            onCardChange={cardDetails => {
              // console.log('cardDetails', cardDetails)
              handleChange("cardDetails", cardDetails)
            }}
            onFocus={focusedField => {
              console.log("focusField", focusedField)
            }}
          />
        </View>
        {/* <AppInput
          marginBottom={10}
          placeholder={'Card Number'}
          value={cardNumber}
          name={'cardNumber'}
          onChange={handleChange}
          borderColor={COLORS.borderColor1}
          inputLabel={'Debit/Credit Card information'}
        />
        <View style={[styles.rowBetween, { marginBottom: 20 }]}>
          <View style={{ width: '48%' }}>
            <AppInput
              placeholder={'MM/YY'}
              value={date}
              name={'date'}
              onChange={handleChange}
              borderColor={COLORS.borderColor1}
            />
          </View>
          <View style={{ width: '48%' }}>
            <AppInput
              placeholder={'CVC'}
              value={cvc}
              name={'cvc'}
              onChange={handleChange}
              borderColor={COLORS.borderColor1}
            />
          </View>
        </View> */}
        <View style={styles.billingType}>
          <Menu
            style={{ width: "100%" }}
            rendererProps={{
              placement: "bottom"
            }}
          >
            <MenuTrigger>
              <View style={styles.menuTrigger}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.menuTriggerText}>
                    {country || "Choose Country"}
                  </Text>
                </View>
                <Icon name="down" type="antdesign" size={10} />
              </View>
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                width: "85%"
              }}
            >
              {[
                "United State",
                "Egypt",
                "Maxico",
                "United Kingdom",
                "Dubai",
                "Pakistan"
              ].map(el => (
                <MenuOption
                  key={el}
                  onSelect={() => handleChange("country", el)}
                >
                  <Text style={{ fontFamily: FONT1LIGHT }}>{el}</Text>
                </MenuOption>
              ))}
            </MenuOptions>
          </Menu>
        </View>
        <AppInput
          marginBottom={20}
          placeholder={"Enter ZIP"}
          value={zip}
          name={"zip"}
          onChange={handleChange}
          borderColor={COLORS.borderColor1}
        />
        <AppInput
          marginBottom={20}
          placeholder={"Enter name"}
          inputLabel={"Name on Card"}
          value={name}
          name={"name"}
          onChange={handleChange}
          borderColor={COLORS.borderColor1}
        />
        <AppButton
          title={"Add card"}
          onPress={handlePayment}
          loading={loading}
          disabled={!cardDetails || !country || !name || !zip || !email}
        />
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.text1}>Powered by</Text>
            <SvgXml xml={stripeIcon} />
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <TouchableOpacity>
              <Text style={[styles.text2, { marginRight: 15 }]}>Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.text2}>Privacy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        // onRequestClose={() => {
        //   setModalVisible()
        // }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.imageView}>
              {/* <SvgXml xml={cardOrange} width={50} height={50} /> */}
            </View>
            <View style={styles.textView}>
              <Text style={styles.textBold}>Credit card</Text>
              <Text style={styles.textBold}>added Successfully</Text>
              <AppButton
                title={"Done"}
                onPress={() => {
                  handleChange("modalVisible", false)
                  navigation.navigate("MyPaymentMethod", {
                    card: {
                      card: {
                        last4: cardDetails?.last4,
                        exp_month: cardDetails?.expiryMonth,
                        exp_year: cardDetails?.expiryYear,
                      },
                      billing_details: { name }
                    }
                  })
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: "100%",
    height: "100%"
  },
  mainBody: {
    width: "90%",
    marginTop: 20
  },
  name: {
    color: COLORS.darkBlack,
    fontFamily: FONT1BOLD,
    fontSize: hp(2.5)
  },
  head: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30
  },
  text: {
    color: COLORS.darkBlack,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    marginLeft: 10
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  textView: {
    width: "90%",
    alignItems: "center",
    marginTop: 20
  },
  textBold: {
    fontFamily: FONT1SEMIBOLD,
    color: COLORS.darkBlack,
    fontSize: hp(2.5),
    textAlign: "center"
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between"
  },
  text1: {
    color: COLORS.grey,
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    marginRight: 2
  },
  text2: {
    color: COLORS.grey,
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    textDecorationLine: "underline"
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  menuTriggerText: {
    color: COLORS.darkGrey,
    fontSize: hp(1.8),
    fontFamily: FONT1LIGHT
  },
  menuTrigger: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  billingType: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor1,
    backgroundColor: COLORS.white,
    height: hp(6),
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp("1%"),
    marginTop: 5
  },
  centeredView: {
    flex: 1,
    backgroundColor: COLORS.modalBG,
    justifyContent: "center",
    alignItems: "center"
  },
  imageView: {
    width: "100%",
    alignItems: "center"
  },
  modalView: {
    width: "90%",
    backgroundColor: COLORS.backgroud,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
})

export default AddPaymentMethod
