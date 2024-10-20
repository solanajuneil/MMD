import { StyleSheet, Text, View, TextInput, Button, Alert, Modal, TouchableOpacity } from 'react-native'
import { CustomText } from '../components'
import ArrowLeftIcon from '../assets/icons/ArrowLeftIcon'
import { getAuth } from 'firebase/auth'
import { FIREBASE_RB } from '../firebaseConfig'
import { getDoc, updateDoc } from '@firebase/firestore'
import { useState, useEffect } from 'react'
import { ref, set, get} from 'firebase/database'
import {useRouter} from 'expo-router';


const DeviceBound = () => {
  const { back } = useRouter()
  const auth = getAuth()
  const currentUser = auth.currentUser
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null)

  const PASSWORD = 'password_123';
  
const sendDataToFirebase = async () => {
    try {
      const deviceRef = ref(FIREBASE_RB, 'esp8266/data');  // Ensure FIREBASE_DB is initialized with getDatabase()

      // Check if the device is already connected
      const snapshot = await get(deviceRef);
      const data = snapshot.exists() ? snapshot.val() : null;

      if (data && data.deviceConnected) {
          if (data.user === currentUser.uid) {
            Alert.alert('Device Status', 'You are already connected.');
            return;
          } else {
            Alert.alert('Device Status', 'Device is already connected by another user.');
            return;
          }
      }

      if (!currentUser) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const currentDate = Date.now();
      const formattedDateTime = formatDateTime(currentDate);  // Make sure formatDateTime is defined

      const jsonData = {
        timestamp: formattedDateTime,
        user: currentUser.uid,
        deviceConnected: true,
      };

      // Set data to Firebase
      await set(deviceRef, jsonData);
      console.log('Data sent to Firebase');
      Alert.alert('Success', 'Device connected successfully!');
    } catch (error) {
      console.error('Error sending data:', error);
      Alert.alert('Error', 'Failed to send data to Firebase');
    }
  };

const disconnectDevice = async () => {
  try {
    await set(ref(FIREBASE_RB, 'esp8266/data'), { deviceConnected: false });
    alert('Device disconnected!');
  } catch (error) {
    console.error('Error disconnecting from device:', error);
  }
};
  
function formatDateTime(timestamp) {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);

  // Get individual components with zero-padding for consistent formatting
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2,   
 '0'); // Months are 0-indexed
  const year = date.getFullYear();   


  // Format the time with AM/PM indicator based on your preference
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12; // Convert to 12-hour format (e.g., 12:00PM)

  // Construct the desired date and time string
  return `${hour12}:${minutes}${amPm}, ${month}/${day}/${year}`;
}

const showPasswordModal = () => {
    setPassword(''); // Clear password input
    setModalVisible(true); // Show modal for disconnect action
};

const handlePasswordConfirmation = () => {
    if (password === PASSWORD) {
        setModalVisible(false);
        disconnectDevice(); // Disconnect if the password is correct
    } else {
        Alert.alert('Error', 'Incorrect Password');
    }
};

return (
    <View style={{ flex: 1, backgroundColor: "#EFFAFF", paddingHorizontal: 20 }}>

        <View style={styles.contentContainer}>
            <TouchableOpacity onPress={() => back()}>
                <ArrowLeftIcon />
            </TouchableOpacity>
            <CustomText class="font-bold" style={styles.mainTitle}>
                Set Alarm
            </CustomText>
        </View>

        <View style={styles.container}>
            <Text style={styles.header}>Set Alarm into the Device</Text>

            {/* Connect Button - No Password Required */}
            <TouchableOpacity 
                style={styles.connectButton} 
                onPress={sendDataToFirebase} // Directly calls without password
            >
                <Text style={styles.buttonText}>Connect to ESP8266</Text>
            </TouchableOpacity>

            {/* Disconnect Button - Requires Password */}
            <TouchableOpacity 
                style={styles.disconnectButton} 
                onPress={showPasswordModal} // Show password modal
            >
                <Text style={styles.buttonText}>Disconnect from ESP8266</Text>
            </TouchableOpacity>

            {/* Password Modal */}
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Password</Text>
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handlePasswordConfirmation}
                        >
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    </View>
);
};


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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  disconnectButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#757575',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
  },
});

export default DeviceBound

