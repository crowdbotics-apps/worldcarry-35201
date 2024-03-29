import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT2REGULAR } from '../../constants'
import { AppButton, AppInput, Header } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast'
import { useContext } from 'react'
import AppContext from '../../store/Context'
import { editProfile, updateProfile } from '../../api/auth'
import { TouchableOpacity } from 'react-native'

function EditUsername ({ navigation }) {
  const { user, _getProfile } = useContext(AppContext)
  // State
  const [state, setState] = useState({
    loading: false,
    name: user?.name || ''
  })

  const { name, loading } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const _editProfile = async () => {
    try {
      handleChange('loading', true)
      const payload = {
        name
      }
      const token = await AsyncStorage.getItem('token')
      await editProfile(user?.id, payload, token)
      _getProfile()
      handleChange('loading', false)
      navigation.goBack()
      Toast.show(`Username has been updated`)
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
          title={'Edit Name'}
          rightItem={
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Text style={styles.activeTabText}>{'Cancel'}</Text>
            </TouchableOpacity>
          }
          color={COLORS.darkBlack}
          cross
          rightEmpty
        />
        <View style={{ width: '90%', marginTop: 20 }}>
          <AppInput
            value={name}
            onChange={handleChange}
            name={'name'}
            placeholder={'Edit Name'}
            inputLabel={'Name'}
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
  activeTabText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  head: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
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

export default EditUsername
