import React, { useEffect, useState, useRef, useCallback, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity, Modal, Dimensions } from 'react-native'
import IntakesProgress from '../../components/IntakeProgress';
import Calendar from '../../components/Calendar';
import Screen from '../../components/Screen'
import MenuIcon from '../../assets/icons/MenuIcon';
import LogoutIcon from '../../assets/icons/LogoutRightIcon';
import CustomText from '../../components/CustomText';
import * as Notifications from "expo-notifications"
import { FAB } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp  } from "react-native-responsive-screen";
import { router, useFocusEffect } from 'expo-router'
import { useAuth } from '../../context/authContext';
import { IntakesList } from '../../components';
import { setUserData } from '../../actions/user';
import { pressOnIntake, setIntakesForToday } from '../../actions/intakes';
import { getFromSecureStore, saveToSecureStore } from '../../api/secureStore';
import { registerForPushNotificationsAsync } from '../../api/pushNotification';
import ProfileIcon from '../../assets/icons/SettingIcon';


const home = () => {
  const { getUser, signOutUser, checkMissDose } = useAuth()
  const [token, setToken] = useState("")
  const responseListener = useRef()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const calendar = useSelector((state) => state.calendar)
  const intakes = useSelector((state) => state.intakes)
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  
  const intakesForTodayTime = Array.isArray(intakes?.intakesForToday) 
    ? intakes.intakesForToday.map((reminderTime) => reminderTime.reminder) 
    : [];
  const intakesForTodayDate = calendar?.selectedDay?.date.toLocaleDateString("en-US");
  const intakesForTodayTakenOn = Array.isArray(intakes?.intakesForToday) 
    ? intakes.intakesForToday.map((takenMedication) => takenMedication.takenOn) 
    : [];
  
  
  useEffect(() => {
  const intervalId = setInterval(() => {
    checkMissDose(intakesForTodayTime, intakesForTodayDate, intakesForTodayTakenOn);
  }, 23 * 60 * 60 * 1000); 
    
  return () => clearInterval(intervalId);
}, [intakesForTodayTime, intakesForTodayDate, intakesForTodayTakenOn]);

// useEffect(() => {
//   const calculateTimeUntilNext11PM = () => {
//     const now = new Date();
//     const next11PM = new Date();
//     next11PM.setHours(23, 0, 0, 0); // Set time to 11:00 PM today

//     if (now > next11PM) {
//       next11PM.setDate(next11PM.getDate() + 1);
//     }

//     return next11PM - now; // Time in milliseconds until next 11:00 PM
//   };

//   
//   const initialTimeout = setTimeout(() => {
//    
//     checkMissDose(intakesForTodayTime, intakesForTodayDate, intakesForTodayTakenOn);

//
//     const intervalId = setInterval(() => {
//       checkMissDose(intakesForTodayTime, intakesForTodayDate, intakesForTodayTakenOn);
//     }, 24 * 60 * 60 * 1000); 

//    
//     return () => clearInterval(intervalId);
//   }, calculateTimeUntilNext11PM());

//   
//   return () => clearTimeout(initialTimeout);
// }, [intakesForTodayTime, intakesForTodayDate, intakesForTodayTakenOn]);

  useEffect(() => {
    const onSuccess = (userData) => dispatch(setUserData(userData))
    const showAlert = () => {
      Alert.alert("Something went wrong getting your data. You will be logged out safely", "", [
        { text: "Ok", onPress: () => signOutUser(), style: "cancel" }
      ])
    }
    getUser(onSuccess, showAlert)
  }, [calendar?.selectedDay, user?.newMedicineTaken, intakes?.editedIntake])

 useEffect(() => {
    const filteredIntakesForToday = user?.reminders?.filter((reminder) => reminder.reminderDays.includes(calendar?.selectedDay?.formatted));
    dispatch(setIntakesForToday(filteredIntakesForToday));
  }, [user?.reminders, calendar?.selectedDay]);

  useFocusEffect(
    useCallback(() => {
     dispatch(pressOnIntake(""))
     }, [])
  )

 const prevLength = useRef(intakesForTodayTakenOn.length);

useEffect(() => {
  if (intakesForTodayTakenOn && intakesForTodayTakenOn.length >= 12 && prevLength.current < 12) {
    Alert.alert(
      'Limit Exceeded',
      'You have exceeded the maximum limit of 12 doses for a today!',
      [{ text: 'OK' }]
    );
  }
  prevLength.current = intakesForTodayTakenOn.length; 
}, [intakesForTodayTakenOn]);




useEffect(() => {
    const bootstrapAsync = async () => {
      let deviceToken = await getFromSecureStore("deviceToken");
      if (deviceToken) {
        return setToken(deviceToken);
      }
     
      registerForPushNotificationsAsync().then((token) => {
        saveToSecureStore("deviceToken", token);
        setToken(deviceToken);
      });
    };

    bootstrapAsync();
    
    // **** REMOVE COMMENTS FOR DEBUGGING ****
    //  Notifications.cancelAllScheduledNotificationsAsync().then(response => console.log(response))
  //  Notifications.getAllScheduledNotificationsAsync().then(response => console.log(response));

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  }, []);

    const handleLogout = async () => { 
    Alert.alert(
    'Log Out',
    'Are you sure you want to log out?',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Logout canceled'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await signOut(FIREBASE_AUTH);
            console.log('User logged out');
            setDrawerVisible(false)
          } catch (error) {
            console.log(error.message);
          }
        },
      },
    ],
    { cancelable: true }
  );
  }

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handlePressInstruction = () => {
    setShowInstructions(!showInstructions)
  }

  return (
    <Screen>
      <View style={styles.mainContainer}>
        <Text>Today</Text>
          
            {/* <TouchableOpacity onPress={()=>router.push('profile')}>
              </TouchableOpacity> */}
            <View style={styles.userAvatar}>
              <TouchableOpacity onPress={toggleDrawer}>
                      <MenuIcon/>
                  </TouchableOpacity>
            
      
              <Modal
                  transparent={true}
                  animationType="fade"
                  visible={drawerVisible}
                  onRequestClose={toggleDrawer}
              >
                
              <TouchableOpacity style={styles.modalOverlay} onPress={toggleDrawer}>
              </TouchableOpacity>
          

              <View style={styles.drawerRightContainer}>
                    <TouchableOpacity onPress={toggleDrawer}>
                      <Text style={styles.closeButton}>X</Text>
                    </TouchableOpacity>

                    <View style={styles.menuItem}>
                    <TouchableOpacity onPress={() => { router.push('profile'); toggleDrawer(); }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ProfileIcon/>
                        <Text style={[styles.menuItem, styles.changeBottomSpace]} >My Profile</Text>
                      </View>
                      </TouchableOpacity> 

                      <TouchableOpacity onPress={handleLogout}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LogoutIcon />
                        <Text style={styles.menuItem}>Logout</Text>
                     </View>
                      </TouchableOpacity>
                    </View>
                  </View>
            </Modal>
           </View>
      </View>
      <Calendar/>
        <ScrollView bounces={false} style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center"}} showsVerticalScrollIndicator={false}> 
        <IntakesProgress />
        {intakesForTodayTakenOn && intakesForTodayTakenOn.length > 0
          ? <View style={{ paddingTop: 5 }}>
                <TouchableOpacity onPress={handlePressInstruction}>
                  <Text style={{ color: 'blue', fontSize: 15 }}>
                    {showInstructions ? 'Hide Instructions' : 'Click for Instructions'}
                  </Text>
                </TouchableOpacity>
                {showInstructions && (
                  <Text style={{fontSize: 15, color: 'black' }}>
                      Tap on a reminder to show two options: {'\n'}
                      Take (to mark it as taken) or Details (to view and edit the medication info).
                  </Text>
                )}
              </View>
          : null
        }
          <IntakesList/>
        </ScrollView>
        <FAB
          title="+"
          placement='right'
          color="#FFE190"
          titleStyle={styles.addMedicineIcon}
          containerStyle={{ marginBottom: hp(41) }}
          buttonStyle={{ borderRadius: 50 }}
          onPress={()=>router.navigate('addMedicineScreen')}
        />
      
    </Screen>
  ) 
}

const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
    mainContainer: {
      alignSelf: "flex-start",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: 15,
    },
    userAvatar: {
      marginLeft: "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    userSymbol: {
      color: "#fff",
      fontSize: 25,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
    },
  addMedicineIcon: {
      color: "#3E5076",
      fontSize: 25,
      fontFamily: "bold",
  },
   drawerButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  modalOverlay: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  drawerRightContainer: {
    position: 'absolute',
    right: 0,
    width: width * 0.75,
    height: height * 0.24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeButton: {
    fontSize: 20,
    textAlign: 'right',
  },
   menuItem: {
    fontSize: 18,
    marginVertical: 10,
  },
  changeBottomSpace: {
    paddingBottom: 15,
  }
  });

export default home