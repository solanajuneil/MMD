import { View, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'




const Home = () => {
  return (
    <SafeAreaView className="bg-slate-600 h-full">
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="flex-1 justify-center items-center">
         <ActivityIndicator size="large" color="gray"/> 
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="#000000" />
    </SafeAreaView>
  )
}

export default Home