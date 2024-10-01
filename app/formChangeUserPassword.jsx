import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import FormChangeUserPasswordScreen from './changeUserPasswordScreen'
import ArrowLeftIcon from '../assets/icons/ArrowLeftIcon'
import { CustomText } from '../components'
import { router } from 'expo-router'

const ChangeUserPassword = () => {
    const { back } = router()
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
                   Change Username/Password
                </CustomText>
          </View>
         <FormChangeUserPasswordScreen/>
    </View>
  )
}

export default ChangeUserPassword

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
  },})