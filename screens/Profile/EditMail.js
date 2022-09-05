import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT2REGULAR } from '../../constants'
import { AppButton, AppInput, Header } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Toast from 'react-native-simple-toast'
import { useContext } from 'react'
import AppContext from '../../store/Context'
import { editProfile } from '../../api/auth'
import { TouchableOpacity } from 'react-native'
import { Text } from 'react-native'

function EditMail ({ navigation }) {
  const { user, _getProfile } = useContext(AppContext)
  // State
  const [state, setState] = useState({
    loading: false,
    email: user?.email || ''
  })

  const { email, loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }
  console.warn('user', user)
  const _editProfile = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        email
      }
      const token = await AsyncStorage.getItem('token')
      await editProfile(user?.id, payload, token)
      _getProfile()
      handleChange('loading', false)
      navigation.goBack()
      Toast.show(`Mail has been updated`)
    } catch (error) {
      handleChange('loading', false)
      const errorText = Object.values(error?.response?.data)
      Toast.show(`Error: ${errorText}`)
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Header
          title={'Edit Number'}
          color={COLORS.darkBlack}
          cross
          rightItem={
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Text style={styles.activeTabText}>{'Cancel'}</Text>
            </TouchableOpacity>
          }
        />
        <View style={{ width: '90%', marginTop: 20 }}>
          <AppInput
            value={email}
            onChange={handleChange}
            name={'email'}
            placeholder={'Edit Mail'}
            inputLabel={'Edit Mail'}
          />
        </View>
      </View>
      <View style={{ width: '90%', marginBottom: 20 }}>
        <AppButton title={'Save'} loading={loading} onPress={_editProfile} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  name: {
    color: COLORS.darkBlack,
    fontFamily: FONT1BOLD,
    fontSize: hp(2.5)
  },
  head: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  text: {
    color: COLORS.darkBlack,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    marginLeft: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  text1: {
    color: COLORS.grey,
    width: '80%',
    textAlign: 'center',
    fontFamily: FONT2REGULAR,
    fontSize: hp(2),
    marginTop: 10
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default EditMail
