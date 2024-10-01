import { EDIT_INTAKE, PRESS_ON_INTAKE, SET_INTAKES_FOR_TODAY } from "../actionType/intakes"
export const editIntake = intake => ({
    type: EDIT_INTAKE,
    payload: intake
})

export const pressOnIntake = intake => ({
    type: PRESS_ON_INTAKE,
    payload: intake
})

export const setIntakesForToday = intakesForToday => ({
    type: SET_INTAKES_FOR_TODAY,
    payload: intakesForToday
})