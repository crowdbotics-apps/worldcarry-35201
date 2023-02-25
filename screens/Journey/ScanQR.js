import React, { useCallback, useRef, useState } from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT1REGULAR } from '../../constants'
import Toast from 'react-native-simple-toast'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import scanCenter from '../../assets/svg/scanCenter.svg'
import scanButton from '../../assets/svg/scanQR.svg'
import { useFocusEffect } from '@react-navigation/core'
import { SvgXml } from 'react-native-svg'
import { updateOrderStatus } from '../../api/order'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ScanQR ({ route, navigation }) {
  const { orderID, order, jItem } = route?.params
  const scanner = useRef()
  const [state, setState] = useState({
    loading: false,
    visible: false,
    checkList: null,
    scanID: '',
    visible1: false,
    location: null
  })

  const { loading } = state

  useFocusEffect(useCallback(() => {}, []))

  const onSuccess = e => {
    handleChange('loading', true)
    if (e.data) {
      handleChange('scanID', e.data)
      handleQR(e.data)
    } else {
      handleChange('visible1', false)
    }
  }

  const handleQR = id => {
    if (orderID === id) {
      _makeDelivered(id)
    } else {
      alert('Please scan valid QR')
      scanner?.current?._setScanning(false)
      handleChange('loading', false)
    }
  }

  const _makeDelivered = async oid => {
    try {
      handleChange('loading', true)
      const token = await AsyncStorage.getItem('token')
      const payload = {
        order: oid,
        status: 'Received'
      }
      await updateOrderStatus(payload, token)
      Toast.show(`Order has been delivered`)
      handleChange('loading', false)
      navigation.navigate('JourneyDetails', {
        item: jItem,
        order,
        successDelivered: true
      })
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size={'large'} color={COLORS.white} />
      </View>
    )
  }

  return (
    <>
      <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
        <QRCodeScanner
          onRead={onSuccess}
          ref={scanner}
          flashMode={RNCamera.Constants.FlashMode.auto}
          containerStyle={{ height: '100%', width: '100%' }}
          cameraContainerStyle={{ height: '100%' }}
          cameraStyle={{ height: '100%' }}
        />
        <View style={styles.locationView}>
          <Text style={styles.titleText}>
            {`To mark as delivered, scan the QR code displayed on the Sender's phone.`}
          </Text>
        </View>
        <View style={styles.buttonTouchable}>
          <SvgXml xml={scanCenter} />
        </View>
        <View style={styles.buttonTouchable1}>
          <SvgXml xml={scanButton} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  textBold: {
    fontFamily: FONT1BOLD,
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: hp(2.2)
  },
  textBoldWhite: {
    fontFamily: FONT1BOLD,
    color: COLORS.white,
    marginTop: 20,
    textAlign: 'center',
    fontSize: hp(3)
  },
  titleText: {
    fontFamily: FONT1REGULAR,
    width: '90%',
    color: COLORS.white,
    textAlign: 'center',
    fontSize: hp(2)
  },
  buttonView: {
    width: 250,
    marginTop: 20
  },
  buttonText: {
    fontSize: 21,
    position: 'absolute',
    fontFamily: FONT1MEDIUM,
    color: COLORS.white
  },
  modalBody: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  locationView: {
    position: 'absolute',
    alignItems: 'center',
    width: '90%',
    borderRadius: 10,
    backgroundColor: COLORS.toastColor,
    paddingVertical: 8,
    top: 10,
    justifyContent: 'center'
  },
  buttonTouchable: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  buttonTouchable1: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    bottom: 20
  },
  loading: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: COLORS.modalBG
  },
  modalBG: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary
  }
})
