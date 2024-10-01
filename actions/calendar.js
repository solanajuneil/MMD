import { SET_SELECTED_DAY } from "../actionType/calendar"

export const setSelectedDay = weekDay => ({
    type: SET_SELECTED_DAY,
    payload: weekDay
})