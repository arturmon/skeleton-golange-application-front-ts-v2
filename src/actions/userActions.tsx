import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RootState } from "../store";
import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT } from '../constants/userConstants';

// Define your ThunkDispatch type based on the RootState and AnyAction types
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export const login = (email: string, password: string): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch: AppThunkDispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const response = await fetch('http://localhost:10000/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            //const userData = { email: data.email };
            const userData = { email: email };

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: userData,
            });

            localStorage.setItem('userInfo', JSON.stringify(userData));
        } else {
            throw new Error('Login failed'); // Handle specific error scenarios
        }
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const logout = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch: AppThunkDispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });

    await fetch('http://localhost:10000/v1/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
};
