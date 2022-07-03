import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TabBar } from '../components'
import Home from '../screens/Home'
import { COLORS } from '../constants'
import Profile from '../screens/Profile'
import Order from '../screens/Order'
import Journey from '../screens/Journey'

function MainTabNav () {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.white }
      }}
      initialRouteName={'Home'}
      tabBar={props => <TabBar {...props} />}
    >
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Journey' component={Journey} />
      <Tab.Screen name='Orders' component={Order} />
      <Tab.Screen name='Messages' component={Profile} />
      <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator>
  )
}

export default MainTabNav
