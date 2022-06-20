import React from 'react'
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import { AppButton } from '..'
import { SvgXml } from 'react-native-svg'
import CrossIcon from '../../assets/svg/cross.svg'
import tipBG from '../../assets/svg/tipBG.svg'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default function TipModal ({ modalVisible, setModalVisible }) {
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible()
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.crossEnd}>
            <View />
            <Text style={styles.heading}>Tips for buyers and sellers</Text>
            <TouchableOpacity onPress={() => setModalVisible()}>
              <SvgXml xml={CrossIcon} width={20} height={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.textView}>
            <Text style={styles.textBold}>Tips for Sellers </Text>
            <Text style={styles.text}>Protect your personal information.</Text>
            <Text style={styles.text}>
              Consider meeting in a public setting to exchange milk.
            </Text>
            <Text style={styles.text}>Share photos of available milk.</Text>
            <Text style={styles.text}>Share your milk storage methods.</Text>
            <Text style={styles.text}>Use a reliable form of payment.</Text>
            <Text style={styles.textBold}>Tips for Buyers</Text>
            <Text style={styles.text}>
              Consider using a home pasteurization method.
            </Text>
            <Text style={styles.text}>
              Ask the seller about their storage methods.
            </Text>
            <Text style={styles.text}>
              If requesting to have milk shipped, ensure the seller is using a
              safe shipping method.
            </Text>
            <Text style={styles.text}>
              Ask the seller questions about their lifestyle (diet, medications,
              etc)
            </Text>
          </View>
          <View style={styles.BGIcon}>
            <SvgXml xml={tipBG} />
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
  textView: {
    width: '90%'
  },
  BGIcon: {
    alignItems: 'flex-end',
    width: '100%',
    marginRight: -60,
    marginBottom: -30,
  },
  modalView: {
    width: '90%',
    backgroundColor: COLORS.backgroud,
    borderRadius: 0,
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
    fontFamily: FONT1BOLD,
    marginTop: 20,
    color: COLORS.navy,
    fontSize: hp(2.5)
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
