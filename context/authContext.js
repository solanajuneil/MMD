import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { createContext, useState, useEffect, useContext } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import { doc, getDoc, updateDoc, setDoc } from "@firebase/firestore";
import { Alert } from "react-native";
import * as Notifications from 'expo-notifications'
import { scheduleNotification, cancelSingleNotification } from "../api/pushNotification";
export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const auth = getAuth()
    const currentUser = auth.currentUser
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(undefined)
   

     useEffect(() => {
        let unsub;
            const pollForEmailVerification = async (user) => {
                const checkVerification = setInterval(async () => {
                await user.reload();
                if (user.emailVerified) {
                    clearInterval(checkVerification); 
                    setIsAuthenticated(true);
                    setUser(user);
                }
                }, 5000); 
         };

         unsub = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                await user.reload()
                if (user.emailVerified) {
                    setIsAuthenticated(true)
                    setUser(user)
                } else {
                    setIsAuthenticated(false)
                    pollForEmailVerification(user)
                }
           }
           else {
            setIsAuthenticated(false);
            setUser(null);
           }
        })
        return unsub
    }, [])

  

    const getUser = async (onSuccessHandler = () => { }, onErrorHandler = () => { }) => {
        try {
            const currentUserDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            const currentUserData = await getDoc(currentUserDocRef)
            if (currentUserData.exists) {
                return onSuccessHandler(currentUserData.data())
            }
            throw new Error()
        } catch (error) {
            console.log(error)
            onErrorHandler()
        }
    }

    const addMedicine = async (newMedicine = {}, onSuccessHandler = () => { }, onErrorHandler = () => { }) => {
        let notificationId

        try {
            const dbUserDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            let dbUser = await getDoc(dbUserDocRef)
            dbUser = dbUser.data()
            const { reminders } = dbUser
      

            notificationId = await scheduleNotification(newMedicine.reminder, newMedicine.reminderDays, newMedicine.name)
            if (!notificationId) {
                throw new Error()
            }
           
            const payload = { ...newMedicine, notificationId }
            
            const updatedReminders = reminders.concat(payload)
            
            const updateUserReminderDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            await updateDoc(updateUserReminderDocRef, { reminders: updatedReminders })
          
            onSuccessHandler()
        } catch (error) {
            cancelSingleNotification(notificationId)
            console.log(error)
            onErrorHandler()
        }
    }
    
    const takeMedicine = async (date = new Date(), intakeId = "", onSuccessHandler = () => { }, onErrorHandler = () => { }) => {
        try {
            const time = new Date().toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric', hour12: true });
            const dbUserDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            let dbUser = await getDoc(dbUserDocRef)
            dbUser = dbUser.data()
            const { reminders } = dbUser
            
            
            let updatedIntakeIndex = 0
            const updatedIntake = reminders.find((reminder, index) => {
                if (reminder.id === intakeId) {
                    updatedIntakeIndex = index
                    return reminder
                }
            })
    
            const name = updatedIntake.name

            const isAlreadyTaken = updatedIntake.takenOn.some(taken => taken.date === date);
            if (!isAlreadyTaken) {
                updatedIntake.takenOn = [...updatedIntake.takenOn, { date, time, name }]
            }
            reminders[updatedIntakeIndex] = updatedIntake
 
            const updateUserMedicineDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            await updateDoc(updateUserMedicineDocRef, { reminders })
            
            onSuccessHandler()
        } catch (error) {
            console.log(error)
            onErrorHandler()
        }
    }
    
    const editMedicine = async (editMedicine = {}, onSuccessHandler = () => { }, onErrorHandler = () => { }) => {
        try {
            const allNotifications = await Notifications.getAllScheduledNotificationsAsync();

            const notificationIds = Array.isArray(editMedicine.notificationId) ? editMedicine.notificationId : [editMedicine.notificationId];

            const validNotifications = notificationIds.map(id => allNotifications.find(notification => notification.identifier === id))
            .filter(notification => notification !== undefined);

            
            if (validNotifications.length > 0) {
            validNotifications.forEach( async (notificationToEdit) => {
                await cancelSingleNotification(notificationToEdit.identifier);
            });
            }
           
            const notificationId = await scheduleNotification(editMedicine.reminder, editMedicine.reminderDays, editMedicine.name)
            
            if (!notificationId) {
                throw new Error("Something went wrong scheduling the new notification")
            }
            
            const dbUserDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            let dbUser = await getDoc(dbUserDocRef)
            dbUser = dbUser.data()
            const { reminders } = dbUser
            
            let updatedIntakeIndex = 0
            reminders.find((reminder, index) => {
                if (reminder.id = editMedicine.id) {
                    updatedIntakeIndex = index
                }
            })
            editMedicine.notificationId = notificationId
            reminders[updatedIntakeIndex] = editMedicine

            const updatedUserMedicineDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            await updateDoc(updatedUserMedicineDocRef, { reminders })
            
            onSuccessHandler()
        } catch (error) {
            console.log(error)
            onErrorHandler()
        }
    }

    const deleteMedicine = async (id = "", notificationId = [], onSuccessHandler = () => { }, onErrorHandler = () => { }) => {
        try {
            const dbUserDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            let dbUser = await getDoc(dbUserDocRef)
            dbUser = dbUser.data()
            const { reminders } = dbUser;

            const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
            
            console.log(updatedReminders)

            const updatedUserMedicineDocRef = doc(FIREBASE_DB, "users", currentUser.uid)
            await updateDoc(updatedUserMedicineDocRef, { reminders: updatedReminders })
            
           if (notificationId.length > 0) {
                notificationId.forEach(async (notifId) => {
                    await cancelSingleNotification(notifId);
                });
            }
           
            onSuccessHandler()
        } catch (error) {
            console.log(error)
            onErrorHandler()
        }
    }


    const signOutUser = async () => {
            try {
            await signOut(FIREBASE_AUTH); 
            } catch (error) {
            console.log(error.message);
            Alert.alert('Something went wrong');
            } finally {
            setLoading(false); 
            }
    }


return (
    <AuthContext.Provider value={{ user, isAuthenticated, getUser, addMedicine, signOutUser, takeMedicine, editMedicine, deleteMedicine}}>
        {children}
    </AuthContext.Provider>

)

}


export const useAuth = () => {
    const value = useContext(AuthContext)

    if (!value) {
        throw new Error('useAuth error')
    }
    return value
}