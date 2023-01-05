import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity
} from 'react-native'
import { COLORS, FONT1REGULAR } from '../../constants'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Icon } from 'react-native-elements'
export default function AppInput({
  prefix,
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  postfix,
  secureTextEntry,
  keyboardType,
  maxLength,
  prefixBGTransparent,
  backgroundColor,
  height,
  inputLabel,
  dropdown,
  pickerItems,
  disabled,
  multiline,
  borderColor,
  borderRadius,
  onSubmitEditing,
  ref,
  returnKeyType,
  marginBottom,
  alignItems
}) {
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)
  const getValue = data => {
    const res = pickerItems?.filter(e => e.id === data)
    return res && res[0].name
  }
  return (
    <>
      {inputLabel && <Text style={styles.lebel}>{inputLabel}</Text>}
      <View
        style={[
          styles.container,
          {
            marginBottom: marginBottom || 0,
            borderRadius: borderRadius || 12,
            borderColor: borderColor || COLORS.primary,
            backgroundColor: backgroundColor ? backgroundColor : COLORS.white,
            height: height ? height : hp(6)
          }
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            { borderColor: focused ? COLORS.primary : 'transparent' }
          ]}
        >
          <View style={[styles.left, { alignItems: alignItems || 'center' }]}>
            {prefix && prefix}
            {dropdown && pickerItems ? (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
                onPress={() => setOpen(!open)}
              >
                <Text>{(value && getValue(value)) || placeholder}</Text>
                <Icon name={'down'} type={'antdesign'} />
              </TouchableOpacity>
            ) : (
              <TextInput
                rest
                onSubmitEditing={onSubmitEditing}
                ref={ref && ref}
                returnKeyType={returnKeyType}
                placeholder={placeholder}
                // onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false)
                  onBlur && onBlur()
                }}
                autoCapitalize='none'
                secureTextEntry={secureTextEntry}
                value={value}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                editable={disabled ? false : true}
                maxLength={maxLength || null}
                keyboardType={keyboardType || 'default'}
                onChangeText={text => onChange(name, text)}
                placeholderTextColor={COLORS.navy}
                style={[
                  styles.textInput,
                  {
                    marginTop: multiline ? 10 : 0,
                    textAlignVertical: multiline ? 'top' : 'center',
                    opacity: focused ? 1 : 0.7
                  }
                ]}
              />
            )}
          </View>
          {postfix && <View style={styles.postfix}>{postfix}</View>}
        </View>
      </View>
      {open &&
        pickerItems?.map(res => (
          <TouchableOpacity
            style={{
              width: '100%',
              justifyContent: 'center',
              borderBottomWidth: 1,
              borderBottomColor: COLORS.primary,
              height: 40,
              backgroundColor: COLORS.white
            }}
            onPress={() => {
              onChange(name, res.id)
              setOpen(!open)
            }}
          >
            <Text style={{ fontFamily: FONT1REGULAR, marginLeft: 10 }}>
              {res.name}
            </Text>
          </TouchableOpacity>
        ))}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: hp('1%'),
    justifyContent: 'center'
  },
  inputContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1
  },
  left: {
    width: '80%',
    height: '100%',
    flexDirection: 'row'
  },
  textInput: {
    color: COLORS.inputText,
    width: '100%',
    height: '100%',
    fontFamily: FONT1REGULAR,
    fontSize: hp(1.6)
  },
  lebel: {
    color: COLORS.navy,
    fontFamily: FONT1REGULAR,
    fontSize: hp(2)
  },
  checkIcon: {
    backgroundColor: COLORS.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  prefix: {
    width: hp('5%'),
    height: hp('5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  }
})
