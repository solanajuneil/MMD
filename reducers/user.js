import { SET_USER_DATA, TAKE_NEW_MEDICINE } from "../actionType/user"

const initialState = {
    newMedicineTaken: ""
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA: 
            return {
                ...state,
                ...action.payload
            }
        case TAKE_NEW_MEDICINE: 
            return {
                ...state,
                newMedicineTaken: action.payload
            }
        default: 
            return state
    }
}

export default userReducer