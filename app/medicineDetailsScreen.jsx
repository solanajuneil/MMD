import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Screen, CustomText, Form } from "../components";
import ArrowLeftIcon from "../assets/icons/ArrowLeftIcon";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const MedicineDetailsScreen = () => {
    const { back } = useRouter()
  const { pressedIntake } = useSelector((state) => state.intakes) 
  
    return (
        <Screen>
            <View style={styles.innerContainer}> 
                <TouchableOpacity onPress={()=>back()}>
                    <ArrowLeftIcon/>
                </TouchableOpacity>
                <CustomText className="font-bold" style={styles.mainTitle}>
                    Medicine Details
                </CustomText>
            </View>
            <CustomText className="font-medium" style={styles.medicineName}>
                {pressedIntake?.name} 
            </CustomText>
            <CustomText style={styles.description}>If you'd like to edit, change the fields and hit the save button!</CustomText>
            <Form type="Edit"/>
        </Screen>
    )

}

const styles = StyleSheet.create({
  innerContainer: {
    marginTop: 15,
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
 medicineName: {
    fontSize:20,
    marginBottom: 10,
  },
  description: {
    marginBottom: 40,
    textAlign: "center",
  },
});

export default MedicineDetailsScreen