import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TabBar } from '../components'
import Home from '../screens/Home'
import { COLORS } from '../constants'
import Profile from '../screens/Profile'

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
      <Tab.Screen name='Journey' component={Home} />
      <Tab.Screen name='Orders' component={Home} />
      <Tab.Screen name='Messages' component={Profile} />
      <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator>
  )
}

export default MainTabNav
