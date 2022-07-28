import React, { Fragment } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgXml } from 'react-native-svg'
import Tab1Icon from '../../assets/svg/tabs/Home.svg'
import Tab4Icon from '../../assets/svg/tabs/Chat.svg'
import Tab5Icon from '../../assets/svg/tabs/profile.svg'
import Tab3Icon from '../../assets/svg/tabs/Work.svg'
import Tab2Icon from '../../assets/svg/tabs/Send.svg'
import { COLORS, FONT1REGULAR, FONT1SEMIBOLD } from '../../constants'

function TabBar ({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index]?.key].options

  if (focusedOptions.tabBarVisible === false) {
    return null
  }

  return (
    <Fragment>
      <View style={styles.container}>
        {state?.routes.length > 0 &&
          state?.routes?.map((route, index) => {
            if (route) {
              const { options } = descriptors[route?.key]
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name

              const isFocused = state.index === index

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route?.key
                })

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name)
                }
              }

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route?.key
                })
              }

              const _getIcon = () => {
                switch (label) {
                  case 'Home':
                    return (
                      <View style={styles.inActiveTab}>
                        <SvgXml xml={Tab1Icon} width={25} height={25} />
                      </View>
                    )
                  case 'Journey':
                    return (
                      <View style={styles.inActiveTab}>
                        <SvgXml xml={Tab2Icon} width={25} height={25} />
                      </View>
                    )
                  case 'Orders':
                    return (
                      <View style={styles.inActiveTab}>
                        <SvgXml xml={Tab3Icon} width={25} height={25} />
                      </View>
                    )
                  case 'Messages':
                    return (
                      <View style={styles.inActiveTab}>
                        <SvgXml
                          xml={Tab4Icon}
                          style={{ opacity: isFocused ? 1 : 0.8 }}
                          width={25}
                          height={25}
                        />
                      </View>
                    )
                  default:
                    return (
                      <View style={styles.inActiveTab}>
                        <SvgXml xml={Tab5Icon} width={25} height={25} />
                      </View>
                    )
                }
              }

              return (
                <TouchableOpacity
                  key={label}
                  accessibilityRole='button'
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  activeOpacity={0.75}
                  onLongPress={onLongPress}
                  style={{
                    flex: 1,
                    borderTopWidth: isFocused ? 3 : 0,
                    borderTopColor: COLORS.primary,
                    paddingBottom: hp('2%'),
                    backgroundColor: isFocused
                      ? COLORS.lightblue
                      : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {_getIcon()}
                  <Text
                    style={{
                      fontFamily: isFocused ? FONT1SEMIBOLD : FONT1REGULAR,
                      fontSize: hp(1.6),
                      color: COLORS.navy
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            }
          })}
      </View>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(10)
  },
  inActiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: hp(7),
    height: hp('7%'),
    borderRadius: 20,
    borderTopWidth: 0
  }
})

export default TabBar
