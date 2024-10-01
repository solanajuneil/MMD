import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isToday, format } from 'date-fns'
import { enUS } from 'date-fns/locale';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { getWeekDays } from '../utils/getWeekDays';
import { setSelectedDay } from '../actions/calendar';
import CustomText from './CustomText';

const Calendar = () => {
  const dispatch = useDispatch()
  const { date } = useSelector((state) => state.calendar)
  const {selectedDay} = useSelector((state)=> state.calendar)
  const [week, setWeek] = useState([])

  useEffect(() => {
    const weekDays = getWeekDays(date)

    weekDays.forEach((weekday) => {
      if (isToday(weekday.date)) {
        dispatch(setSelectedDay(weekday))
      }
    })
    setWeek(weekDays)
  }, [date])
  
    return (
        <>
         <CustomText className="font-medium" style={styles.yearTitle}>
          {Platform.OS === 'ios'
            ? `${date?.toLocaleString("en-US", {month: "long", timeZone: "UTC"}).toUpperCase()}, ${date?.getFullYear()}`
            : `${date && format(date, "MMMM, y", {locale: enUS}).toUpperCase()}`
          }
         </CustomText>
          <View style={styles.weekContainer}>
          {week.map((weekday) => {
            const isSelectedDay = weekday.id === selectedDay?.id
            return (
              <TouchableOpacity
                activeOpacity={!isSelectedDay ? 0.2 : 1}
                onPress={() => {
                  if (!isSelectedDay) {
                    dispatch(setSelectedDay(weekday))
                  }
                }}
                key={weekday.formatted}
                style={[styles.weekDay, getBackgroundColor(isSelectedDay)]}
              >
                <CustomText className="font-bold" style={styles.weekDayIndex}>
                  {weekday.day}
                </CustomText>
                <CustomText style={styles.weekDayFormatted}>{weekday.formatted.toUpperCase()}</CustomText>
              </TouchableOpacity>
            )
            })}
          </View>   
        </>
    )

}

const styles = StyleSheet.create({
  yearTitle: {
    fontSize: 18,
    alignSelf: "flex-start",
    marginTop: 25,
    marginBottom: 10,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
  },
  weekDay: {
    width: "12%",
    borderRadius: 5,
    alignItems: "center",
    paddingVertical: 10,
  },
  weekDayIndex: {
    fontSize: 12,
    marginBottom: 5,
  },
  weekDayFormatted: {
    fontSize: 12,
  },
});

const getBackgroundColor = (isSelectedDay) => ({
  backgroundColor: isSelectedDay ? "#BCEBFE" : "rgba(226, 228, 232, 0.5)"
})

export default Calendar