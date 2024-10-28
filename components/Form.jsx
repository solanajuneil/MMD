import { useEffect, useMemo, useState } from "react"
import { ScrollView, TouchableOpacity, ActivityIndicator, Alert, View, StyleSheet, Platform, Text } from "react-native"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import CustomInput from "./CustomInput"
import CustomButton from "./CustomButton"
import CustomText from "./CustomText"
import uuid from 'react-native-uuid'
import DateTimePicker from "react-native-modal-datetime-picker"
import CheckmarkIcon from "../assets/icons/CheckmarkIcon"
import { useDispatch, useSelector } from "react-redux"
import { editIntake } from "../actions/intakes"
import { MEDICINE_DAYS } from "../constants/medicineDay"
import { router } from "expo-router"
import { CheckBox } from "react-native-elements"
import { useAuth } from "../context/authContext"

const Form = ({ type = "Add" }) => {
  const initialAddState = {
    id: uuid.v4(),
    name: "",
    dose: "",
    amount: "",
    reminder: "",
    reminderDays: [],
    takenOn: [],
    notificationId: [],
  }

  const { addMedicine, editMedicine, deleteMedicine } = useAuth()
  const dispatch = useDispatch()
  const { pressedIntake } = useSelector((state) => state.intakes)
  const user = useSelector((state) => state.user)
  const reminders = user?.reminders || [];
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false)


  const initialState = useMemo(() => {
    return type === "Add" ? initialAddState : pressedIntake
  }, [])
  const [formState, setFormState] = useState(initialState)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [datePickerVisible, setDatePickerVisible] = useState(false)


  useEffect(() => {
    const comparedValues = []
    const emptyValues = []
    for (let key in formState) {
      if (Array.isArray(formState[key]) && key !== "takenOn" && key !== "notificationId") {
        emptyValues.push(formState[key].length === 0)
        comparedValues.push(formState[key].sort().toString() === initialState[key].sort().toString())
      } else if (typeof formState[key] === "string") {
        emptyValues.push(formState[key] === "")
        comparedValues.push(formState[key] === initialState[key])
      }
    }
    const hasUpdateValues = comparedValues.some((value) => value === false)
    const hasEmptyValues = emptyValues.some((value) => value === true)
    setButtonDisabled(!hasUpdateValues || hasEmptyValues)
  }, [formState])

  const submitForm = async () => {
    if (type === "Add") {
      setButtonDisabled(true)
      const onAddSuccess = () => {
        dispatch(editIntake(formState))
        Alert.alert("Medicine added!", 'You can return to Home by clicking on "Ok"', [
          {text: "Ok" , onPress: ()=>router.navigate("home"), style: "cancel"}
        ])
      }
      const onAddFailure = () => Alert.alert("Something went wrong. Please try again")
      addMedicine(formState, onAddSuccess, onAddFailure)
    } else if (type === "Edit") {
      const onEditSuccess = () => {
        dispatch(editIntake(formState))
        Alert.alert(
          'Medicine updated',
          'You can return to Home by clicking on "Ok"',
          [{text: "Ok", onPress: ()=>router.navigate("home"), style: "cancel"}]
        )
      }
      const onEditFailure = () => Alert.alert("Something went wrong. Please try again")
      editMedicine(formState, onEditSuccess, onEditFailure)
    }
  }

  const onDeleteMedicine = () => {
    const onDeleteSuccess = () => {
      dispatch(editIntake(formState))
      Alert.alert("Medicine deleted!", 'You can return to Home by clicking on "Ok"', [
        {text: "Ok", onPress: ()=>router.navigate("home"), style: "cancel"}
      ])
    }
    const onDeleteFailure = () => Alert.alert("Something went wrong. Please try again")
    deleteMedicine(formState.id, initialState.notificationId, onDeleteSuccess, onDeleteFailure)
  }

  const handleDatePickerConfirm = date => {
    const formattedTimeString = 
      Platform.OS === "ios"
      ? date?.toLocaleString("de-AT", {hour: "2-digit", minute: "2-digit", formatMatcher: "basic"})
      : format(date, "hh:mm a", { locale: enUS }).toUpperCase()
    setFormState({ ...formState, reminder: formattedTimeString })
    hideDatePicker()
  }

  const showDatePicker = () => setDatePickerVisible(true)
  const hideDatePicker = () => setDatePickerVisible(false)

  const selectReminderDay = day => { 
    const isAdded = formState.reminderDays.findIndex(addedDay => addedDay === day) !== -1
    if (isAdded) {
      return setFormState({...formState, reminderDays: formState.reminderDays.filter(addedDay => addedDay !== day)})
    }
    setFormState({...formState, reminderDays: formState.reminderDays.concat(day)})
  }

  const handleChange = (amount) => {
    const numericAmount = amount.replace(/[^0-9]/g, '');

    if (numericAmount === '' || parseInt(numericAmount) <= 4) {
      setFormState({ ...formState, amount: numericAmount });
      setError(''); 
    } else {
      setError('Quantity cannot exceed 4 pills'); 
    }
  };

  const handleNameChange = (name) => {
    setFormState((prevState) => ({
      ...prevState,
      name,
    }));
    const normalizedName = name.trim().toLowerCase();
    const hasDuplicate = reminders.some(
      (reminder) => reminder.name.trim().toLowerCase() === normalizedName
    );

    setIsDuplicate(hasDuplicate); 
  };



  return (
    <ScrollView style={{width: "100%"}} contentContainerStyle={{paddingHorizontal: 25}} bounces={false} showsVerticalScrollIndicator={false}>
      <CustomText className="font-medium" style={styles.inputLabel}>
        Name<Text style={styles.asterisk}>*</Text> (e.g Ibuprofen)
      </CustomText>
      <CustomInput
        containerStyle={[
          styles.inputContainer,
          isDuplicate && styles.inputError, 
        ]}
        onChangeText={handleNameChange}
        value={formState.name}
        placeholder="Name"
        autoCorrect={false}
      />
       {isDuplicate && (
        <Text style={styles.errorText}>This name is already in use.</Text>
      )}
      <CustomText className="font-medium" style={styles.inputLabel}>
        Dose<Text style={styles.asterisk}>*</Text> (e.g. 100mg)
      </CustomText>
      <CustomInput
        containerStyle={styles.inputContainer}
        onChangeText={(dose) => setFormState({ ...formState, dose })}
        value={formState.dose}
        placeholder="Dose"
        autoCorrect={false}
      />
      <CustomText className="font-medium" style={styles.inputLabel}>
        Quantity<Text style={styles.asterisk}>*</Text> (e.g 3)
      </CustomText>
      <CustomInput
        containerStyle={styles.inputContainer}
        style={[
          styles.inputContainer,
          error ? styles.inputError : null, 
        ]}
        onChangeText={handleChange}
        value={formState.amount}
        placeholder="Amount"
        keyboardType="numeric"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <CustomText className="font-medium" style={styles.inputLabel}>
        Set Time<Text style={styles.asterisk}>*</Text>
      </CustomText>
      {
        formState.reminder ? (
          <TouchableOpacity onPress={showDatePicker} style={styles.reminder}>
            <CustomText className="font-medium" style={{fontSize: 16}} >
              {formState.reminder}
            </CustomText>
          </TouchableOpacity>
        ) 
          :
        (
          <TouchableOpacity onPress={showDatePicker} style={styles.reminder}>
            <CustomText className="font-medium" style={{fontSize:15}}>
              +  
            </CustomText>
          </TouchableOpacity>
        )}
     
      <DateTimePicker
          display="clock"
          isVisible={datePickerVisible}
          mode="time"
          onConfirm={handleDatePickerConfirm}
          onCancel={hideDatePicker}
        />
      
      <CustomText className="font-medium" style={styles.inputLabel}>
        Set Day<Text style={styles.asterisk}>*</Text>
      </CustomText>
      <View style={{marginBottom: 30}}>
        {MEDICINE_DAYS.map((day) => {
          const isChecked = formState.reminderDays.find((addedDay)=>addedDay === day.value)
          return(
            <CheckBox
              containerStyle={styles.checkBoxContainerStyle}
              uncheckedColor={isChecked ? "#3E5076" : "#96A5BA"}
              textStyle={styles.checkBoxTextStyle}
              checkedIcon={<CheckmarkIcon />}
              key={day.title}
              title={day.title}
              checked={isChecked}
              onPress={()=> selectReminderDay(day.value)}
            />
          )
        })}
      </View>
      {type === "Edit"
        ?  <CustomButton disabled={buttonDisabled} title="Update Medicine" onPress={submitForm} containerStyle={{ marginBottom: 25 }} /> 
        : <CustomButton disabled={buttonDisabled} title="Save Medicine" onPress={submitForm} containerStyle={{ marginBottom: 25 }} /> 
      }
      
      {type === "Edit" && (
        <View style={styles.deleteContainer}>
          <CustomText className="font-bold" style={styles.deleteTitle}>
              Attention!
          </CustomText>
          <CustomText style={styles.deleteDescription}>
              Once deleted, your medicine can't be restored again!
          </CustomText>
          <CustomButton
            onPress={onDeleteMedicine}
            title="Delete Medicine"
            titleStyle={styles.deleteBtnTitle}
            type="outline"
            buttonStyle={styles.deleteBtn}
            raised={false}
          />
        </View>
      )}
    </ScrollView>
  )
}


