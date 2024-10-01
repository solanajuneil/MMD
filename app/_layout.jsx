import { Stack, useSegments, router, SplashScreen } from 'expo-router'
import { AuthContextProvider, useAuth } from '../context/authContext'
import { useEffect} from 'react'
import { useFonts } from 'expo-font'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { store } from '../store'


const MainLayout = () => {
  const { isAuthenticated } = useAuth()
  const segments = useSegments()
  
  useEffect(() => {
  
    if (typeof isAuthenticated == 'undefined') return 
    const inApp = segments[0] == '(tabs)'
    if (isAuthenticated && !inApp) {
      router.replace('home')
    } else if (isAuthenticated == false) {
      router.replace('sign_in')
    }                  

  }, [isAuthenticated])
  
  return (
    <Stack> 
          <Stack.Screen name="index" options={{headerShown:false}} />
          <Stack.Screen name="(auth)" options={{headerShown:false}} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name='addMedicineScreen' options={{ headerShown: false }}/>
          <Stack.Screen name="medicineDetailsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  )
       
}


const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    light: require("../assets/fonts/Montserrat-Light.ttf"),
    regular: require("../assets/fonts/Montserrat-Regular.ttf"),
    medium: require("../assets/fonts/Montserrat-Medium.ttf"),
    bold: require("../assets/fonts/Montserrat-Bold.ttf"),
  })



 
  return (
    <Provider store={store}>
      <SafeAreaProvider>      
        <AuthContextProvider>
           <MainLayout />
        </AuthContextProvider>
      </SafeAreaProvider>
    </Provider>
    
   
  )
}

export default RootLayout