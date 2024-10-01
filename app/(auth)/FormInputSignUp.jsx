import { StyleSheet, View, Text, Button, TextInput, Alert, StatusBar, Image, TouchableOpacity } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Feather, Octicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import { images } from "../../constants";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import { setDoc, doc} from "@firebase/firestore";

export const SignUp = () => {
  const DefaultUrlAvatar = images.defaultProfileImage
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
    
  const register = async () => {
    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      await sendEmailVerification(response.user)

      Alert.alert('Please check your email to verify your account')

      await setDoc(doc(FIREBASE_DB, "users", response?.user?.uid), {
          name,
          DefaultUrlAvatar,
          email: response?.user?.uid,
          reminders: []
        })
      return { success: true, data: response?.user }
      
      //Login successfully display 
      // router.replace('sign_in')
    } catch (error) {
      let msg = error.message
      if (msg.includes('(auth/invalid-email)')) msg = "Invalid email"
      if(msg.includes('(auth/email-already-in-use)')) msg = "This email is already in use"
      if(msg.includes('(auth/weak-password)')) msg = "Password should be at least 6 characters"
      return { success: false, msg }
      // Alert.alert('Authentication error ', error.message)
      //Error handling 
    }
  }
  
  const handleAuthentication = async () => {
    if (!email || !password || !name || !confirmPassword) {
      Alert.alert("Sign Up", "Please fill all the fields")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Your passwords need to match");
      return
    }
    setIsLoading(true)

    let registerResponse = await register()
    setIsLoading(false)
    console.log('got result', registerResponse)

    if (!registerResponse.success) {
      Alert.alert('Sign Up', registerResponse.msg)
    }    
    }


  return (
    <CustomKeyboardView>
      <StatusBar style="light" backgroundColor="#000000" />
      <View style={{paddingTop: hp(7), paddingHorizontal: wp(4)}} className="flex-1 gap-8">
        
        <View className="items-center">
          <Image style={{height: hp(25)}} resizeMode="contain" source={images.register}  />  
        </View>

        <View className="gap-2">
           <Text style={{fontSize: hp(4)}} className="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>
            
          <View className="gap-1">
              <View style={{height: hp(8)}} className="flex-row gap-2 px-4 bg-neutral-100 items-center rounded-xl">
                <Feather name="user" size={hp(2.7)} color="gray" />
                <TextInput
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  value={name}
                  onChangeText={setName}
                  placeholder="Account Name"
                  placeholderTextColor={'gray'}
                  autoCapitalize="none"
                />
               </View>
          </View> 
          
          
          <View className="gap-1">
              <View style={{height: hp(8)}} className="flex-row gap-2 px-4 bg-neutral-100 items-center rounded-xl">
                <Octicons name="mail" size={hp(2.7)} color="gray" />
                <TextInput
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor={'gray'}
                  autoCapitalize="none"
                />
               </View>
          </View>

          <View className="gap-1">
            <View style={{height: hp(8)}} className="flex-row gap-2 px-4 bg-neutral-100 items-center rounded-xl">
              <Octicons name="lock" size={hp(2.7)} color="gray"/>
              <TextInput
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700" 
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={'gray'}
                  secureTextEntry
                  autoCapitalize="none"
                />
            </View>
          </View>

          <View className="gap-1">
            <View style={{height: hp(8)}} className="flex-row gap-2 px-4 bg-neutral-100 items-center rounded-xl">
              <Octicons name="lock" size={hp(2.7)} color="gray"/>
              <TextInput
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700" 
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor={'gray'}
                  secureTextEntry
                  autoCapitalize="none"
                />
            </View>
          </View>
          
          
          <View className="pt-5">
            {
              isLoading ? (<View className="flex-row justify-center">
                {
                ///Loading=scr9799
                }
              </View>) :
                (<TouchableOpacity onPress={handleAuthentication} style={{height: hp(6.5)}} className="bg-indigo-500 rounded-xl justify-center items-center">
                  <Text style={{fontSize: hp(2.7)}} className="text-white font-bold tracking-wider">Sign Up</Text>
              </TouchableOpacity>)
            }
          </View>
                
              <View className="flex-row justify-center">
                <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Already have an account? </Text>
                <Link
                  href="/sign_in"
                  style={{ fontSize: hp(1.9) }}
                  className="font-bold text-indigo-500"
                >
                  Sign In   
                </Link>
              </View>
             
        </View>
      </View>
    </CustomKeyboardView>
  )
}