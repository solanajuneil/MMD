export const getWeekdayNumber = (weekdayString) => {
    if (!weekdayString) {
        throw new Error("Must provide a valid weekday String!");
    }

    switch (weekdayString) {
      case "Sun":
        return 0; 
      case "Mon":
        return 1;
      case "Tue":
        return 2;
      case "Wed":
        return 3;
      case "Thu":
        return 4;
      case "Fri":
        return 5;
      case "Sat":
        return 6;
      default:
        return;
    }
};