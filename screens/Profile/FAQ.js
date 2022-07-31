import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { Icon } from 'react-native-elements'
import { COLORS, FONT1BOLD, FONT1REGULAR } from '../../constants'
import supportIcon from '../../assets/svg/supportIcon.svg'
import faq1 from '../../assets/svg/faq1.svg'
import faq2 from '../../assets/svg/faq2.svg'
import faq3 from '../../assets/svg/faq3.svg'
import faq4 from '../../assets/svg/faq4.svg'
import faq5 from '../../assets/svg/faq5.svg'
import { AppButton, AppInput, Header } from '../../components'
import { SvgXml } from 'react-native-svg'
import Accordion from 'react-native-collapsible/Accordion'
import searchIcon from '../../assets/svg/searchIcon.svg'

const list2 = [
  {
    title: 'Get started to WorldCarry',
    image: faq1,
    questions: [
      {
        title: 'How to shop on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'I am a sender, can I cancel my order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What can I order on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Why do I need to pay in advance?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What happens after I create an order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Where do I pick up my order?',
        content: 'Lorem ipsum...'
      }
    ]
  },
  {
    title: 'Orders Related',
    image: faq2,
    questions: [
      {
        title: 'How to shop on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'I am a sender, can I cancel my order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What can I order on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Why do I need to pay in advance?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What happens after I create an order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Where do I pick up my order?',
        content: 'Lorem ipsum...'
      }
    ]
  },
  {
    title: 'Journey Related',
    image: faq3,
    questions: [
      {
        title: 'How to shop on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'I am a sender, can I cancel my order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What can I order on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Why do I need to pay in advance?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What happens after I create an order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Where do I pick up my order?',
        content: 'Lorem ipsum...'
      }
    ]
  },
  {
    title: 'Payment Related',
    image: faq4,
    questions: [
      {
        title: 'How to shop on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'I am a sender, can I cancel my order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What can I order on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Why do I need to pay in advance?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What happens after I create an order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Where do I pick up my order?',
        content: 'Lorem ipsum...'
      }
    ]
  },
  {
    title: 'Verification Related',
    image: faq5,
    questions: [
      {
        title: 'How to shop on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'I am a sender, can I cancel my order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What can I order on WorldCarry?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Why do I need to pay in advance?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'What happens after I create an order?',
        content: 'Lorem ipsum...'
      },
      {
        title: 'Where do I pick up my order?',
        content: 'Lorem ipsum...'
      }
    ]
  }
]

function FAQ ({ navigation, route }) {
  // Context
  const [state, setState] = useState({
    questions: [],
    activeSections: [],
    filteredList: list2 || [],
    searchText: ''
  })
  const { questions, activeSections, searchText, filteredList } = state
  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }
  const goBack = () => {
    navigation.goBack()
  }

  const _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
        <Icon name={'down'} type={'antdesign'} color={COLORS.grey} size={18} />
      </View>
    )
  }

  const _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    )
  }

  const _updateSections = activeSections => {
    handleChange('activeSections', activeSections)
  }

  const filtered = (key, value) => {
    handleChange(key, value)
    if (value) {
      const newData = list2.filter(function (item) {
        const itemData = item.title
          ? item?.title?.toUpperCase()
          : ''.toUpperCase()
        const textData = value.toUpperCase()
        return itemData.indexOf(textData) > -1
      })
      handleChange('filteredList', newData)
    } else {
      handleChange('filteredList', list2)
    }
  }

  return (
    <View style={styles.container}>
      <Header
        back
        color={COLORS.darkBlack}
        title={'FAQ’s'}
        backPress={() =>
          questions?.length > 0
            ? handleChange('questions', [])
            : navigation.goBack()
        }
        rightItem={
          <AppButton
            title={'Support'}
            onPress={() => navigation.navigate('Support')}
            marginTop={-1}
            width={hp(15)}
            prefix={<SvgXml xml={supportIcon} style={{ marginRight: 5 }} />}
            backgroundColor={'transparent'}
            color={COLORS.primary}
          />
        }
      />
      <View style={{ width: '90%', marginTop: 10, marginBottom: 15 }}>
        <AppInput
          placeholder={'Search'}
          backgroundColor={COLORS.searchgrey}
          value={searchText}
          name={'searchText'}
          onChange={filtered}
          borderColor={'transparent'}
          prefix={<SvgXml xml={searchIcon} style={{ opacity: 0.6 }} />}
        />
      </View>
      {questions?.length > 0 ? (
        <Accordion
          sections={questions}
          containerStyle={{ width: '100%' }}
          activeSections={activeSections}
          // renderSectionTitle={_renderSectionTitle}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
        />
      ) : (
        <>
          {filteredList.map((item, index) => (
            <TouchableOpacity
              onPress={() => handleChange('questions', item.questions)}
              key={index}
              style={styles.listView}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '80%'
                }}
              >
                <SvgXml xml={item.image} />
                <Text
                  style={[
                    styles.name,
                    {
                      marginLeft: 10,
                      fontSize: hp(2),
                      color: COLORS.darkBlack
                    }
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Icon
                  name='right'
                  type='antdesign'
                  color={COLORS.darkGrey}
                  size={12}
                />
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    backgroundColor: COLORS.white,
    height: '100%',
    alignItems: 'center'
  },
  top: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  backContainer: { width: '40%', alignItems: 'flex-start', marginRight: 10 },
  header: {
    flexDirection: 'row',
    marginBottom: 30,
    width: '90%',
    alignItems: 'center'
  },

  loginText: {
    color: COLORS.darkGrey,
    fontSize: hp('3%'),
    fontFamily: FONT1REGULAR
  },
  heading: {
    color: COLORS.primary,
    fontSize: hp('3%'),
    fontFamily: FONT1BOLD
  },
  heading1: {
    color: COLORS.darkBlack,
    fontSize: hp(2.2),
    fontFamily: FONT1REGULAR,
    marginTop: 20,
    marginBottom: 10
  },
  text: {
    color: COLORS.darkGrey,
    fontSize: hp(2.2),
    fontFamily: FONT1REGULAR
  },
  body: {
    width: '90%'
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.tripBoxBorder,
    paddingHorizontal: '5%'
  },
  content: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: '5%'
  },
  headerText: {
    width: '80%',
    fontFamily: FONT1REGULAR,
    fontSize: hp(2),
    color: COLORS.darkBlack
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor1,
    height: 50,
    backgroundColor: COLORS.white
  }
})

export default FAQ
