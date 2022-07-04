import React, { createRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import BG from '../../assets/images/WelcomeBG.png'
import Logo from '../../assets/svg/logoWhite.svg'
import { AppButton } from '../../components'
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'
import Carousel, { Pagination } from 'react-native-snap-carousel'

function Welcome ({ navigation }) {
  const sliderWidth = Dimensions.get('window').width
  let carouselRef = createRef()

  const [state, setState] = useState({
    entries: [
      {
        text: 'Start earning money from simply traveling! '
      },
      {
        text: 'Start earning money from simply traveling! '
      },
      {
        text: 'Start earning money from simply traveling! '
      }
    ],
    activeSlide: 0
  })
  const { entries, activeSlide } = state
  const handleNavigate = (route, type) => {
    navigation.navigate(route, { isType: type })
  }

  const _renderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.slide}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    )
  }

  function pagination () {
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 30,
          height: 5,
          borderRadius: 5,
          marginHorizontal: -8,
          backgroundColor: COLORS.white
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  return (
    <ImageBackground source={BG} style={styles.View_617_1877}>
      <View style={styles.top}>
        <View style={styles.skipView}>
          <AppButton
            width={80}
            backgroundColor={COLORS.white02}
            title={'Skip'}
            onPress={() => handleNavigate('LoginScreen')}
          />
        </View>
        <SvgXml xml={Logo} style={{ marginBottom: 30 }} />
        <Carousel
          layout={'default'}
          ref={e => {
            carouselRef = e
          }}
          onSnapToItem={index =>
            setState(pre => ({ ...pre, activeSlide: index }))
          }
          style={{ marginTop: 30 }}
          data={entries}
          renderItem={_renderItem}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
        />
        {pagination()}
      </View>
      <View style={styles.bottom}>
        <AppButton
          title={'Login'}
          width={'48%'}
          backgroundColor={'transparent'}
          color={COLORS.primary}
          onPress={() => handleNavigate('LoginScreen', 0)}
        />
        <AppButton
          width={'48%'}
          title={'Sign up'}
          onPress={() => handleNavigate('LoginScreen', 1)}
        />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  View_617_1877: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  top: {
    width: '90%',
    alignItems: 'center'
  },
  text: {
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONT1SEMIBOLD
  },
  bottom: {
    width: '90%',
    borderRadius: 13,
    height: hp(7),
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hp(2),
    paddingHorizontal: 5,
    backgroundColor: COLORS.white08
  },
  skipView: {
    width: '100%',
    alignItems: 'flex-end'
  }
})

export default Welcome
