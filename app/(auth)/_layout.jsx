import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign_in" options={{ headerShown: false }} />
        <Stack.Screen name="sign_up" options={{headerShown:false}}/>
        <Stack.Screen name="forgot_password" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default AuthLayout