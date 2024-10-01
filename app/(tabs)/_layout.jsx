import React from 'react'
import { Tabs } from 'expo-router'
import { Image, View, Text } from 'react-native'
import { icons } from '../../constants'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-semibold' : 'font-normal'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  )

}

const TabsLayout = () => {
  return (
  <>
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          position: "relative",
          bottom: hp(2.6),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center', 
          backgroundColor: 'white',
          marginHorizontal: hp(2.5),
          borderRadius: 25, 
          borderCurve: 'continuous',
          shadowColor: 'black',
          padding: hp(5),
          paddingBottom: hp(4),
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 10,
          shadowOpacity: 0.1
        }
      }}
      >

        <Tabs.Screen
          name='home'
          options={{
            title: "Home",
            headerShown: false, 
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='history'
          options={{
            title:"History",
            headerShown: false,
            tabBarIcon: ({color, focused }) => (
              <TabIcon
                icon={icons.history}
                color={color}
                name="History"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='create'
          options={{
            title: "Create", 
            headerShown: false, 
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                name="Create"
                color={color}
                focused={focused}
              />
            )
          }}  
        />
    </Tabs>
  </>
  )
}

export default TabsLayout