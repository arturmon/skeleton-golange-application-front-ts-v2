import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RootState } from "../store";
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
} from '../constants/userConstants';

// Define your ThunkDispatch type based on the RootState and AnyAction types
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// Login action
export const login = (email: string, password: string): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch: AppThunkDispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        const response = await fetch('http://localhost:10000/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (response.ok) {
//            const data = await response.json();
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

// Logout action
export const logout = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch: AppThunkDispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });

    await fetch('http://localhost:10000/v1/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
};

// Register action
export const register = (email: string, name: string, password: string, role: string): ThunkAction<Promise<Response>, RootState, unknown, AnyAction> => async (dispatch: AppThunkDispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        });

        const response = await fetch('http://localhost:10000/v1/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email,
                name,
                password,
                role,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch({
                type: USER_REGISTER_SUCCESS,
                payload: data, // Pass the entire data object
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            return response; // Return the response object
        } else {
            throw new Error(response.statusText); // Handle specific error scenarios
        }
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
        throw error; // Rethrow the error
    }
};


// New action to fetch user data
export const getUserData = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch: AppThunkDispatch) => {
    try {
        const response = await fetch('http://localhost:10000/v1/users/me', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (response.ok) {
            const userData = await response.json();

            // Dispatch an action with the fetched user data
            dispatch({
                type: 'FETCH_USER_SUCCESS',
                payload: userData,
            });
        } else {
            throw new Error('Failed to fetch user data'); // Handle specific error scenarios
        }
    } catch (error) {
        // Dispatch an action with the error message
        dispatch({
            type: 'FETCH_USER_FAIL',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

// Delete user action
export const deleteUser = (email: string): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch: AppThunkDispatch) => {
    try {
        // Make the API call to delete the user
        const response = await fetch('http://localhost:10000/v1/users/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email,
            }),
        });

        if (response.ok) {
            // User deletion successful
            localStorage.removeItem('userInfo');
            dispatch({ type: USER_LOGOUT });
        } else {
            // Handle specific error scenarios
            throw new Error('User deletion failed');
        }
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};
