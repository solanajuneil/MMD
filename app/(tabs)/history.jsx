import React, {useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { useSelector } from 'react-redux';
import DateTimePicker from "react-native-modal-datetime-picker"


const HistoryGroupArray = React.memo(() => {
  const reminders = useSelector((state) => state.user?.reminders || []);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false)

  const takenOnData = reminders.filter(medication => medication.takenOn.length > 0).map(medication => medication.takenOn);

  const flattenedData = takenOnData.flat();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const groupedData = flattenedData.reduce((acc, item) => {
    const [month, day, year] = item.date.split("/");
    const formattedDate = `${monthNames[parseInt(month) - 1]} ${day}, ${year}`;

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(item);
    return acc;
  }, {});

  let groupedDataArray = Object.entries(groupedData);
  const sortedDataArray = groupedDataArray.sort((a, b) => {
    return a[0] < b[0] ? 1 : -1;
  });

  const filteredDataArray = sortedDataArray.filter(([date]) => {
    const dateParts = date.split(" ");
    const month = monthNames.indexOf(dateParts[0]) + 1;
    const day = parseInt(dateParts[1].replace(",", ""));
    const year = parseInt(dateParts[2]);

    const currentDate = new Date(`${year}-${month}-${day}`);
   
    const resetTime = (date) => new Date(date.setHours(0, 0, 0, 0));

    const adjustedStartDate = resetTime(new Date(startDate));
    const adjustedEndDate = resetTime(new Date(endDate));
    const adjustedCurrentDate = resetTime(new Date(currentDate));

    return adjustedCurrentDate >= adjustedStartDate && adjustedCurrentDate <= adjustedEndDate;
    
  });

  const renderHistoryGroup = ({ item }) => {
    const [date, entries] = item;

    return (
      <View style={styles.historyGroup}>
        <Text style={styles.dateText}>{date}</Text>
        {entries.map((entry, index) => {
          const [time, period] = entry.time.split(' ');
          const hour = parseInt(time.split(':')[0], 10);

          let noteText = '';
          if (period === "AM") {
            noteText = "Morning Taken";
          } else if (period === "PM" && hour < 5) {
            noteText = "Afternoon Taken";
          } else {
            noteText = "Evening Taken";
          }

          return (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.noteText}>{noteText}</Text>
              <Text style={styles.timeText} className="font-bold">{entry.name}</Text>
              <Text style={styles.timeText}>{entry.time}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisible(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisible(false);
  };

  const handleConfirmStartDate = (date) => {
     const today = new Date(); // Get today's date
  
  if (date > today) {
    Alert.alert("Invalid Date", "The start date cannot exceed today's date.",  [{ text: 'OK' }]);
  } else {
    setStartDate(date);
  }
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisible(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisible(false);
  };

  const handleConfirmEndDate = (date) => {
  if (startDate && date < startDate) {
    Alert.alert("Invalid Date", "End date cannot be before the start date.");
  } else {
    setEndDate(date);
    }
    hideEndDatePicker();
  };
 
  const handlePressSearch = () => {
    setShowSearch(!showSearch)
  }

  return (
    <>
      <TouchableOpacity style={styles.searchButton} onPress={handlePressSearch}>
        <Text style={styles.searchButtonText}>{showSearch ? 'X': 'Search'}</Text>
      </TouchableOpacity>

      {showSearch && (
        <View style={styles.containerSearch}>
          <TouchableOpacity style={styles.dateButton} onPress={showStartDatePicker}>
            <Text style={styles.buttonText}>Select Start Date</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmStartDate}
            onCancel={hideStartDatePicker}
          />
          <Text style={styles.dateText}>
            {startDate ? `Start Date: ${startDate.toDateString()}` : 'No start date selected'}
          </Text>

          <TouchableOpacity style={styles.dateButton} onPress={showEndDatePicker}>
            <Text style={styles.buttonText}>Select End Date</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmEndDate}
            onCancel={hideEndDatePicker}
          />
          <Text style={styles.dateText}>
            {endDate ? `End Date: ${endDate.toDateString()}` : 'No end date selected'}
          </Text>
        </View>
      )}
        
      <FlatList
        data={startDate || endDate ? filteredDataArray : sortedDataArray}
        renderItem={renderHistoryGroup}
        keyExtractor={(item, index) => `${item[0]}-${index}`}
      />
    </>
  );
});


const History = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <HistoryGroupArray />
    </View>
  );
};

const styles = StyleSheet.create({
   containerSearch: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#EFFAFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
  },
  historyGroup: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5076',
    marginBottom: 10,
  },
   historyItem: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    color: '#3E5076',
  },

  timeText: {
    fontSize: 14,
    color: '#3E5076',
  },
  dateButton: {
    backgroundColor: '#FFD54F', 
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#3E5076', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateTextSearch: {
    fontSize: 16,
    color: '#3E5076',
    marginVertical: 10,
    textAlign: 'center',
  },

  searchButton: {
    marginBottom: 7,
    borderWidth: 1,
    borderColor: '#424242', 
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'transparent', 
  },
  searchButtonText: {
    color: '#424242', 
    textAlign: 'center',
    fontSize: 16,
  },

});

export default History;
