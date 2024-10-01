import { SET_USER_DATA, TAKE_NEW_MEDICINE } from "../actionType/user"

export const setUserData = userData => ({
    type: SET_USER_DATA,
    payload: userData
})

export const takeNewMedicine = medicineId => ({
    type: TAKE_NEW_MEDICINE,
    payload: medicineId
})