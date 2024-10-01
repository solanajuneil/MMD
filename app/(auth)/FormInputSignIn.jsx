import { StyleSheet, View, Text, Button, TextInput, StatusBar, Image, TouchableOpacity, Alert} from "react-native"
import { Link, router } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp  } from "react-native-responsive-screen";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import { images } from "../../constants";
import { FIREBASE_AUTH } from "../../firebaseConfig";


export const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
  const login = async () => {
     try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      return { success: true } 
       
    } catch (error) {
      let msg = error.message
      if (msg.includes('(auth/invalid-email)')) msg="Invalid email"
      if (msg.includes('(auth/invalid-credential)')) msg="Wrong credentials"
      return { success: false, msg } 
    }
  }
  
  const handleAuthentication = async () => {
    if (!email || !password) {
      Alert.alert('Sign In', 'Please fill all the fields')
      return
    }
    setIsLoading(true)

    const responseLogin = await login()
    setIsLoading(false)
    console.log('got result', responseLogin)

    if (!responseLogin.success) {
      Alert.alert('Sign In', responseLogin.msg)
    }
  }


  return (
    <CustomKeyboardView>
      <View className="flex-1"> 
        <StatusBar style="light" backgroundColor="#000000" />
        <View style={{ paddingTop: hp(8), paddingHorizontal: wp(4) }} className="flex-1 gap-8">
          
          <View className="items-center">
            <Image style={{height: hp(25)}} resizeMode="contain" source={images.login} />
          </View>

          <View className="gap-2">
            <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">Sign In</Text>
            
            <View className="gap-1">
              <View style={{height: hp(8)}} className="flex-row gap-2 px-4 bg-neutral-100 items-center rounded-xl"> 
                <Octicons name="mail" size={hp(2.7)} color="gray" />
                 <TextInput
                    style={{fontSize: hp(2)}}
                    className="flex-1 font-semibold text-neutral-700"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email address"
                    placeholderTextColor={'gray'}
                    autoCapitalize="none"
                  />
              </View>
            </View>

            <View className="gap-1">
              <View style={{height: hp(8)}} className="flex-row gap-2 px-4 bg-neutral-100 items-center rounded-xl"> 
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                  <TextInput
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-700"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor={'gray'}
                    autoCapitalize="none"
                    secureTextEntry
                  />
              </View>
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-right text-neutral-700">
                 <Link
                  href="/forgot_password"
                 >
                  Forgot Password? 
                </Link>
               </Text>
            </View>
        
            <View>
              {
                isLoading ? (<View>
                  {
                  //Loading=scr9899
                  }
                </View>)
                          : (<TouchableOpacity onPress={handleAuthentication} style={{height: hp(6.5)}} className="bg-indigo-500 rounded-xl justify-center items-center">
                              <Text style={{fontSize: hp(2.7)}} className="text-white font-bold tracking-wider">Sign In</Text>              
                           </TouchableOpacity>)
              }
            </View>

            <View className="flex-row justify-center">
                <Text style={{ fontSize: hp(1.8) }} className="font-psemibold text-neutral-500">Don't have an account? </Text>
                <Link
                  href="/sign_up"
                  style={{ fontSize: hp(1.8) }}
                  className="font-pbold text-indigo-500"
                >
                  Sign Up   
                </Link>
            </View>
            
          </View>

        </View>
      </View>
    </CustomKeyboardView>
  )
}


