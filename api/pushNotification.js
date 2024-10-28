import * as Notifications from "expo-notifications"
import { Platform, Alert } from "react-native"
import { getWeekdayNumber } from "../utils/getWeekdayNumber";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: true, 
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  
  return token;
};

export const sendPushNotification = async (expoPushToken, messageTitle = "", messageBody = "") => {
  if (!expoPushToken) {
    return;
  }

  const message = {
    to: expoPushToken,
    sound: true,
    title: messageTitle,
    body: messageBody,
    data: { someData: "goes here" },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

const parseTimeString = (timeString) => {
  const [time, period] = timeString.split(" ");
  let [hour, minute] = time.split(":").map(Number); 
  if (period === "PM" && hour < 12) {
    hour += 12; 
  } else if (period === "AM" && hour === 12) {
    hour = 0; 
  }

  return { hour, minute };
};

export const scheduleNotification = async (reminder, reminderDays, reminderName = "") => {
  try {
    const { hour, minute } = parseTimeString(reminder);
    const identifiers = []; 

    for (let day of reminderDays) {
      const weekDayNumber = getWeekdayNumber(day);
      if (weekDayNumber === null) {
        console.error("Invalid weekday string:", day);
        continue; 
      }

      // Get the next trigger date based on the weekday and time
      const nextTriggerDate = getNextTriggerDate(weekDayNumber, hour, minute);

      const trigger = {
        weekday: weekDayNumber + 1, 
        hour: nextTriggerDate.getHours(),
        minute: nextTriggerDate.getMinutes(),
        repeats: true, // Set to repeat weekly
      };

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time to take your ${reminderName}`,
          body: `${reminderName} is ready to be taken...`,
          sound: true,
        },
        trigger,
      });

      identifiers.push(identifier);  
    }

    return identifiers;

  } catch (error) {
    console.log("Error while scheduling notification:", error.message);
    return null;
  }
};

function getNextTriggerDate(weekdayNumber, hour, minute) {
  const today = new Date(); 
  const currentDay = today.getDay(); 
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  let daysUntilNextTrigger = (weekdayNumber - currentDay + 7) % 7;

  if (daysUntilNextTrigger === 0) {
    if (currentHour > hour || (currentHour === hour && currentMinute >= minute)) {
      daysUntilNextTrigger = 7; 
    }
  }

  const nextTriggerDate = new Date(today);
  nextTriggerDate.setDate(today.getDate() + daysUntilNextTrigger);
  nextTriggerDate.setHours(hour, minute, 0, 0);

  return nextTriggerDate;
}

export const checkRefill = async (name, amount) => {
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
        const message = `You have taken ${name} pill${amount !== 1 ? 's' : ''}. It's time to refill your prescription!`;

        await sendNotification("Refill Reminder", message);
};

export const checkWeekly = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Weekly Reminder",
            body: "Don't forget to remove the medications you are no longer taking!",
            sound: true,
        },
        trigger: {
            weekday: 1, // Every Monday
            hour: 9, // At 9 AM
            repeats: true, // Repeat every week
        },
    });
    };

export const checkMissDose = async (intakesForTodayTime, intakesForTodayDate, intakesForTodayTakenOn) => {
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
    

export const cancelSingleNotification = async (id = "") => {
  await Notifications.cancelScheduledNotificationAsync(id);
}


export const getAllNotifications = async () => {
  try {
    let notifications;
    Notifications.getAllScheduledNotificationsAsync().then(res => notifications = res);
    if (notifications) {
      return notifications;
    }
  } catch (error) {
    console.log(error);
  }
}