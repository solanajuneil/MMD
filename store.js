import { configureStore} from "@reduxjs/toolkit"
import userReducer from "./reducers/user"
import calendarReducer from "./reducers/calendar"
import intakesReducer from "./reducers/intakes"



export const store = configureStore({
    reducer: {
        user: userReducer,
        calendar: calendarReducer,
        intakes: intakesReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
   })
})