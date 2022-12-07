import React, { useState, useEffect, useContext, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  TextInput
} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { Icon } from "react-native-elements"
import {
  COLORS,
  FONT1BOLD,
  FONT1LIGHT,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD
} from "../../constants"
import { AppButton, AppInput } from "../../components"
import { loginUser, signupUser } from "../../api/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AppContext from "../../store/Context"
import Toast from "react-native-simple-toast"
import { SvgXml } from "react-native-svg"
import logo from "../../assets/svg/logo.svg"
import facebook from "../../assets/images/facebook.png"
import apple from "../../assets/images/apple.png"
import google from "../../assets/images/google.png"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { LoginManager, AccessToken } from "react-native-fbsdk"
import { appleAuth } from "@invertase/react-native-apple-authentication"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { API_URL } from "../../api/config"
import { validateEmail, validateName } from "../../utils/ValidateEmail"

function LoginScreen({ navigation, route }) {
  const isType = route?.params?.isType
  let passwordRef = useRef()
  let emailRef = useRef()
  let password1Ref = useRef()
  let password2Ref = useRef()
  // Context
  const context = useContext(AppContext)
  const { setUser, requestUserPermission } = context

  const [state, setState] = useState({
    email: "",
    name: "",
    last_name: "",
    phone: "",
    password: "",
    confirm_password: "",
    isEmailValid: false,
    invalidPass: false,
    loading: false,
    showPassword: false,
    isChecked: false,
    showConfirmPassword: false,
    active: isType || 0,
    isAdmin: false
  })

  const {
    loading,
    showPassword,
    confirm_password,
    phone,
    password,
    active,
    invalidPass,
    showConfirmPassword,
    name,
    isChecked,
    email
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleLogin = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        email,
        password
      }
      const res = await loginUser(payload)
      if (isChecked) {
        await AsyncStorage.setItem("email", email)
        await AsyncStorage.setItem("password", password)
      } else {
        await AsyncStorage.removeItem("email")
        await AsyncStorage.removeItem("password")
      }
      handleChange("loading", false)
      setUser(res?.data?.user)
      console.warn("loginUser", res?.data)
      await AsyncStorage.setItem("token", res?.data?.token)
      await AsyncStorage.setItem("user", JSON.stringify(res?.data?.user))
      requestUserPermission(true)
      navigation.navigate("AuthLoading")
      Toast.show("Logged in Successfully!")
    } catch (error) {
      handleChange("loading", false)
      console.warn("err", error)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
  }

  const _isEmailValid = () => {
    if (email) {
      const isValid = validateEmail(email)
      if (!isValid) {
        handleChange("email", "")
        Toast.show("Email is not valid!")
      } else {
        handleChange("isEmailValid", true)
      }
    }
  }

  const _isNameValid = () => {
    if (onlySpaces(name)) {
      Toast.show("Please enter name", Toast.LONG)
      handleChange("name", "")
      return
    }
    if (name) {
      const isValid = validateName(name)
      if (!isValid) {
        handleChange("name", "")
        Toast.show("Username is not valid!")
      }
    }
  }

  useEffect(async () => {
    const email = await AsyncStorage.getItem("email")
    const password = await AsyncStorage.getItem("password")
    if (email) {
      handleChange("email", email)
    }
    if (password) {
      handleChange("password", password)
    }
  }, [])

  function onlySpaces(str) {
    return /^\s*$/.test(str)
  }

  const handleSignup = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        name,
        email,
        phone,
        password
      }

      const res = await signupUser(payload)
      if (isChecked) {
        await AsyncStorage.setItem("email", email)
        await AsyncStorage.setItem("password", password)
      } else {
        await AsyncStorage.removeItem("email")
        await AsyncStorage.removeItem("password")
      }
      handleChange("loading", false)
      setUser(res?.data?.user)
      await AsyncStorage.setItem("token", res?.data?.token)
      await AsyncStorage.setItem("user", JSON.stringify(res?.data?.user))
      navigation.navigate("AuthLoading")
      requestUserPermission(true)
      Toast.show("Signed up Successfully!")
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText[0]}`)
    }
  }

  const handleFacebook = async () => {
    // try {
    handleChange("loading", true)
    LoginManager.logOut()
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email"
    ])
    console.warn("data", result)
    if (result.isCancelled) {
      alert("User cancelled the login process")
      handleChange("loading", false)
      return
    }
    const data = await AccessToken.getCurrentAccessToken()

    console.warn("data", data)
    if (!data) {
      Toast.show("Something went wrong obtaining access token")
      handleChange("loading", false)
      return
    }
    const payload = {
      access_token: data.accessToken
    }
    const headers = {
      "content-type": "application/json"
    }
    // const res = facebookLoginUser(payload)
    fetch(API_URL() + "modules/social-auth/facebook/login/", {
      method: "POST", // or 'PUT'
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(async res => {
        console.log("Success:", res)
        if (
          JSON.stringify(res)?.includes(
            "User is already registered with this e-mail address."
          )
        ) {
          handleChange("loading", false)
          alert(
            "User is already registered with this e-mail address. Please login with manually or Google Login!"
          )
          return
        }
        if (res?.user) {
          console.warn("res?.user", res?.user)
          handleChange("loading", false)
          requestUserPermission(true)
          setUser(res?.user)
          await AsyncStorage.setItem("token", res?.token)
          await AsyncStorage.setItem("user", JSON.stringify(res?.user))
          navigation.navigate("AuthLoading")
          Toast.show("Logged in Successfully!")
        } else {
          console.warn("else res", res)
          handleChange("loading", false)
          Toast.show("Something went wrong!")
        }
      })
      .catch(error => {
        handleChange("loading", false)
        console.warn("err", error)
        Toast.show(`Error: ${error.message}`)
      })
      .catch(error => {
        handleChange("loading", false)
        console.warn("errss", error)
        Toast.show(`Error: ${error.message}`)
      })
  }

  function _configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        "487069185100-qsifiakpmm7s8rltmmodipk8klifbbql.apps.googleusercontent.com",
      iosClientId:
        "487069185100-4311thbhtrlpcbi5ukenhhnhikff0a5l.apps.googleusercontent.com",
      offlineAccess: false
    })
  }

  useEffect(() => {
    _configureGoogleSignIn()
  }, [])

  const handleApple = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    })
    if (appleAuthRequestResponse?.identityToken) {
      const payload = {
        access_token: appleAuthRequestResponse.authorizationCode,
        id_token: appleAuthRequestResponse.identityToken
      }
      const headers = {
        "content-type": "application/json"
      }
      fetch(API_URL() + "modules/social-auth/apple/login/", {
        method: "POST", // or 'PUT'
        headers: headers,
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(async res => {
          console.log("Success:", res)
          if (
            JSON.stringify(res)?.includes(
              "User is already registered with this e-mail address."
            )
          ) {
            handleChange("loading", false)
            alert(
              "User is already registered with this e-mail address. Please login with manually or Social Logins!"
            )
            return
          }
          if (res?.user) {
            handleChange("loading", false)
            setUser(res?.user)
            requestUserPermission(true)
            await AsyncStorage.setItem("token", res?.token)
            await AsyncStorage.setItem("user", JSON.stringify(res?.user))
            navigation.navigate("AuthLoading")
            Toast.show("Logged in Successfully!")
          } else {
            console.warn("else res", res)
            handleChange("loading", false)
            Toast.show("Something went wrong!")
          }
        })
        .catch(error => {
          handleChange("loading", false)
          console.warn("errcaaaaa", error)
          Toast.show(`Error: ${error.message}`)
        })
        .catch(error => {
          handleChange("loading", false)
          console.warn("errss", error)
          Toast.show(`Error: ${error.message}`)
        })
    }
  }

  const handleGoogle = async () => {
    // try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    const userInfo = await GoogleSignin.signIn()
    const userInfoToken = await GoogleSignin.getTokens()
    const payload = {
      type: "Client",
      access_token: userInfoToken.accessToken
    }
    const headers = {
      "content-type": "application/json"
    }
    fetch(API_URL() + "modules/social-auth/google/login/", {
      method: "POST", // or 'PUT'
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(async res => {
        console.log("Success:", res)
        if (
          JSON.stringify(res)?.includes(
            "User is already registered with this e-mail address."
          )
        ) {
          handleChange("loading", false)
          alert(
            "User is already registered with this e-mail address. Please login with manually or Facebook Login!"
          )
          return
        }
        if (res?.user) {
          handleChange("loading", false)
          setUser(res?.user)
          requestUserPermission(true)
          await AsyncStorage.setItem("token", res?.token)
          await AsyncStorage.setItem("user", JSON.stringify(res?.user))
          navigation.navigate("AuthLoading")
          Toast.show("Logged in Successfully!")
        } else {
          console.warn("else res", res)
          handleChange("loading", false)
          Toast.show("Something went wrong!")
        }
      })
      .catch(error => {
        handleChange("loading", false)
        console.warn("err", error)
        Toast.show(`Error: ${error.message}`)
      })
      .catch(error => {
        handleChange("loading", false)
        console.warn("errss", error)
        Toast.show(`Error: ${error.message}`)
      })
  }

  const checkPass = () => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    if (regex.test(password)) {
      if (password != "") {
        handleChange("invalidPass", false)
      } else {
        handleChange("password", "")
      }
    } else {
      handleChange("invalidPass", true)
    }
  }

  return (
    // <View style={styles.container}>
    <KeyboardAwareScrollView
      style={styles.container}
      enableAutomaticScroll={true}
      onScrollAnimationEnd
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={{
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <View style={styles.top}>
        <SvgXml xml={logo} width={100} style={{ marginBottom: 20 }} />
        <View style={[styles.tabs, { justifyContent: "center" }]}>
          <TouchableOpacity
            style={active === 0 ? styles.activeTab : styles.tab}
            onPress={() => handleChange("active", 0)}
          >
            <Text style={active === 0 ? styles.activeTabText : styles.tabText}>
              {"Login"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={active === 1 ? styles.activeTab : styles.tab}
            onPress={() => handleChange("active", 1)}
          >
            <Text style={active === 1 ? styles.activeTabText : styles.tabText}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>
        {/* {active === 0 && ( */}
        <Text style={styles.loginText}>
          {active ? "Create " : "Login "}
          <Text style={{ color: COLORS.darkBlack }}>
            {active ? "New" : "to your"}
            {"\n"}Account
          </Text>
        </Text>
        {/* )} */}
        {active === 0 ? (
          <>
            <View style={styles.textInputContainer}>
              <TextInput
                onSubmitEditing={() =>
                  passwordRef.current && passwordRef.current?.focus()
                }
                placeholder={"Email"}
                returnKeyType="go"
                caretHidden={false}
                keyboardType={"email-address"}
                autoFocus={true}
                value={email}
                onBlur={_isEmailValid}
                autoCapitalize="none"
                onChangeText={text => handleChange("email", text)}
                placeholderTextColor={COLORS.navy}
                style={styles.textInput}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                label={"Your password"}
                placeholder={"Your password"}
                ref={passwordRef}
                onBlur={checkPass}
                style={styles.textInput}
                onChangeText={text => handleChange("password", text)}
                value={password}
                placeholderTextColor={COLORS.navy}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => handleChange("showPassword", !showPassword)}
              >
                {showPassword ? (
                  <Icon
                    name={"eye-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                ) : (
                  <Icon
                    name={"eye-off-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>
            {invalidPass && (
              <View style={styles.textFieldContainer}>
                <Text style={styles.errorText}>
                  Password at least 8 characters which contain at least one
                  lowercase letter, one uppercase letter, one numeric digit, and
                  one special character
                </Text>
              </View>
            )}
            <View style={{ width: "90%" }}>
              <BouncyCheckbox
                size={20}
                fillColor={COLORS.primary}
                unfillColor={COLORS.white}
                disableBuiltInState
                isChecked={isChecked}
                text="Keep me logged in"
                iconStyle={{ borderColor: COLORS.primary, borderRadius: 8 }}
                textStyle={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(2),
                  color: COLORS.darkBlack,
                  textDecorationLine: "none"
                }}
                onPress={() => handleChange("isChecked", !isChecked)}
              />
            </View>
            <View style={styles.buttonWidth}>
              <AppButton
                title={"Login"}
                loading={loading}
                disabled={!email || !password}
                onPress={handleLogin}
              />
            </View>
            <View style={[styles.remeberContainer, { marginBottom: 10 }]}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.textInputContainer}>
              <TextInput
                onSubmitEditing={() =>
                  emailRef.current && emailRef.current?.focus()
                }
                placeholder={"Name"}
                returnKeyType="go"
                caretHidden={false}
                keyboardType={"email-address"}
                autoFocus={true}
                value={name}
                onBlur={_isNameValid}
                autoCapitalize="none"
                onChangeText={text => handleChange("name", text)}
                placeholderTextColor={COLORS.navy}
                style={styles.textInput}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                onSubmitEditing={() =>
                  password1Ref.current && password1Ref.current?.focus()
                }
                ref={emailRef}
                caretHidden={false}
                placeholder={"Email"}
                returnKeyType="go"
                keyboardType={"email-address"}
                value={email}
                onBlur={_isEmailValid}
                autoCapitalize="none"
                onChangeText={text => handleChange("email", text)}
                placeholderTextColor={COLORS.navy}
                style={styles.textInput}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                label={"Create password"}
                ref={password1Ref}
                onSubmitEditing={() =>
                  password2Ref.current && password2Ref.current?.focus()
                }
                placeholder={"Create password"}
                onBlur={checkPass}
                value={password}
                style={styles.textInput}
                placeholderTextColor={COLORS.navy}
                onChangeText={text => handleChange("password", text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => handleChange("showPassword", !showPassword)}
              >
                {showPassword ? (
                  <Icon
                    name={"eye-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                ) : (
                  <Icon
                    name={"eye-off-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>
            {invalidPass && (
              <View style={styles.textFieldContainer}>
                <Text style={styles.errorText}>
                  Password at least 8 characters which contain at least one
                  lowercase letter, one uppercase letter, one numeric digit, and
                  one special character
                </Text>
              </View>
            )}
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder={"Confirm new password"}
                ref={password2Ref}
                value={confirm_password}
                style={styles.textInput}
                onChangeText={text => handleChange("confirm_password", text)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  handleChange("showConfirmPassword", !showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <Icon name={"eye-outline"} type={"ionicon"} size={20} />
                ) : (
                  <Icon
                    name={"eye-off-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>
            {confirm_password && password !== confirm_password ? (
              <View style={styles.textFieldContainer}>
                <Text style={styles.errorText}>Password doesn't match</Text>
              </View>
            ) : null}
            <View style={{ width: "90%" }}>
              <BouncyCheckbox
                size={20}
                fillColor={COLORS.primary}
                unfillColor={COLORS.white}
                text="Keep me logged in"
                iconStyle={{ borderColor: COLORS.primary, borderRadius: 8 }}
                textStyle={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(2),
                  color: COLORS.darkBlack,
                  textDecorationLine: "none"
                }}
                onPress={() => handleChange("isChecked", !isChecked)}
              />
            </View>
            <View style={styles.buttonWidth}>
              <AppButton
                title={"Signup"}
                loading={loading}
                disabled={
                  !name ||
                  invalidPass ||
                  // !last_name ||
                  !email ||
                  !password ||
                  // !isChecked ||
                  password !== confirm_password
                }
                onPress={handleSignup}
              />
            </View>
          </>
        )}
        <View style={styles.row}>
          <View style={styles.hLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.hLine} />
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={handleFacebook}>
            <Image
              source={facebook}
              style={{ width: hp("15%"), height: hp("15%") }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoogle}>
            <Image
              source={google}
              style={{ width: hp("15%"), height: hp("15%") }}
            />
          </TouchableOpacity>
          {appleAuth.isSupported && (
            <TouchableOpacity onPress={handleApple}>
              <Image
                source={apple}
                style={{ width: hp("15%"), height: hp("15%") }}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleChange("active", active ? 0 : 1)}
        >
          <Text style={styles.dontacount}>
            {active ? "Already have an account" : "Don’t have an account?"}{" "}
            <Text style={styles.signUp}>{active ? "Login" : "Sign Up"}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
    // </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    backgroundColor: COLORS.white,
    height: "100%"
  },
  errorText: { width: "100%", marginBottom: 20 },
  textFieldContainer: { width: "90%" },
  top: {
    width: "100%",
    alignItems: "center",
    marginTop: 20
  },
  buttonWidth: { width: "90%", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center" },
  textInputContainer: {
    marginBottom: hp("2%"),
    height: hp(7),
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: "90%"
  },
  remeberContainer: {
    alignItems: "flex-end",
    width: "90%",
    marginTop: -10
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR,
    textDecorationLine: "underline"
  },
  signUpText: {
    marginTop: 20
  },
  loginText: {
    color: COLORS.primary,
    fontSize: hp(3),
    width: "90%",
    marginBottom: "5%",
    fontFamily: FONT1SEMIBOLD
  },
  backContainer: { width: "90%", alignItems: "flex-start", marginBottom: 30 },
  signUp: {
    color: COLORS.secondary,
    fontFamily: FONT1BOLD,
    textDecorationLine: "underline"
  },
  line: {
    width: "100%",
    backgroundColor: COLORS.grey,
    height: 5
  },
  activeline: {
    width: "100%",
    backgroundColor: COLORS.darkBlack,
    height: 5
  },
  tabs: {
    width: "90%",
    borderWidth: 1,
    paddingHorizontal: 5,
    height: hp(7),
    borderColor: COLORS.borderColor,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  tab: {
    width: "50%",
    alignItems: "center"
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: "50%",
    justifyContent: "center",
    height: hp(5),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  tabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  activeTabText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  row: { flexDirection: "row", alignItems: "center" },
  hLine: { height: 1, width: "40%", backgroundColor: COLORS.grey },
  orText: {
    color: COLORS.darkGrey,
    fontFamily: FONT1REGULAR,
    marginHorizontal: 10
  },
  dontacount: { color: COLORS.darkGrey, marginBottom: 20 },
  signUp: { color: COLORS.primary, textDecorationLine: "underline" },
  textInput: {
    color: COLORS.inputText,
    width: "80%",
    fontFamily: FONT1LIGHT,
    fontSize: hp(1.8)
  }
})

export default LoginScreen