const styles =  StyleSheet.create({
    inputLabel: {
      fontSize: 18,
      width: "100%",
      marginLeft: 8,
      marginTop: 5,
      color: "#3E5076",
      fontFamily: "bold",
    },
    reminder: {
      width: "40%",
      alignItems: "center",
      marginLeft: 8,
      marginTop: 10,
      marginBottom: 30,
      borderWidth: 1,
      borderRadius: 7,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderColor: "#96A5BA",
    },
    addReminderBtn: {
      marginLeft: 8,
      marginTop: 10,
      marginBottom: 30,
      borderRadius: 50,
      height: 45,
      width: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#BCEBFE",
    },
    inputContainer: {
      width: "100%",
      marginRight: "auto",
    },
    dropDownPicker: {
      marginTop: 10,
      marginBottom: 30,
      marginLeft: 5,
      marginRight: 8,
      backgroundColor: "#EFFAFF",
      borderColor: "#96A5BA",
    },
    dropDownPickerText: {
      fontFamily: "medium",
      fontSize: 16,
      color: "#3E5076",
    },
    dropDownPickerContainer: {
      marginLeft: 5,
      marginTop: 5,
      backgroundColor: "#EFFAFF",
      borderColor: "#96A5BA",
    },
    arrowIconStyle: {
      // color: "#96A5BA",
    },
    placeholderStyle: {
      color: "#96A5BA",
    },
    deleteContainer: {
      padding: 25,
      borderWidth: 2,
      marginBottom: 30,
      borderStyle: "dashed",
      width: "100%",
      borderColor: "#DA282F",
    },
    deleteTitle: {
      fontSize: 14,
      textAlign: "center",
      color: "red",
      marginBottom: 15,
    },
    deleteDescription: {
      color: "red",
      textAlign: "center",
      marginBottom: 25,
    },
    deleteBtnTitle: {
      color: "#DA282F",
      fontFamily: "medium",
    },
    deleteBtn: {
      backgroundColor: "#EFFAFF",
      borderColor: "#DA282F",
      borderWidth: 1,
    },
    checkBoxContainerStyle: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      paddingLeft: 0,
    },
    checkBoxTextStyle: {
      color: "#96A5BA",
      fontFamily:"regular",
      fontSize: 16,
    },
    inputError: {
      borderColor: 'red', 
    },
    errorText: {
      paddingTop: 0,
      marginTop: 0,
      marginBottom: 15,
      color: 'red',
      fontSize: 14,
    },
    asterisk: {
      color: 'red', 
      fontSize: 17,
      margin: 0,
      padding: 0,
    },
  });

export default Form