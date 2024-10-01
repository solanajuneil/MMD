import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions, Alert, TextInput, Image, Button } from 'react-native';
import { signOut } from 'firebase/auth'
import { router, useRouter } from 'expo-router'
import { FIREBASE_AUTH } from '../firebaseConfig'
import { useAuth } from '../context/authContext'
import { Screen } from '../components'
import ArrowLeftIcon from '../assets/icons/ArrowLeftIcon'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp  } from "react-native-responsive-screen";
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';

const Profile = () => {
  const { back } = useRouter()
  const user = useSelector((state) => state.user)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profilePicture, setProfilePicture] = useState(user?.DefaultUrlAvatar);
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  
  const [reminders, setReminderData] = useState([])

const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setBirthday(formattedDate);
    hideDatePicker();
  };

  useEffect(() => {
     loadProfileData()
  }, [])
  
  const saveProfileData = async () => {
    try {
      const profileData = {
        firstName,
        lastName,
        profilePicture,
        birthday,
        gender
      }
      await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
      alert('Profile data saved successfully!');
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  }
  
  const loadProfileData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('profileData');
      if (storedData) {
        const { firstName, lastName, profilePicture, age, birthday, gender } = JSON.parse(storedData);
        setFirstName(firstName);
        setLastName(lastName)
        setProfilePicture(profilePicture);
        setBirthday(birthday)
        setGender(gender)
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const reminderDataValueFunction = async () => {
    let reminderData = user?.reminders 
    setReminderData(reminderData)
  }

  useEffect(() => {
    reminderDataValueFunction()
  }, [])

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri); 
    }
  };

const takenOnData = reminders.filter(medication => medication.takenOn.length > 0).map(medication => medication.takenOn);

  let morningCount = 0;
  let afternoonCount = 0;
  let eveningCount = 0;
  
  const getTimePeriod = (time) => {
    const [hours, minutes] = time.split(/[: ]/).map(part => parseInt(part));
    const isPM = time.includes('PM');
    const hourIn24 = isPM && hours !== 12 ? hours + 12 : (hours === 12 && !isPM ? 0 : hours);
    
    if (hourIn24 >= 0 && hourIn24 < 12) {
        return "morning";
    } else if (hourIn24 >= 12 && hourIn24 < 18) {
        return "afternoon";
    } else {
        return "evening";
    }
  };
  
  takenOnData.forEach(medicationArray => {
    medicationArray.forEach(medication => {
        const timePeriod = getTimePeriod(medication.time);
        
        if (timePeriod === "morning") {
            morningCount++;
        } else if (timePeriod === "afternoon") {
            afternoonCount++;
        } else if (timePeriod === "evening") {
            eveningCount++;
        }
    });
});
  
 

  
  return (
    
    <Screen>
      <View style={styles.innerContainer}> 
                <TouchableOpacity onPress={()=>router.back()}>
                    <ArrowLeftIcon/>
                </TouchableOpacity>
                <Text className="font-bold" style={styles.mainTitle}>
                    My Profile
                </Text>
      </View>

    <View style={styles.container}>
      
      <TouchableOpacity onPress={handleSelectImage}>
        <Image 
          source={profilePicture ? { uri: profilePicture } : require('../assets/images/avatar.png')} // Default image fallback
          style={styles.profileImage} 
        />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
        />
      </View>

      <View style={styles.inputContainer}>
          <Text style={styles.label}>Birthday:</Text>
          <Text style={styles.input} onPress={showDatePicker}>
            {birthday ? birthday : 'Select your birthday'}
          </Text>
      </View>

        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
        />

      <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender:</Text>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
      </View>
        <View style={styles.buttonContainer}> 
          <Button title="Update Profile" onPress={saveProfileData}/>
        </View> 
            
           
        {/* <View style={styles.reminderContainer}>
            <Text style={styles.reminderTitle}>My Pill Reminders Stats</Text>
            
            <View style={styles.pillRow}>
              <Text style={styles.pillText}>Morning</Text>
            <Text style={styles.pillTime}>{morningCount }</Text>
            </View>
            
            <View style={styles.pillRow}>
              <Text style={styles.pillText}>Afternoon</Text>
            <Text style={styles.pillTime}>{afternoonCount }</Text>
            </View>
            
            <View style={styles.pillRow}>
              <Text style={styles.pillText}>Evening</Text>
            <Text style={styles.pillTime}>{eveningCount }</Text>
            </View>
        </View> */}
      </View>
  </Screen>
  )
}


const styles = StyleSheet.create({
  innerContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    width: "100%",
  },
  mainTitle: {
    fontSize: 30,
    marginLeft: "auto",
    marginRight: "auto",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#3E5076",
    marginBottom: 10,
  },
  // name: {
  //   paddingBottom: 5,
  //   paddingTop: 5,
  //   width: '100%',
  //   textAlign: 'center',
  //   fontSize: 29,
  //   padding: 8, 
  //   fontWeight: '500',
  //   color: '#333',
  // },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,  
    borderBottomWidth: 1,  
    borderBottomColor: '#ccc', 
    paddingBottom: 8,
    marginTop: 5,
  },
  label: {
    fontSize: hp(2.4),
    width: 110, 
    color: '#3E5076', 
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: hp(2),
    color: '#3E5076',
  },
  buttonContainer: {
    color: '#FFE190',
    marginTop: 20,  
    borderRadius: 5,
    overflow: 'hidden', 
  },

  reminderContainer: {
    backgroundColor: '#3E5076',
    borderRadius: 10,
    padding: 40,
    width: '100%',
    marginTop: 20,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  pillText: {
    fontSize: 16,
    color: '#fff',
  },
  pillTime: {
    fontSize: 16,
    color: '#4caf50',
  },
  menuItems: {
    marginTop: 16,
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
  },
  changeBottomSpace: {
    paddingBottom: 15,
  }
})
/// To DELETE THE AsyncStorage Data ----->
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const clearAllData = async () => {
//   try {
//     await AsyncStorage.clear();
//     console.log('All data cleared!');
//   } catch (error) {
//     console.error('Error clearing AsyncStorage:', error);
//   }
// };

export default Profile

