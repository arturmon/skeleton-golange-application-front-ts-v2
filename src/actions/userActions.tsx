import {USER_LOGIN_FAIL, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_LOGIN_REQUEST} from '../constants/userConstants'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RootState } from "../store";


export const login =
    (
        email: String,
        password: String
    ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
    async (
        dispatch: ThunkDispatch<RootState, unknown, AnyAction>
    ): Promise<void> => {
        try {
            dispatch({
                type: USER_LOGIN_REQUEST,
            })
            // interact with the backend
            const response = await fetch('http://localhost:10000/v1/login',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                })
            })

            const data = await response.json()
            const userData = { email: data.email }

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: userData,
            })

            localStorage.setItem('userInfo', JSON.stringify(userData))
        } catch (error){
            // USER LOGIN FAIL
            dispatch({
                type: USER_LOGIN_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            })

    }
}

export const logout =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
        async (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => {
            localStorage.removeItem('userInfo')
            dispatch({ type: USER_LOGOUT })

            await fetch('http://localhost:10000/v1/logout',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            })

        }

