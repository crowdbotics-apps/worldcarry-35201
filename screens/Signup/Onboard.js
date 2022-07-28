import React, { createRef, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Carousel from 'react-native-snap-carousel'
import { SvgXml } from 'react-native-svg'
import LogoSplash from '../../assets/svg/onboardLogo.svg'
// import Udderly from '../../assets/svg/udderly.svg'
import { AppButton } from '../../components'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'

function Onboarding ({ navigation }) {
  let carouselRef = createRef()
  const sliderWidth = Dimensions.get('window').width
  const [state, setState] = useState({
    entries: [
      // {
      //   image: onboarding1
      // },
      // {
      //   image: onboarding2
      // },
      // {
      //   image: onboarding3
      // },
      // {
      //   image: onboarding4
      // }
    ],
    activeSlide: 0
  })
  const { activeSlide, entries } = state

  const _renderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.slide}>
        <Image
          source={item.image}
          style={{ width: '90%', height: '100%', resizeMode: 'stretch' }}
        />
      </View>
    )
  }

  const changeSlide = () => {
    if (activeSlide === 2) {
      navigation.navigate('Signup')
      return
    }
    carouselRef?._snapToItem(activeSlide + 1)
    setState(pre => ({ ...pre, activeSlide: pre.activeSlide + 1 }))
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerLogo}>
        <SvgXml
          xml={LogoSplash}
          style={{ transform: [{ rotate: '180deg' }], marginLeft: -20 }}
        />
        {/* <SvgXml xml={Udderly} /> */}
      </View>
      <View style={styles.carousel}>
        <Text style={styles.howtouse}>How to use this app</Text>
        <Carousel
          layout={'default'}
          ref={e => {
            carouselRef = e
          }}
          onSnapToItem={index =>
            setState(pre => ({ ...pre, activeSlide: index }))
          }
          data={entries}
          renderItem={_renderItem}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
        />
      </View>
      <View style={styles.buttonView}>
        <View style={styles.buttonWidth}>
          <AppButton
            title={'Signup'}
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  postfix: { flexDirection: 'row', alignItems: 'center' },
  carousel: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  slide: {
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  howtouse: {
    textAlign: 'center',
    fontFamily: FONT1BOLD,
    fontSize: hp('2.7%'),
    color: COLORS.secondary,
    width: '80%',
    marginBottom: 20
  },
  sub: {
    textAlign: 'center',
    fontFamily: FONT1REGULAR,
    fontSize: hp('2%'),
    marginTop: 10,
    width: '80%'
  },
  buttonView: {
    height: '15%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  buttonWidth: { width: 150 },
  dotStyle: {
    width: 12,
    height: 12,
    borderRadius: 10,
    marginHorizontal: -5,
    backgroundColor: COLORS.primary
  },
  inactiveDotStyle: {
    backgroundColor: COLORS.grey
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default Onboarding
