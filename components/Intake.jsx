import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'expo-router'
import { View, TouchableWithoutFeedback, Alert, TouchableOpacity, StyleSheet, Button } from 'react-native'
import * as Haptics from 'expo-haptics'
import CheckmarkIcon from '../assets/icons/CheckmarkIcon'
import ClockIcon from '../assets/icons/ClockIcon'
import InfoIcon from '../assets/icons/InfoIcon'
import { takeNewMedicine } from '../actions/user'
import { pressOnIntake } from '../actions/intakes'
import CustomText from './CustomText'
import { useAuth } from '../context/authContext'
import { checkRefill } from '../api/pushNotification'



const PressedIntake = ({ id, name, amount, dose, reminders, setTaken }) => {
    const { takeMedicine } = useAuth()
    const router = useRouter()
    const dispatch = useDispatch()
    const calendar = useSelector((state) => state.calendar)
    
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const currentDate = new Date().toLocaleDateString("en-US");
    const selectedDay = calendar?.selectedDay?.date?.toLocaleDateString("en-US"

    )
    useEffect(() => {
        if (selectedDay === currentDate) {
            setButtonDisabled(false); 
        } else {
            setButtonDisabled(true); 
        }
    }, [selectedDay]); 


    const setTakenStates = () => {
        setTaken(true)
        checkRefill(name, amount)
        dispatch(takeNewMedicine(id))
    }

    const handleOnTake = () => {
        const formattedSelectedDay = calendar?.selectedDay?.date?.toLocaleDateString("en-US")
        takeMedicine(formattedSelectedDay, id, setTakenStates, () => Alert.alert("Something went wrong. Please try again"))
        dispatch(pressOnIntake(""))
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    }

 
    return (
        <View style={styles.pressedIntakeContainer}>
            { buttonDisabled 
            ?<CustomText className="font-bold" style={{ fontSize: 11, color: 'red' }}>
                Wait for the day
             </CustomText>
            :<TouchableOpacity onPress={handleOnTake} style={{ marginRight: "auto", marginLeft: 10 }}>
                <CustomText className="font-bold" style={{fontSize: 18}}>
                    TAKE
                </CustomText>
            </TouchableOpacity>
            }
            <TouchableOpacity style={{marginRight: 10, marginLeft: 25}} onPress={()=>router.push("medicineDetailsScreen")}>
                <View style={styles.pressedIntakeCenter}>
                    <View>
                        <CustomText className="font-bold" style={{fontSize:18, marginBottom: 5}}>
                            {name}
                        </CustomText>
                        <CustomText>
                            {amount}{` Pill${parseInt(amount) > 1 ? "s": ""}`}, {dose}
                        </CustomText>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10  }}>
             {""}
            </TouchableOpacity> 
        </View>
    )
}

const DefaultIntake = ({ taken, name, amount, dose, reminder }) => {
    return (
        <>
          {taken ? <CheckmarkIcon style={{ marginRight: 20 }} /> : <ClockIcon style={{marginRight: 20}} /> }
            <View>
                <CustomText className="font-bold" style={{fontSize: 18, marginBottom: 5}}>
                    {name}
                </CustomText>
                <CustomText className="font-light">
                    {amount}{` Pill${parseInt(amount) > 1 ? "s": ""}`}, {dose}
                </CustomText>
            </View>
            <View style={styles.defaultIntakeReminder}>
                <CustomText className="font-bold">{reminder}</CustomText>
            </View>
        </>
    )
}

const Intake = ({ id, takenOn, name, amount, dose, reminder, reminderDays, notificationId }) => {
    const calendar = useSelector((state) => state.calendar)
    const intakes = useSelector((state) => state.intakes)
    const dispatch = useDispatch()
    const [taken, setTaken] = useState(null)

    const subComponentsProps = {
        id,
        name,
        amount,
        dose,
        reminder,
        reminderDays,
        setTaken,
        taken,
        notificationId
    }

    const storeProps = {
        id,
        takenOn,
        name,
        amount,
        dose,
        notificationId,
        reminder,
        reminderDays,
    }

    const handleOnPress = () => {
        dispatch(pressOnIntake(storeProps))
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    }



      const isAlreadyTaken = (intakeId, takenOnArray) => {
      if (!intakeId || !takenOnArray) {
        return false;
          }
        const selectedDate = calendar?.selectedDay?.date?.toLocaleDateString("en-US")
      return takenOnArray?.some(entry => entry.date === selectedDate)
    }

    useEffect(() => {
        setTaken(isAlreadyTaken(id, takenOn))
        dispatch(pressOnIntake(""))
    }, [calendar?.selectedDay])

    return (
        <TouchableWithoutFeedback onPress={handleOnPress}>
            <View style={styles.intakeContainer}>
                {intakes.pressedIntake.id === id ? <PressedIntake {...subComponentsProps} /> : <DefaultIntake {...subComponentsProps} />}
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    intakeContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
    },
    pressedIntakeContainer: {
      backgroundColor: "#BCEBFE",
      width: "100%",
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    pressedIntakeCenter: {
      backgroundColor: "#fff",
      width:"auto",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      flexDirection: "row",
    },
    defaultIntakeReminder: {
      marginLeft: "auto",
      marginRight: 10,
      backgroundColor: "#BCEBFE",
      padding: 10,
      borderRadius: 10,
    },
  });

  export default Intake