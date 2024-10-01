import { PRESS_ON_INTAKE, EDIT_INTAKE, SET_INTAKES_FOR_TODAY } from "../actionType/intakes"
const initialState = {
    pressedIntake: "",
    editedIntake: "", 
    intakesForToday: []
}

const intakesReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRESS_ON_INTAKE:
            return {
                ...state,
                pressedIntake: {
                    ...action.payload,
                    notificationId: Array.isArray(action.payload.notificationId) 
                        ? action.payload.notificationId 
                        : [action.payload.notificationId] 
                }
            }
        case EDIT_INTAKE:
            return {
                ...state,
                editedIntake: {
                    ...action.payload,
                    notificationId: Array.isArray(action.payload.notificationId)
                        ? action.payload.notificationId
                        : [action.payload.notificationId]
                }
            }
        case SET_INTAKES_FOR_TODAY:
            return {
                ...state,
                intakesForToday: action.payload
            }
        default:
            return state
    }
}

export default intakesReducer