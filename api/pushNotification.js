import Constants from "expo-constants"
import * as Notifications from "expo-notifications"
import { Platform, Alert } from "react-native"
import { getWeekdayNumber } from "../utils/getWeekdayNumber";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
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

      const nextTriggerDate = getNextWeekdayDate(weekDayNumber, hour, minute);
      const TriggerDate = new Date(nextTriggerDate);


      let weekDayNumberRepeat = TriggerDate.getDay(); 
      if (weekDayNumberRepeat === 0) {
          weekDayNumberRepeat = 7;
        }

      const trigger = {
        weekday: weekDayNumberRepeat,
        hour: nextTriggerDate.getHours(),
        minute: nextTriggerDate.getMinutes(),
        repeats: true,
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
}

function getNextWeekdayDate(weekDayNumber, hour, minute) {
  const today = new Date();
  const currentDay = today.getDay(); 
  let daysUntilNextTrigger = (weekDayNumber - currentDay + 7) % 7;

  if (daysUntilNextTrigger === 0) {
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    if (currentHour > hour || (currentHour === hour && currentMinute >= minute)) {
      daysUntilNextTrigger = 7; 
    }
  }

  const nextTriggerDate = new Date(today);
  nextTriggerDate.setDate(today.getDate() + daysUntilNextTrigger);
  nextTriggerDate.setHours(hour);
  nextTriggerDate.setMinutes(minute);
  nextTriggerDate.setSeconds(0);

  return nextTriggerDate;
}


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