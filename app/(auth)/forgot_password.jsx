import { View , StyleSheet, TouchableOpacity} from "react-native"
import ArrowLeftIcon from "../../assets/icons/ArrowLeftIcon"
import { CustomText } from "../../components"
import ForgotPasswordScreen from "./FormInputForgotPassword"
import { useRouter } from "expo-router"

const ForgotPassword = () => {
    const { back } = useRouter() 
  return (
    <View style={{
      flex: 1,
      backgroundColor: "#EFFAFF",
      paddingHorizontal: 20
    }}>
         <View style={styles.contentContainer}>
                <TouchableOpacity onPress={()=>back()}>
                    <ArrowLeftIcon/>
                </TouchableOpacity>
                <CustomText class="font-bold" style={styles.mainTitle}>
                    Add Medicine
                </CustomText>
          </View>
          <ForgotPasswordScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 50,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  mainTitle: {
    fontSize: 30,
    marginLeft: "auto",
    marginRight: "auto",
  },
})

export default ForgotPassword
