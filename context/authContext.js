import { getAuth, onAuthStateChanged } from "firebase/auth";
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

    const checkMissDose = async (intakesForTodayTime, intakesForTodayDate, intakesForTodayTakenOn) => {
        const parseTime = (timeStr, dateStr) => {
            const [hoursAndMinutes, period] = timeStr.split(" ");
            let [hours, minutes] = hoursAndMinutes.split(":").map(Number);
            if (period === "PM" && hours !== 12) {
                hours += 12;
            } else if (period === "AM" && hours === 12) {
                hours = 0;
            }
            const [month, day, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day, hours, minutes);
        };

        const checkIntakeStatus = (time, date) => {
            if (!intakesForTodayTakenOn || !Array.isArray(intakesForTodayTakenOn)) return;

            const takenEntries = intakesForTodayTakenOn.flat();
            const sameDayEntries = takenEntries.filter((entry) => entry.date === date);

            const scheduledTime = parseTime(time, date);
            const fiveMinutesBefore = new Date(scheduledTime.getTime() - 5 * 60 * 1000);
            const fiveMinutesAfter = new Date(scheduledTime.getTime() + 5 * 60 * 1000);

            const taken = sameDayEntries.some((entry) => {
                const takenTime = parseTime(entry.time, entry.date);
                return takenTime >= fiveMinutesBefore && takenTime <= fiveMinutesAfter;
            });

            return taken ? `Medication taken at ${time} on ${date}` : `Missed dose at ${time}`;
        };

    const sendNotification = async (title, message) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: message,
                sound: true,
            },
            trigger: null, 
        });
    };


        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        });

        if (formattedDate === intakesForTodayDate && Array.isArray(intakesForTodayTime)) {
            const intakeStatus = Array.isArray(intakesForTodayTime) 
            ? intakesForTodayTime.map((time) => checkIntakeStatus(time, intakesForTodayDate)) 
            : [];
           
             const missedDoses = intakeStatus.filter(status => status.includes('Missed dose'));
            const successfulIntakes = intakeStatus.filter(status => status.includes('Medication taken'));


            if (missedDoses.length > 0) {
                 const missedDosesMessage = missedDoses.join('\n')
                    await sendNotification("Missed Medication Dose", missedDosesMessage);
                
            }

            if (successfulIntakes.length > 0) {
                const successfulIntakeMessage = successfulIntakes.join('\n')
                    await sendNotification("Medication Successfully Taken", successfulIntakeMessage);
                
            }
            
        }
    };

    const editMedicine = async (editMedicine = {}, onSuccessHandler = () => { }, onErrorHandler = () => { }) => {
        try {
            const allNotifications = await Notifications.getAllScheduledNotificationsAsync();

            const notificationIds = Array.isArray(editMedicine.notificationId) ? editMedicine.notificationId : [editMedicine.notificationId];

            const validNotifications = notificationIds.map(id => allNotifications.find(notification => notification.identifier === id))
            .filter(notification => notification !== undefined);

          
            if (validNotifications.length > 0) {
            validNotifications.forEach((notificationToEdit) => {
                cancelSingleNotification(notificationToEdit.identifier);
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
            await signOut(FIREBASE_AUTH)
        } catch(error) {
            console.log(error.message)
            Alert.alert("Something went wrong")
        }
    }


return (
    <AuthContext.Provider value={{ user, isAuthenticated, getUser, addMedicine, signOutUser, takeMedicine, editMedicine, deleteMedicine, checkMissDose }}>
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