import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import {userLoginReducer} from "./reducers/userReducers";
import { albumReducer } from './reducers/albumReducers';

const reducers = combineReducers({
    userLogin: userLoginReducer,
    albumState: albumReducer
})

const userInfoFormStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : undefined

const initialState = {
    userLogin: { userInfo: userInfoFormStorage },
} as {}

const middleware = [thunk]

const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store

export type RootState = ReturnType<typeof store.getState>
