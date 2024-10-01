import { View, StyleSheet} from 'react-native';
import { Form, CustomText, Screen } from '../../components'



const Create = () => {
  return (
   <Screen>
      <View style={styles.contentContainer}>
          <CustomText class="font-bold" style={styles.mainTitle}>
            Add Medicine
          </CustomText>
      </View>
      <CustomText className="font-medium" style={styles.medicineTitle}> 
         New Medicine
      </CustomText>
      <CustomText style={styles.description}>Fill out the fields and hit the Save Button to add it! </CustomText>
      <Form type="Add"/>
    </Screen>
  )
}


const styles = StyleSheet.create({
  contentContainer: {
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
 medicineTitle: {
    fontSize: 20, 
    marginBottom: 10,
  },
  description: {
    marginBottom: 40,
    textAlign: "center",
  },
});

export default Create