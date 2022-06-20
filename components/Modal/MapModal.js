import React from 'react'
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native'
import { COLORS, FONT1REGULAR, mapStyle } from '../../constants'
import { SvgXml } from 'react-native-svg'
import CrossIcon from '../../assets/svg/cross.svg'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps' // remove PROVIDER_GOOGLE import if not using Google Maps
import zoomIcon from '../../assets/svg/zoomIcon.svg'

export default function MapModal ({
  modalVisible,
  setModalVisible,
  truckLocation,
  mapRef
}) {
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
            <Text style={styles.heading}>Map view</Text>
            <TouchableOpacity onPress={() => setModalVisible()}>
              <SvgXml xml={CrossIcon} width={20} height={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.mapView}>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              customMapStyle={mapStyle}
              initialRegion={truckLocation}
              // onPress={props => onMapPress(props.nativeEvent.coordinate)}
              onRegionChange={() => console.log('')}
              ref={mapRef}
            >
              {truckLocation && (
                <Marker
                  title={'My Location'}
                  style={{ alignItems: 'center' }}
                  // onPress={() => handleClickFood(truck)}
                  coordinate={{
                    latitude: truckLocation?.latitude,
                    longitude: truckLocation?.longitude
                  }}
                />
              )}
            </MapView>
            <TouchableOpacity
              style={styles.row}
              onPress={() => setModalVisible()}
            >
              <Text style={styles.zoomText}>Zoom out</Text>
              <SvgXml xml={zoomIcon} />
            </TouchableOpacity>
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
  row: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20
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
  mapView: {
    width: '100%',
    height: 300,
    borderRadius: 30,
    marginTop: 20,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
    overflow: 'hidden'
  },
  map: {
    ...StyleSheet.absoluteFillObject
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
