import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet,Text, Platform } from 'react-native'
import { isToday, format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import CustomText from './CustomText'

const IntakesProgress = () => {
   
    const user = useSelector((state) => state.user)
    const calendar = useSelector((state) => state.calendar)
    const intakes = useSelector((state)=>state.intakes)
    const [takenToday, setTakenToday] = useState([]);
    const [progressFill, setProgressFill] = useState(0);


  
    useEffect(() => {
        const takenMedicinesToday = [];
        intakes?.intakesForToday?.forEach((reminder) => {
          reminder?.takenOn?.forEach((takenEntry) => {
            const takenDate = takenEntry.date;
            if (takenDate === calendar?.selectedDay?.date?.toLocaleDateString("en-US")) {
              takenMedicinesToday.push(takenEntry);
            }
          });
        });
        setTakenToday(takenMedicinesToday);
    }, [user?.newMedicineTaken, calendar?.selectedDay?.date, intakes?.intakesForToday]);


    
    useEffect(() => {
      const fill = (takenToday.length * 100) / intakes?.intakesForToday?.length;
      setProgressFill(fill);
    }, [takenToday, intakes?.intakesForToday]);

    const allMedicinesTaken = useMemo(() => {
      if (takenToday.length !== 0 && intakes?.intakesForToday?.length !== 0) {
        return takenToday.length === intakes?.intakesForToday?.length
      }
      return;
    }, [takenToday, intakes?.intakesForToday])

    return (
      <View style={styles.mainContainer}>
        <View style={styles.innerContainer}>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={progressFill}
            tintColor={takenToday.length === intakes?.intakesForToday?.length ? "#19EDBE": "#BCEBFE"}
            backgroundColor={"rgba(216, 216, 216, 0.2)"}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.innerProgressContainer}>
                <CustomText h1fontWeight="bold">
                  DOSES
                </CustomText>
                <View style={{ flexDirection: "row" }}>
                  <CustomText className="font-bold" style={{ fontSize: 50, color: allMedicinesTaken ? "#19EDBE": "#BCEBFE" }}>
                    {takenToday.length}
                  </CustomText>
                  <CustomText className="font-bold" style={{ fontSize: 50, color: allMedicinesTaken ? "#19EDBE": "#3E5076" }}>
                    {" "}
                    / {intakes?.intakesForToday?.length}
                  </CustomText>
                </View>
                <CustomText>
                  {isToday(calendar?.selectedDay?.date)
                    ? "Today"
                    : Platform.OS === "ios"
                    ? `${calendar?.selectedDay?.date?.toLocaleString("en-US", { weekday: "long" })}`
                    : `${calendar?.selectedDay?.date && format(calendar.selectedDay.date, "EEEE", { locale: enUS })}`}
                </CustomText>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: "rgba(216, 216, 216, 0.2)",
      width: 240,
      height: 240,
      borderRadius: 240,
      alignItems: "center",
      justifyContent: "center",
    },
    innerContainer: {
      backgroundColor: "#fff",
      width: "90%",
      height: "90%",
      borderRadius: 250,
      alignItems: "center",
      justifyContent: "center",
    },
    innerProgressContainer: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      padding: 20,
      justifyContent: "space-around",
    },
  });


export default IntakesProgress

