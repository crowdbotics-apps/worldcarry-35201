import React from 'react'
import {
  StyleSheet,
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity
} from 'react-native'
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import { AppInput, AppButton } from '..'
import { SvgXml } from 'react-native-svg'
import lockIcon from '../../assets/svg/lockIcon.svg'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default function SuccessModal ({ modalVisible, setModalVisible }) {
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      // onRequestClose={() => {
      //   setModalVisible()
      // }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.imageView}>
            <SvgXml xml={lockIcon} width={100} height={100} />
          </View>
          <View style={styles.textView}>
            <Text style={styles.textBold}>Password changed successfully </Text>
            <AppButton title={'Done'} onPress={setModalVisible} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: COLORS.modalBG,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageView: {
    width: '100%',
    alignItems: 'center'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  textView: {
    width: '90%',
    alignItems: 'center'
  },
  BGIcon: {
    alignItems: 'flex-end',
    width: '100%',
    marginRight: -60,
    marginBottom: -30
  },
  modalView: {
    width: '90%',
    backgroundColor: COLORS.backgroud,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textBold: {
    fontFamily: FONT1SEMIBOLD,
    marginTop: 10,
    color: COLORS.darkBlack,
    fontSize: hp(2.5),
    textAlign: 'center'
  },
  text: {
    fontFamily: FONT1REGULAR,
    color: COLORS.navy,
    fontSize: hp(2.5)
  },
  heading: {
    fontFamily: FONT1REGULAR,
    color: COLORS.navy,
    fontSize: hp(2.5)
  },
  buttonWidth: { width: '100%' },
  crossEnd: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
